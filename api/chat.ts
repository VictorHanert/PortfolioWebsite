import { GoogleGenerativeAI } from "@google/generative-ai";
import { visitedCountries } from "../src/data/visitedCountries.js";
import { portfolioKnowledge } from "../src/data/portfolioData.js";
import { projects } from "../src/data/projectsData.js";

export const config = {
  runtime: 'edge',
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
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

const isValidMessage = (message: any): message is { role: string; content: string } => {
  return Boolean(message) && typeof message.role === "string" && typeof message.content === "string";
};

export default async function handler(req: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return new Response(null, { status: 405, headers: corsHeaders });

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: corsHeaders });
    }

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
    }

    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), { status: 400, headers: corsHeaders });
    }

    const lastMessage = messages[messages.length - 1];
    if (!isValidMessage(lastMessage) || lastMessage.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Last message is invalid" }), { status: 400, headers: corsHeaders });
    }

    const messageTooLong = messages.some((message: any) =>
      isValidMessage(message) && message.content.length > 2000
    );
    if (messageTooLong) {
      return new Response(JSON.stringify({ error: "Message too long" }), { status: 400, headers: corsHeaders });
    }

    if (!process.env.GEMINI_API_KEY) throw new Error("API Key Missing");

    // 1. Prepare dynamic travel stats
    const travelStats = visitedCountries.map(c => ({
      country: c.name,
      totalVisits: c.visits.length,
      lastVisit: c.visits[c.visits.length - 1]?.date
    }));

    // 2. The Unified Master Context
    const systemInstruction = `
    You are Victor Hanert's Personal AI Agent.
    
    ### DATASET: IDENTITY & BIO
    ${JSON.stringify(portfolioKnowledge)}

    ### DATASET: PROJECTS & WORK
    ${JSON.stringify(projects)}

    ### DATASET: TRAVEL HISTORY
    ${JSON.stringify(visitedCountries)}

    ### LIVE TRAVEL STATS (Use for counting/ranking)
    ${JSON.stringify(travelStats)}

    ### GUIDELINES:
    - Always cross-reference the STATS dataset for numbers.
    - Be professional, yet maintain a touch of wit as an authentic AI collaborator.
    - Use Markdown: **bold** for impact, bullet points for lists.
    - If asked about a project, use the 'PROJECTS' dataset to explain tech stack and impact.
    - If asked about travel, use the 'TRAVEL HISTORY' and 'LIVE TRAVEL STATS' for details and insights.
    - If you don't know the answer, say "I don't have that information." rather than making something up.
    - Always respond in the language the user is speaking (Danish or English).
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 3. Fallback Model List (Newest to most stable)
    const modelCandidates = [
      "gemini-3.1-flash-lite-preview", 
      "gemini-3-flash-preview", 
      "gemini-2.5-flash"
    ];

    let lastError;
    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemInstruction 
        });

        const chat = model.startChat({
          history: messages
            .filter(isValidMessage)
            .slice(-10)
            .map((m: any) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
        });

        const result = await chat.sendMessage(lastMessage.content);
        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ message: text }), { status: 200, headers: corsHeaders });
      } catch (e: any) {
        console.warn(`Model ${modelName} failed or timed out. Trying next...`);
        lastError = e;
        continue; // Try next model in the list
      }
    }

    throw lastError; // If all models fail, throw the last error

  } catch (error: any) {
    console.error("Critical Chat Error:", error);
    return new Response(JSON.stringify({ 
      error: "All AI models are currently busy. Please try again in a few seconds." 
    }), { status: 500, headers: corsHeaders });
  }
}