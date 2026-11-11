import { isUuid } from "./search.js";

export type DestinationEvent = "suggested" | "opened";

// Adds to the "Top destinations" counters. Uses the service role, because the browser must not be able to
// write them. Never throws: a failed counter must not break a search.
export async function recordDestinationEvents(ids: unknown[], event: DestinationEvent): Promise<void> {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const destinationIds = ids.filter(isUuid);
  if (!url || !serviceKey || destinationIds.length === 0) return;

  try {
    const res = await fetch(`${url}/rest/v1/rpc/record_destination_events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      body: JSON.stringify({ destination_ids: destinationIds, event }),
    });
    if (!res.ok) console.error("Recording destination events failed:", res.status);
  } catch (error) {
    console.error("Recording destination events failed:", error);
  }
}
