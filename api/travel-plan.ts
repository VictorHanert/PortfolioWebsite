// Edge Function: streams a day-by-day plan for one destination from the database.
import { streamText } from "ai";
import { agentModel } from "./_lib/models.js";
import { checkRateLimit, clientIp } from "./_lib/rateLimit.js";
import { isUuid, parsePreferences, supabaseConfig } from "./_lib/search.js";
import { findOrigin } from "../src/services/travelSearch.js";
import { portfolioKnowledge } from "../src/data/portfolioData.js";

export const config = { runtime: "edge" };

const RATE_LIMIT_MAX_REQUESTS = 6;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

interface PlanDestination {
  name: string;
  country: string;
  description: string | null;
  category: string[];
  best_months: number[] | null;
}

// The destination is read from the database by id, so the prompt never contains text supplied by the client
async function loadDestination(id: string): Promise<PlanDestination | null> {
  const { url, anonKey } = supabaseConfig();
  const res = await fetch(
    `${url}/rest/v1/travel_destinations?id=eq.${id}&select=name,country,description,category,best_months&limit=1`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
  );
  if (!res.ok) throw new Error(`Supabase lookup failed: ${res.status}`);
  return (await res.json())[0] ?? null;
}

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!checkRateLimit(clientIp(req), RATE_LIMIT_MAX_REQUESTS)) return json({ error: "Rate limit exceeded" }, 429);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: "GEMINI_API_KEY is not configured" }, 500);

  let body: { destinationId?: unknown; days?: unknown; month?: unknown; preferences?: object };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const days = Number(body.days);
  const month = Number(body.month);
  if (!isUuid(body.destinationId) || !Number.isInteger(days) || days < 1 || days > 14) {
    return json({ error: "destinationId and days (1-14) are required" }, 400);
  }

  let destination: PlanDestination | null;
  try {
    destination = await loadDestination(body.destinationId);
  } catch (error) {
    console.error("Travel plan error:", error);
    return json({ error: "Lookup failed" }, 500);
  }
  if (!destination) return json({ error: "Unknown destination" }, 404);

  const preferences = parsePreferences(body.preferences);
  const when = Number.isInteger(month) && month >= 1 && month <= 12 ? ` in ${MONTHS[month - 1]}` : "";
  const { travelStyle } = portfolioKnowledge.travelStats;

  const result = streamText({
    model: agentModel(apiKey),
    maxOutputTokens: 1800,
    temperature: 0.6,
    maxRetries: 1,
    system: `You write short, practical travel plans. Use only well-known, real places. If you are not sure a specific venue exists, describe the area or type of place instead of naming it.

Format, in Markdown:
- One line starting with "**The idea:**" that sums up the trip.
- Then one "### Day N: short title" heading per day, each followed by exactly three bullets starting with "**Morning:**", "**Afternoon:**" and "**Evening:**". One sentence per bullet.
- End with "### Good to know" and three short bullets (getting around, what to book ahead, one thing to skip).
No introduction, no closing remarks, no prices.`,
    prompt: `Plan ${days} day${days === 1 ? "" : "s"}${when} in ${destination.name}, ${destination.country}, for a traveller arriving from ${findOrigin(preferences.originCode).name}.
About the place: ${destination.description ?? ""} Known for: ${destination.category.join(", ")}.
${preferences.useVictorHistory ? `Tune it to this taste: ${travelStyle}` : "Keep it balanced for a first-time visitor."}`,
    onError: ({ error }) => console.error("Travel plan error:", error),
  });

  return result.toTextStreamResponse();
}
