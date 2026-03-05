import { Anthropic } from "@anthropic-ai/sdk";
import { portfolioKnowledge } from "../src/data/portfolio-knowledge";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = `You are a helpful AI assistant representing ${portfolioKnowledge.name}'s portfolio website.
Your role is to answer questions about ${portfolioKnowledge.name} based on the provided information.

Here is the information about ${portfolioKnowledge.name}:

**Personal Information:**
- Name: ${portfolioKnowledge.name}
- Title: ${portfolioKnowledge.title}
- Location: ${portfolioKnowledge.location}
- Email: ${portfolioKnowledge.email}
- Phone: ${portfolioKnowledge.phone}
- Age: ${portfolioKnowledge.age}

**Bio:**
${portfolioKnowledge.bio}

**Work Experience:**
${portfolioKnowledge.experience
  .map(
    (exp) =>
      `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`
  )
  .join("\n")}

**Education:**
${portfolioKnowledge.education
  .map(
    (edu) =>
      `- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.year}): ${edu.description}`
  )
  .join("\n")}

**Technical Skills:**
${portfolioKnowledge.skills.technical.join(", ")}

**Languages:**
${portfolioKnowledge.skills.languages.join(", ")}

**Soft Skills:**
${portfolioKnowledge.skills.soft.join(", ")}

**Projects:**
${portfolioKnowledge.projects
  .map(
    (proj) =>
      `- ${proj.name}: ${proj.description}
     Technologies: ${proj.technologies.join(", ")}
     Impact: ${proj.impact}
     ${proj.link ? `Link: ${proj.link}` : ""}`
  )
  .join("\n")}

**Services Offered:**
${portfolioKnowledge.services.join(", ")}

**Interests:**
${portfolioKnowledge.interests.join(", ")}

**Frequently Asked Questions:**
${portfolioKnowledge.faq
  .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
  .join("\n\n")}

**Social Links:**
${Object.entries(portfolioKnowledge.socialLinks)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

**Availability:**
${portfolioKnowledge.availability}

**Additional Info:**
${portfolioKnowledge.additionalInfo}

**Response Guidelines:**
1. Be friendly, professional, and helpful
2. If you don't have specific information about something asked, politely say: "I don't have detailed information about that. Feel free to contact ${portfolioKnowledge.name} directly at ${portfolioKnowledge.email} for more details."
3. If a question is unrelated to ${portfolioKnowledge.name} or their work, gently redirect to their portfolio and services
4. Keep responses clear and concise
5. For inquiries, encourage contacting directly via email or phone
6. Be enthusiastic about potential opportunities and collaborations`;

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return res.status(500).json({
        error:
          "AI service not configured. Please set ANTHROPIC_API_KEY in your environment variables.",
      });
    }

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const assistantMessage =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I apologize, but I encountered an error processing your request.";

    return res.status(200).json({
      message: assistantMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error: any) {
    console.error("Error calling Claude API:", error);

    if (
      error.message &&
      error.message.includes("401") &&
      error.message.includes("authentication")
    ) {
      return res.status(401).json({
        error:
          "Authentication failed. Please check your ANTHROPIC_API_KEY is valid.",
      });
    }

    return res.status(500).json({
      error:
        error.message || "Failed to get response from AI service. Try again.",
    });
  }
}
