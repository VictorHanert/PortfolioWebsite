// Edge Function: counts that a visitor opened a destination, for the "Top destinations" page.
import { isSameOriginRequest } from "./_lib/origin.js";
import { checkRateLimit, clientIp } from "./_lib/rateLimit.js";
import { isUuid } from "./_lib/search.js";
import { recordDestinationEvents } from "./_lib/stats.js";

export const config = { runtime: "edge" };

const RATE_LIMIT_MAX_REQUESTS = 30;

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  if (!isSameOriginRequest(req)) return new Response(null, { status: 403 });
  if (!checkRateLimit(clientIp(req), RATE_LIMIT_MAX_REQUESTS)) return new Response(null, { status: 429 });

  let body: { destinationId?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isUuid(body.destinationId)) return new Response(null, { status: 400 });

  await recordDestinationEvents([body.destinationId], "opened");
  return new Response(null, { status: 204 });
}
