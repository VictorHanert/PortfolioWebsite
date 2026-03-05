import { Anthropic } from "@anthropic-ai/sdk";

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
    console.log("Chat API called");
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.error("No messages array provided");
      return res.status(400).json({ error: "Messages array is required" });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set in environment variables");
      return res.status(500).json({
        error: "AI service not configured. Please add ANTHROPIC_API_KEY to Vercel environment variables.",
      });
    }

    console.log("Calling Claude API with", messages.length, "messages");

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
    console.error("Error in chat API:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      status: error.status,
      stack: error.stack,
    });

    if (error.status === 401 || (error.message && error.message.includes("401"))) {
      return res.status(401).json({
        error: "Invalid API key. Please check ANTHROPIC_API_KEY in Vercel settings.",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      error:
        error.message || "Failed to get response from AI service. Try again.",
    });
  }
}
