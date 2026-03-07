import { GoogleGenerativeAI } from "@google/generative-ai";
import { visitedCountries } from "../src/data/visitedCountries.js";
import { portfolioKnowledge } from "../src/data/portfolioData.js";

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
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing API Key");

    // 1. Generate dynamic travel stats for the AI to ensure math accuracy
    const travelStats = visitedCountries.map(c => ({
      country: c.name,
      totalVisits: c.visits.length,
      lastTrip: c.visits[c.visits.length - 1]?.date
    }));

    // 2. Define the Unified System Prompt
    const systemInstruction = `
    You are Victor Hanert's Personal AI Assistant. 
    Use the following datasets to answer questions accurately.

    ### PORTFOLIO DATA:
    ${JSON.stringify(portfolioKnowledge)}

    ### TRAVEL DATA (Full History):
    ${JSON.stringify(visitedCountries)}

    ### TRAVEL STATISTICS (Use this for counting/rankings):
    ${JSON.stringify(travelStats)}

    ### RULES:
    1. Be concise, professional, and friendly.
    2. Respond in the same language the user uses (Danish or English).
    3. Use Markdown (bolding, lists) for readability.
    4. If asked about "most visited" or "how many times," refer to the TRAVEL STATISTICS.
    5. If information is not in the data, suggest contacting Victor at ${portfolioKnowledge.email}.
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // We use the most reliable flash model for 2026
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite-preview",
      systemInstruction: systemInstruction 
    });

    // Send the last 10 messages for context
    const chat = model.startChat({
      history: messages.slice(-10).map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;

    return new Response(JSON.stringify({ message: response.text() }), { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error("Chat Error:", error);
    return new Response(JSON.stringify({ error: "I'm having trouble thinking right now." }), { status: 500, headers: corsHeaders });
  }
}
