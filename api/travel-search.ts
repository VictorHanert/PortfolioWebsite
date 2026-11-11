// Edge Function: destination search for the filter panel. No language model involved.
import { checkRateLimit, clientIp } from "./_lib/rateLimit.js";
import { isUuid, parsePreferences, runSearch, searchInputSchema } from "./_lib/search.js";

export const config = { runtime: "edge" };

const RATE_LIMIT_MAX_REQUESTS = 20;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!checkRateLimit(clientIp(req), RATE_LIMIT_MAX_REQUESTS)) return json({ error: "Rate limit exceeded" }, 429);

  let body: { input?: unknown; preferences?: object; excludeId?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const input = searchInputSchema.safeParse(body.input ?? {});
  if (!input.success) return json({ error: "Invalid search input" }, 400);

  try {
    // excludeId is set when looking for places similar to one destination
    const excludeId = isUuid(body.excludeId) ? body.excludeId : null;
    const destinations = await runSearch(input.data, parsePreferences(body.preferences), process.env.GEMINI_API_KEY, excludeId);
    return json({ destinations });
  } catch (error) {
    console.error("Travel search error:", error);
    return json({ error: "Search failed" }, 500);
  }
}
