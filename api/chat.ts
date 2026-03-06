import { GoogleGenerativeAI } from "@google/generative-ai";
// import { visitedCountries } from "./visitedCountries.js";
import { visitedCountries } from "@/data/visitedCountries.js";

// Use Vercel Edge Runtime for faster cold starts
export const config = {
  runtime: 'edge',
};

const travelKeywords = [
  "travel",
  "trip",
  "visited",
  "country",
  "countries",
  "region",
  "destination",
  "destinations",
  "map",
  "vibe",
  "companions",
  "season",
  "seasonal",
  "mediterranean",
  "vacation",
  "holiday",
  "flight",
  "where should",
  "next destination",
  "analyze travel",
];

function isTravelQuery(query: string): boolean {
  const normalized = query.toLowerCase();
  return travelKeywords.some((keyword) => normalized.includes(keyword));
}

function getLatestUserQuestion(messages: any[], query?: string): string {
  if (typeof query === "string" && query.trim().length > 0) {
    return query.trim();
  }

  const latest = [...messages].reverse().find((msg) => msg?.role === "user" && typeof msg?.content === "string");
  return latest?.content?.trim() || "";
}

const portfolioKnowledge = {
  name: "Victor Hanert",
  title: "Full Stack Developer | Software Engineer | AI Enthusiast",
  location: "Valby, Denmark",
  city: "Valby, Denmark",
  adress: "Valby Langgade",
  email: "v.hanert@gmail.com",
  phone: "+45 60812114",
  age: 25,
  bio: `I'm a 25-year-old software developer with a passion for creating innovative software solutions. With high self-discipline and determination, I'm always ready to take on new challenges and responsibilities. I'm eager to learn new technologies and skills to further develop my career and contribute to the success of projects I'm involved in. I'm energetic and positive, valuing good relationships and team collaboration. I place great importance on physical well-being and maintain an active lifestyle. I'm passionate about travelling and exploring new cultures, which helps me grow personally and professionally.`,
  experience: [
    {
      company: "Pandi Web Projects",
      position: "Full Stack Developer",
      duration: "Ongoing",
      description: "Developing and maintaining web applications using Laravel, Vue.js, and PHP. Working on diverse client projects, delivering modern, scalable web solutions with responsive interfaces and robust backend architectures.",
    },
  ],
  education: [
    {
      institution: "KEA (Copenhagen School of Design and Technology)",
      degree: "Datamatiker (AP degree in Computer Science)",
      field: "Software Development",
      year: "2024",
      description: "Final exam project: CineMatch - a fullstack application for finding movies and creating watchlists with focus on backend APIs and database integration.",
    },
  ],
  skills: {
    technical: [
      "JavaScript", "TypeScript", "React", "Vue.js", "SvelteKit", "Svelte", "Next.js",
      "Laravel", "PHP", "Node.js", "Express.js", "Java", "Spring Boot", "Python",
      "HTML", "CSS", "Tailwind CSS", "Three.js",
      "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase",
      "Git", "Docker", "AWS", "Azure", "Vercel", "GitHub Actions",
      "REST APIs", "GraphQL", "WebSockets", "Microservices",
    ],
    languages: ["Danish (Native)", "English (Fluent)"],
    soft: ["Problem-solving", "Teamwork", "Communication", "SCRUM/Agile", "Self-discipline", "Quick learner", "Leadership"],
  },
  projects: [
    {
      name: "Pandi Web Projects",
      description: "Client web applications using Laravel, Vue.js, and PHP",
      technologies: ["Laravel", "Vue.js", "PHP", "Inertia.js", "MySQL", "Tailwind CSS"],
      link: "https://pandiweb.dk",
      impact: "Delivered multiple scalable web solutions for diverse clients",
    },
    {
      name: "Dream Delivery A/S",
      description: "Order and delivery management system with customer portal and admin dashboard",
      technologies: ["SvelteKit", "TypeScript", "PocketBase", "Tailwind CSS"],
      link: "https://dreamdelivery.dk",
      impact: "Final exam project in collaboration with startup company",
    },
    {
      name: "CineMatch",
      description: "Fullstack application for finding movies and creating watchlists",
      technologies: ["Svelte", "Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redis"],
      link: "https://github.com/Teller501/Node_Eksamen",
      impact: "Exam project focusing on RESTful APIs and database integration",
    },
    {
      name: "The Planner Studio",
      description: "3D furniture visualization tool for importing and manipulating sofa models",
      technologies: ["Three.js", "Vue.js", "Laravel", "Inertia.js"],
      impact: "Custom 3D program for interactive product visualization",
    },
    {
      name: "Tirage Champagne Bar Website",
      description: "Web design and e-commerce implementation for local champagne bar",
      technologies: ["WordPress", "WooCommerce", "HTML", "JavaScript", "CSS"],
      link: "https://tiragechampagnebar.com",
      impact: "Custom WooCommerce webshop with regular content updates",
    },
    {
      name: "Earnings Calculator",
      description: "Web application for calculating salary before and after taxes",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
      link: "https://earnings-wrapped.vercel.app",
      impact: "Simple yet effective tool for personal financial planning",
    },
    {
      name: "Portfolio Website",
      description: "Personal portfolio built with modern web technologies",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      link: "https://victorhanert.vercel.app",
      impact: "Showcase of skills and projects",
    },
  ],
  services: [
    "Full Stack Web Development",
    "Frontend Development (React, Vue, Svelte)",
    "Backend Development (Node.js, Laravel, Java Spring Boot)",
    "Database Design & Optimization",
    "API Development (REST & GraphQL)",
    "Web Design & UI/UX Implementation",
    "WordPress & WooCommerce Development",
    "3D Web Applications (Three.js)",
  ],
  interests: [
    "Web Development",
    "3D Graphics & Visualization",
    "Open Source Projects",
    "Artificial Intelligence & Machine Learning",
    "Sports (Football, Biking)",
    "Food & Cooking",
    "Travelling & Exploring New Cultures",
    "Wine & Champagne",
    "Continuous Learning",
  ],
  faq: [
    { question: "What is your experience with React?", answer: "I have substantial experience with React, using it in multiple projects including my personal portfolio, Earnings Calculator, and various client projects. I specialize in hooks, state management, and modern React patterns with TypeScript." },
    { question: "Do you take freelance projects?", answer: "Yes! I'm actively open to freelance opportunities. I work with companies and take on individual projects. Feel free to reach out at v.hanert@gmail.com to discuss your project." },
    { question: "What's your experience with Node.js and backend development?", answer: "I have solid backend experience with Node.js, Express.js, Laravel, PHP, and Java Spring Boot. I've built RESTful APIs, handled databases (PostgreSQL, MongoDB, MySQL), and implemented microservices. My CineMatch project showcases comprehensive backend work." },
    { question: "Can you work with databases?", answer: "Absolutely! I have experience with both SQL (MySQL, PostgreSQL) and NoSQL (MongoDB) databases. I can design schemas, optimize queries, implement migrations, and work with caching solutions like Redis." },
    { question: "What technologies do you prefer?", answer: "I'm adaptable to project needs, but I particularly enjoy working with TypeScript, React, Vue.js, Node.js, and Laravel. I value clean code, type safety, and modern development practices." },
    { question: "Are you available for full-time positions?", answer: "I'm open to discussing various opportunities including full-time positions, contract work, and freelance projects. I'm based in Valby, Copenhagen and open to remote work as well." },
    { question: "What languages do you speak?", answer: "I'm fluent in Danish (native) and English. I can work with international teams and clients." },
    { question: "What is your experience with Scrum?", answer: "I have experience working in Scrum teams, participating in daily standups, sprint planning, and retrospectives. I understand the principles of agile development and can contribute effectively to iterative development processes." },
    { question: "How do you approach agile development and sprints?", answer: "I approach agile development by actively participating in daily standups, sprint planning, and retrospectives. I focus on iterative development, continuous improvement, and effective collaboration with the team to deliver value in each sprint." },
    { question: "How does AI impact your development approach?", answer: "AI significantly influences my development approach by enabling me to create more intelligent and responsive applications. I integrate AI solutions to enhance user experiences, automate routine tasks, and provide data-driven insights." },
    { question: "What is your experience with CI/CD and DevOps?", answer: "I have experience with CI/CD pipelines and DevOps practices, including automated testing, deployment automation, and infrastructure as code. I'm excellent with tools such as GitHub Actions, Docker, and Kubernetes." },
    { question: "How can I contact you?", answer: "You can reach me via email at v.hanert@gmail.com, phone at +45 60812114, or connect with me on LinkedIn at linkedin.com/in/victor-hanert/ or GitHub at github.com/VictorHanert." },
  ],
  socialLinks: {
    github: "https://github.com/VictorHanert",
    linkedin: "https://linkedin.com/in/victor-hanert",
    instagram: "https://instagram.com/VictorHanert",
    portfolio: "https://victorhanert.com",
  },
  availability: "Open to freelance projects, full-time positions, and collaboration opportunities. Based in Copenhagen, Denmark.",
  additionalInfo: "I'm a Datamatiker graduate from KEA with hands-on experience in full stack development. I'm always eager to learn new technologies and take on challenging projects that push my skills further.",
  aiEnthusiast: {
    description: "As an AI enthusiast, Victor is deeply passionate about exploring the potential of artificial intelligence to solve real-world problems. He actively follows advancements in machine learning, natural language processing, and generative AI technologies. Victor enjoys experimenting with AI tools and frameworks, integrating them into projects to enhance functionality and user experience. His portfolio reflects his commitment to leveraging AI for innovative solutions, such as chatbot development and intelligent automation.",
    projects: [
      {
        name: "Portfolio Chatbot",
        description: "An AI-powered chatbot integrated into Victor's portfolio website, designed to provide visitors with instant information about his skills, projects, and experience.",
        technologies: ["React", "TypeScript", "Google Gemini API", "Tailwind CSS"],
        impact: "Showcases Victor's ability to integrate AI into web applications for enhanced user interaction."
      },
      {
        name: "Self-driving car simulation with NEAT",
        description: "Developed a 2D racing game using Python and Pygame, where a car is controlled by a genetic algorithm (NEAT). The car navigates using sensors, and the model is trained over several generations to complete tracks quickly and without collisions. The goal is to investigate whether the model can learn general driving behavior that also works on new, unknown tracks.",
        technologies: ["Python", "Pygame", "NEAT"],
        impact: "Explores the application of genetic algorithms in training AI models for complex tasks like driving simulations."
      }
    ]
  }
};

