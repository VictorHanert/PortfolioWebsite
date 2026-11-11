// Edge Function: the most suggested or most opened destinations, for the "Top destinations" page.
import { supabaseConfig } from "./_lib/search.js";
import type { DestinationRow, TopDestination } from "../src/features/travel-agent/types.js";

export const config = { runtime: "edge" };

const DESTINATION_COLUMNS =
  "id,name,country,country_code,description,category,best_months,avg_cost_dkk,flight_hours,latitude,longitude,image_url,image_credit,image_credit_url,image_page_url";

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });

interface StatsRow {
  suggested_count: number;
  opened_count: number;
  destination: Omit<DestinationRow, "similarity" | "category_overlap"> | null;
}

export default async function handler(req: Request) {
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const column = new URL(req.url).searchParams.get("sort") === "opened" ? "opened_count" : "suggested_count";

  try {
    const { url, anonKey } = supabaseConfig();
    const res = await fetch(
      `${url}/rest/v1/travel_destination_stats?select=suggested_count,opened_count,destination:travel_destinations(${DESTINATION_COLUMNS})&${column}=gt.0&order=${column}.desc&limit=12`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
    );
    if (!res.ok) throw new Error(`Supabase lookup failed: ${res.status}`);

    const rows: StatsRow[] = await res.json();
    const destinations: TopDestination[] = rows.flatMap((row) =>
      row.destination
        ? [{
            destination: { ...row.destination, similarity: null, category_overlap: 0 },
            suggestedCount: row.suggested_count,
            openedCount: row.opened_count,
          }]
        : []
    );

    // The list changes slowly, so let the CDN keep it for a minute
    return json({ destinations }, 200, { "Cache-Control": "public, s-maxage=60" });
  } catch (error) {
    console.error("Travel top error:", error);
    return json({ error: "Lookup failed" }, 500);
  }
}
