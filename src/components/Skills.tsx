import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import { loadCurvesPath } from "@tsparticles/path-curves";
import { useEffect } from "react";
import type { Engine } from "@tsparticles/engine";
import Switch from "./Switch";
import {
  seaAnemonePreset,
  linksPreset,
  trianglesPreset,
  customTwinklesPreset,
} from "@/config/particles";

let particlesInit = false;

const particlePresets = {
  Frontend: seaAnemonePreset,
  Backend: linksPreset,
  "Tools & DevOps": trianglesPreset,
  "AI & Data": customTwinklesPreset,
};

const skills = [
  { 
    name: "Frontend", 
    items: [
      "Vue", "React", "Three.js", "JavaScript", "Tailwind CSS", "SvelteKit", "Svelte", "Next.js",
      "TypeScript", "Inertia.js", 
      "HTML", "CSS", "Responsive Design", "Figma",
      "WordPress", "WooCommerce"
    ]
  },
  { 
    name: "Backend", 
    items: [
      "Laravel", "Node.js", "PHP",
      "Java", "TypeScript", "Express.js", "Spring Boot", "Python", "FastAPI", "Poetry", "Database Migrations", "MySQL", 
      "PostgreSQL", "MongoDB", "SQLite", "Redis", "CockroachDB", 
      "Firebase", "Neo4J", "GraphQL", "RESTful APIs", "MVC Frameworks", 
      "Microservices Architecture", "JWT Authentication", "WebSockets", "CORS"
    ]
  },
  { 
    name: "Tools & DevOps",
    items: [
      "Docker",
      "Vite", "Kubernetes", "npm", "Git", "Shell Scripting", "Azure", "DevOps", "GitHub Actions (CI/CD)", "AWS", "Netlify", "Vercel", "Heroku",
      "phpMyAdmin", "Trello", "Jira", "Notion", "Productive.io", "Slack", "Agile (Scrum, Kanban)",
      "Postman", "RabbitMQ", "Swagger/OpenAPI", "UML Modeling", "TDD",
      "Testing (Vitest, Pytest)", "Sentry (Monitoring)"
    ]
  },
  { 
    name: "AI & Data", 
    items: [
      "Python", "AI-driven Development", "AI-integrations", "TensorFlow", "NumPy", "Keras", "Pandas", "Scikit-learn", "PyTorch",
      "Data Science", "Neural Networks (DNN, CNN)", "Genetic Algorithms (NEAT)", "Natural Language Processing", "MCP",
      "Machine Learning (Classification, Regression)", "Data Visualization", "Matplotlib", "Seaborn", "Reinforcement Learning"
    ]
  }
];

export const Skills = () => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    const initializeParticles = async () => {
      if (!particlesInit) {
        await initParticlesEngine(async (engine: Engine) => {
          await loadSlim(engine);
          await loadEmittersPlugin(engine);
          await loadCurvesPath(engine);
        });
        particlesInit = true;
      }
    };

    initializeParticles();
  }, []);

  const toggleSection = (name: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <section id="skills-section" className="py-20 px-1 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-center flex-1">Skills</h2>
        <div className="flex justify-end">
          <p className="flex items-center mr-4 text-sm text-gray-600">Animations</p>
          <Switch checked={animationsEnabled} onChange={setAnimationsEnabled} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((category) => (
          <div key={category.name} className="glass-card py-3 rounded-lg h-fit relative hover:bg-gray-100/80 transition-colors overflow-hidden">
            {animationsEnabled && (
              <Particles
                id={`particles-${category.name}`}
                options={particlePresets[category.name as keyof typeof particlePresets]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-4 text-center">{category.name}</h3>
              <div className={`flex flex-wrap gap-2 justify-center ${!expandedSections[category.name] ? 'overflow-hidden' : ''}`} style={!expandedSections[category.name] ? { maxHeight: 'calc(2.5 * 1.75rem)' } : undefined}>
                {category.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm shadow-sm cursor-default hover:shadow-md hover:font-medium transition-shadow"
                    >
                      {skill}
                    </span>
                ))}
              </div>
              {category.items.length > 5 && (
                <button
                  onClick={() => toggleSection(category.name)}
                  className="mt-4 flex items-center gap-2 text-sm text-primary hover:font-medium transition-colors mx-auto group"
                >
                  {expandedSections[category.name] ? (
                    <>Show Less <ChevronUp className="w-4 h-4 group-hover:animate-bounce" /></>
                  ) : (
                    <>More <ChevronDown className="w-4 h-4 group-hover:animate-bounce" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};