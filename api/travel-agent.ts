// Edge Function: the travel agent. Gemini decides the filters, searches Supabase and streams its answer.
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { checkRateLimit, clientIp } from "./_lib/rateLimit.js";
import { parsePreferences, runSearch, searchInputSchema } from "./_lib/search.js";
import type { TravelPreferences } from "../src/types/travel.js";
import { portfolioKnowledge } from "../src/data/portfolioData.js";

export const config = { runtime: "edge" };

// Newer Gemini models are often overloaded, so the agent falls back down this list.
const AGENT_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.5-flash"];
const RATE_LIMIT_MAX_REQUESTS = 10;
const MAX_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 1000;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

type GoogleModel = ReturnType<ReturnType<typeof createGoogleGenerativeAI>>;

// One model object that tries each model in turn when a call fails before any output
function withFallback(models: GoogleModel[]): GoogleModel {
  const [first] = models;
  const attempt = async <T>(run: (model: GoogleModel) => PromiseLike<T>): Promise<T> => {
    let lastError: unknown;
    for (const model of models) {
      try {
        return await run(model);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };

  return {
    specificationVersion: first.specificationVersion,
    provider: first.provider,
    modelId: first.modelId,
    supportedUrls: first.supportedUrls,
    doGenerate: (options) => attempt((model) => model.doGenerate(options)),
    doStream: (options) => attempt((model) => model.doStream(options)),
  };
}

const messageText = (message: UIMessage) =>
  message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");

function buildSystemPrompt(preferences: TravelPreferences): string {
  // The month only steers phrases like "next month", so UTC is precise enough
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  const { travelStyle, favoriteCity, bucketList } = portfolioKnowledge.travelStats;

  return `You are the travel agent on Victor Hanert's portfolio site. You recommend destinations from a curated database for trips starting in Copenhagen, Denmark. It is currently ${month}.

How to work:
1. Always call searchDestinations before recommending anything. Turn what the visitor says into filters: a budget becomes maxCostDkk, "short flight" or a weekend becomes maxFlightHours, a time of year becomes months, a trip type becomes categories. Put the mood and specifics in query.
2. Then call showDestinations with the 3 to 6 best matches from the search result, each with one specific sentence on why it fits this request. Only use ids returned by searchDestinations. Never invent a destination.
3. Finish with at most three short sentences of plain text. No markdown, no lists, do not repeat the cards.

Follow-ups such as "cheaper", "warmer" or "shorter flight" refine the previous search: search again with the earlier filters kept and the new one adjusted.
If a search returns nothing, say so and suggest which filter to relax, or search again with fewer filters.
Costs are rough estimates per person for one week including flights from Copenhagen. Say "around" when you mention a price.
Reply in the language the visitor writes in. If asked about anything other than travel, say briefly that you only help with travel ideas.

${preferences.useVictorHistory
    ? `Results are ranked toward Victor's own taste: ${travelStyle} Favourite city: ${favoriteCity}. Bucket list: ${bucketList.join(", ")}. You may mention when a place fits his taste.`
    : "Results are not personalised. Do not mention Victor's taste."}
${preferences.includeVisited
    ? "Countries Victor has already visited are included."
    : "Countries Victor has already visited are excluded from every search. If the visitor asks for such a country, explain that the toggle 'Include visited countries' turns them on."}`;
}

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!checkRateLimit(clientIp(req), RATE_LIMIT_MAX_REQUESTS)) return json({ error: "Rate limit exceeded" }, 429);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: "GEMINI_API_KEY is not configured" }, 500);

  let body: { messages?: UIMessage[]; preferences?: Partial<TravelPreferences> };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || !Array.isArray(last.parts) || messageText(last).trim().length === 0) {
    return json({ error: "A user message is required" }, 400);
  }
  if (messages.some((m) => m.role === "user" && Array.isArray(m.parts) && messageText(m).length > MAX_MESSAGE_LENGTH)) {
    return json({ error: "Message too long" }, 400);
  }

  const preferences = parsePreferences(body.preferences);

  const google = createGoogleGenerativeAI({ apiKey });

  const result = streamText({
    model: withFallback(AGENT_MODELS.map((id) => google(id))),
    system: buildSystemPrompt(preferences),
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    maxOutputTokens: 1200,
    temperature: 0.4,
    maxRetries: 1,
    tools: {
      searchDestinations: tool({
        description: "Search the destination database. Returns up to 12 destinations, best match first.",
        inputSchema: searchInputSchema,
        execute: async (input) => {
          const destinations = await runSearch(input, preferences, apiKey);
          return { count: destinations.length, destinations };
        },
      }),
      showDestinations: tool({
        description: "Show destination cards to the visitor. Call once after searching, with the best matches.",
        inputSchema: z.object({
          picks: z.array(z.object({
            id: z.string().describe("Destination id from searchDestinations."),
            reason: z.string().max(220).describe("One sentence on why this fits the request."),
          })).min(1).max(6),
        }),
        execute: async ({ picks }) => ({ shown: picks.length }),
      }),
    },
    onError: ({ error }) => console.error("Travel agent error:", error),
  });

  return result.toUIMessageStreamResponse({
    onError: () => "The travel agent is unavailable right now. Please try again in a moment.",
  });
}
