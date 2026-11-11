// Browsers send an Origin header on cross-site requests and on same-site POSTs. A request is accepted
// when it has no Origin (server-to-server, curl) or when the Origin is the host that received it.
// This keeps other websites from using the API through their visitors' browsers; it is not authentication.
export function isSameOrigin(origin: string | null | undefined, host: string | null | undefined): boolean {
  if (!origin) return true;
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// For edge functions, where the request URL carries the host the visitor used
export function isSameOriginRequest(req: Request): boolean {
  return isSameOrigin(req.headers.get("origin"), new URL(req.url).host);
}
