import { z } from "zod";
import { embedQuery } from "./embedding.js";
import { buildSearchArgs, findOrigin } from "../../src/services/travelSearch.js";
import { CATEGORY_OPTIONS, type DestinationRow, type TravelPreferences } from "../../src/types/travel.js";

// One search request. Used as the agent's tool input and as the body of /api/travel-search.
export const searchInputSchema = z.object({
  query: z.string().max(500).optional().describe("What the visitor is looking for, in English: mood, activities, food, scenery."),
  minCostDkk: z.number().int().nonnegative().optional().describe("Lower limit in DKK per person for one week including flights."),
  maxCostDkk: z.number().int().positive().optional().describe("Upper limit in DKK per person for one week including flights."),
  minFlightHours: z.number().nonnegative().optional().describe("Only destinations further away than this one-way travel time from Copenhagen in hours."),
  maxFlightHours: z.number().positive().optional().describe("Upper limit for one-way travel time from Copenhagen in hours."),
  months: z.array(z.number().int().min(1).max(12)).max(12).optional().describe("Travel months as numbers 1-12."),
  categories: z.array(z.enum(CATEGORY_OPTIONS)).max(16).optional().describe("Destinations must match at least one of these."),
});

export type SearchInputBody = z.infer<typeof searchInputSchema>;

export function supabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  return { url, anonKey };
}

export const isUuid = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

// Embeds the query when there is one, then calls the search_destinations RPC with the public anon key.
export async function runSearch(
  input: SearchInputBody,
  preferences: TravelPreferences,
  geminiKey: string | undefined,
  excludeId: string | null = null
): Promise<DestinationRow[]> {
  const { url, anonKey } = supabaseConfig();

  // A failed embedding should not break the search: the filters and the taste profile still rank
  let embedding: number[] | null = null;
  if (input.query?.trim() && geminiKey) {
    try {
      embedding = await embedQuery(input.query, geminiKey);
    } catch (error) {
      console.error("Query embedding failed, searching without it:", error);
    }
  }

  const res = await fetch(`${url}/rest/v1/rpc/search_destinations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    body: JSON.stringify(buildSearchArgs(input, preferences, embedding, excludeId)),
  });
  if (!res.ok) throw new Error(`Supabase search failed: ${res.status}`);

  return res.json();
}

export function parsePreferences(value: Partial<TravelPreferences> | undefined): TravelPreferences {
  return {
    useVictorHistory: value?.useVictorHistory !== false,
    includeVisited: value?.includeVisited === true,
    originCode: findOrigin(typeof value?.originCode === "string" ? value.originCode : "").code,
  };
}
