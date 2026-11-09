// Edge Function to call Gemini and get a query embedding for semantic search
export const config = { runtime: 'edge' };

// Must match scripts/seed-destinations.mjs and the vector(768) column in Supabase
const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = 768;
const MAX_TEXT_LENGTH = 2000;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const entry = rateLimitBuckets.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
};

const normalize = (values: number[]): number[] => {
  const norm = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
  return norm === 0 ? values : values.map((v) => v / norm);
};

// Mock embedding for offline development, only used when EMBED_MOCK=true
function generateMockEmbedding(text: string): number[] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  const seed = Math.abs(hash) % 10000;
  const vector: number[] = [];
  for (let i = 0; i < EMBEDDING_DIMENSIONS; i++) {
    vector.push(Math.sin(seed + i));
  }
  return normalize(vector);
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) return json({ error: "Rate limit exceeded" }, 429);

  let text: unknown;
  try {
    ({ text } = await req.json());
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (typeof text !== "string" || text.trim().length === 0) {
    return json({ error: "text is required" }, 400);
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return json({ error: "Text too long" }, 400);
  }

  if (process.env.EMBED_MOCK === "true" && process.env.VERCEL_ENV !== "production") {
    return json({ embedding: generateMockEmbedding(text) });
  }

  if (!process.env.GEMINI_API_KEY) {
    return json({ error: "GEMINI_API_KEY is not configured" }, 500);
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body: JSON.stringify({
          content: { parts: [{ text }] },
          taskType: "RETRIEVAL_QUERY",
          outputDimensionality: EMBEDDING_DIMENSIONS,
        }),
      }
    );

    if (!res.ok) {
      console.error("Gemini embed error:", res.status, await res.text());
      return json({ error: "Embedding request failed" }, 502);
    }

    const data = await res.json();
    return json({ embedding: normalize(data.embedding.values) });
  } catch (error) {
    console.error("Embed error:", error);
    return json({ error: "Embedding request failed" }, 500);
  }
}
