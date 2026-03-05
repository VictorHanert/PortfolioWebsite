import { GoogleGenerativeAI } from "@google/generative-ai";

const portfolioKnowledge = {
  name: "Victor Hanert",
  title: "Full Stack Developer | Software Engineer",
  location: "Valby, Denmark",
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
    { question: "Are you available for full-time positions?", answer: "I'm open to discussing various opportunities including full-time positions, contract work, and freelance projects. I'm based in København V and open to remote work as well." },
    { question: "What languages do you speak?", answer: "I'm fluent in Danish (native) and English. I can work with international teams and clients." },
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
};

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
    console.log("Chat API called");
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.error("No messages array provided");
      return res.status(400).json({ error: "Messages array is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return res.status(500).json({
        error: "AI service not configured. Please add GEMINI_API_KEY to Vercel environment variables.",
      });
    }

    console.log("Calling Gemini API with", messages.length, "messages");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert messages to Gemini format with context in first user message
    const allMessages = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Add system context to first user message
    if (allMessages.length > 0 && allMessages[0].role === "user") {
      const contextMessage = `You are a helpful AI assistant for Victor Hanert's portfolio. Answer questions based on this information:

SKILLS: ${portfolioKnowledge.skills.technical.slice(0, 15).join(", ")}...
PROJECTS: ${portfolioKnowledge.projects.map(p => p.name).join(", ")}
EMAIL: ${portfolioKnowledge.email}
PHONE: ${portfolioKnowledge.phone}

Be friendly and professional. If unsure, suggest contacting directly.

User question: `;
      
      allMessages[0].parts[0].text = contextMessage + allMessages[0].parts[0].text;
    }

    const result = await model.generateContent({
      contents: allMessages,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const response = await result.response;
    const assistantMessage = response.text();

    console.log("Gemini API response received");

    return res.status(200).json({
      message: assistantMessage,
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      status: error.status,
      stack: error.stack,
    });

    if (error.status === 401 || (error.message && error.message.includes("API_KEY_INVALID"))) {
      return res.status(401).json({
        error: "Invalid API key. Please check GEMINI_API_KEY in Vercel settings.",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      error: error.message || "Failed to get response from AI service. Check Vercel logs for details.",
    });
  }
}