export default async function handler(req: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  }

  try {
    console.log("Chat API (Edge) called");
    const body = await req.json();
    const { messages, query } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages array");
      return new Response(JSON.stringify({ error: "Messages array is required" }), { status: 400, headers: corsHeaders });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return new Response(JSON.stringify({ error: "AI service not configured. Please add GEMINI_API_KEY to environment variables." }), { status: 500, headers: corsHeaders });
    }

    // Limit conversation length to last N messages to reduce prompt size
    const recentMessages = messages.slice(-8);

    const allMessages = recentMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const latestUserQuestion = getLatestUserQuestion(messages, query);
    const travelMode = isTravelQuery(latestUserQuestion);

    const portfolioContextMessage = `You are a helpful AI assistant for Victor Hanert's portfolio.\nUse the following information to answer:\n- Name: ${portfolioKnowledge.name}\n- Role: ${portfolioKnowledge.title}\n- Skills: ${portfolioKnowledge.skills.technical.join(", ")}\n- Projects: ${portfolioKnowledge.projects.map((p) => p.name).join(", ")}\n- Contact: ${portfolioKnowledge.email} / ${portfolioKnowledge.phone}\n\nGuidelines:\n1. Use Markdown for formatting.\n2. Use **bold** for emphasis.\n3. Use bullet points for lists.\n4. Keep answers concise and professional.\n5. Use simple and clear language.\n6. Shorten answers to avoid excessive length.\n`;

    // Trim the travel dataset to at most 3 recent visits per country to reduce payload
    const maxVisitsPerCountry = 3;
    const trimmedVisitedCountries = visitedCountries.map((c) => ({
      id: c.id,
      name: c.name,
      visits: Array.isArray(c.visits) ? c.visits.slice(-maxVisitsPerCountry) : c.visits,
    }));

    const travelContextMessage = `You are Victor's Travel Intelligence Agent. Use ONLY the following visited countries dataset for travel analysis:\n${JSON.stringify(trimmedVisitedCountries)}\n\nTravel guidelines:\n1. Answer only from the travel dataset.\n2. If asked about a country not listed, say Victor has not visited it yet.\n3. Analyze trends (companions, seasonality, destinations, vibe shifts over time) when relevant.\n4. If asked about future travel, suggest destinations fitting his Mediterranean/football/luxury trend that are not already in the dataset.\n5. Keep answers concise, analytical, and in Markdown with bullets when useful.\n`;

    const selectedContext = travelMode ? travelContextMessage : portfolioContextMessage;

    if (allMessages.length > 0 && allMessages[0].role === "user") {
      allMessages[0].parts[0].text = `${selectedContext}\nUser question: ${allMessages[0].parts[0].text}`;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ["gemini-3.1-flash-lite-preview", "gemini-3-flash-preview", "gemini-2.5-flash-lite", "gemini-2.5-flash"];
    let result;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        result = await model.generateContent({
          contents: allMessages,
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.5,
            topP: 0.8,
            topK: 40,
          },
        });

        break;
      } catch (e: any) {
        if (e.status === 503 && modelName !== models[models.length - 1]) {
          console.warn(`Model ${modelName} busy, retrying in 1s with next model...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw e;
      }
    }

    const assistantMessage = result.response?.text?.() || "";

    console.log("Gemini API response received");

    return new Response(JSON.stringify({ message: assistantMessage }), { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("Error in chat API (Edge):", error);
    const errMsg = error?.message || "Failed to get response from AI service. Check logs for details.";

    const errorResponse = { error: errMsg };
    if (error?.status === 401 || errMsg?.includes("API_KEY_INVALID")) {
      errorResponse.error = "Invalid API key. Please check GEMINI_API_KEY in environment variables.";
    } else if (error?.status === 429) {
      errorResponse.error = "Rate limit exceeded. Please try again later.";
    }

    return new Response(JSON.stringify(errorResponse), { status: error?.status || 500, headers: { "Content-Type": "application/json" } });
  }
}
