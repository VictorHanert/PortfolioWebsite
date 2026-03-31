// Edge Function to call Gemini and get embedding for semantic search
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: 'edge' };

// Mock embedding for development (returns consistent hash-based vectors)
function generateMockEmbedding(text: string): number[] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Generate 768-dimensional vector
  const seed = Math.abs(hash) % 10000;
  const vector: number[] = [];
  for (let i = 0; i < 768; i++) {
    vector.push(Math.sin(seed + i) * 0.5 + 0.5);
  }
  return vector;
}

function to768Dimensions(values: number[]): number[] {
  if (values.length === 768) return values;
  if (values.length > 768) return values.slice(0, 768);
  return [...values, ...new Array(768 - values.length).fill(0)];
}

function isLocalRequest(req: Request): boolean {
  const url = new URL(req.url);
  const host = url.hostname;

  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;
  if (host.startsWith('192.168.')) return true;
  if (host.startsWith('10.')) return true;

  // 172.16.0.0 - 172.31.255.255
  if (host.startsWith('172.')) {
    const parts = host.split('.');
    const second = Number(parts[1]);
    if (!Number.isNaN(second) && second >= 16 && second <= 31) return true;
  }

  return false;
}

export default async function handler(req: Request) {
  try {
    const { text } = await req.json();

    if (isLocalRequest(req)) {
      // Development: return mock embedding
      const embedding = generateMockEmbedding(text);
      console.log('Using mock embedding for local development. Embedding length:', embedding.length);
      return new Response(JSON.stringify({ embedding }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Production: use real Gemini API
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured in production');
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelCandidates = ["gemini-embedding-001", "gemini-embedding-2-preview", "embedding-001"];

    let embedding: number[] | null = null;
    let lastError: unknown = null;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.embedContent(text);
        embedding = to768Dimensions(result.embedding.values);
        console.log(`Embedding model used: ${modelName}, length: ${embedding.length}`);
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!embedding) {
      throw lastError instanceof Error
        ? lastError
        : new Error('No embedding model was available for this API key/project.');
    }
    
    return new Response(JSON.stringify({ embedding }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Embed error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}