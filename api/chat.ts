import { GoogleGenerativeAI } from "@google/generative-ai";
import { visitedCountries } from "../src/data/visitedCountries.js";
import { portfolioKnowledge } from "../src/data/portfolioData.js";
import { projects } from "../src/data/projectsData.js";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const { messages } = await req.json();
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
          history: messages.slice(-10).map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
        });

        const result = await chat.sendMessage(messages[messages.length - 1].content);
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