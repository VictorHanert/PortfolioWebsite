import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const skills = [
  { 
    name: "Frontend", 
    items: [
      "Vue", "React", "Three.js", "JavaScript", "Tailwind CSS", "SvelteKit", "Svelte", "Next.js",
      "TypeScript", "Bootstrap", 
      "HTML", "CSS", "Responsive Design", "Figma",
      "WordPress", "WooCommerce"
    ]
  },
  { 
    name: "Backend", 
    items: [
      "Laravel", "Node.js", "PHP",
      "Java", "TypeScript", "Express.js", "Spring Boot", "Python", "FastAPI", "MySQL", 
      "PostgreSQL", "MongoDB", "SQLite", "Redis", "CockroachDB", 
      "Firebase", "GraphQL", "RESTful APIs", "MVC Frameworks", 
      "Microservices Architecture", "JWT Authentication", "WebSockets", "CORS"
    ]
  },
  { 
    name: "Tools & DevOps",
    items: [
      "Docker",
      "Vite", "Kubernetes", "npm", "Git", "Shell Scripting", "Azure", "GitHub Actions (CI/CD)", "AWS", "Netlify", "Vercel", "Heroku",
      "phpMyAdmin", "Trello", "Jira", "Notion", "Productive.io", "Slack", "Agile (Scrum, Kanban)",
      "Postman", "RabbitMQ", "Swagger/OpenAPI", "UML Modeling",
      "Testing (Vitest, Pytest)", "Sentry (Monitoring)"
    ]
  },
  { 
    name: "AI & Data", 
    items: [
      "Python", "TensorFlow", "NumPy", "Keras", "Pandas", "Scikit-learn", "PyTorch",
      "Data Science", "Neural Networks (DNN, CNN)", "Genetic Algorithms (NEAT)",
      "Machine Learning (Classification, Regression)", "Data Visualization", "Matplotlib", "Seaborn", "Reinforcement Learning"
    ]
  }
];

export const Skills = () => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (name: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <section id="skills-section" className="py-20 px-1 max-w-5xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((category) => (
          <div key={category.name} className="glass-card py-3 rounded-lg h-fit relative hover:bg-gray-100/80 transition-colors">
            <h3 className="text-xl font-semibold mb-4 text-center">{category.name}</h3>
            <div className="flex flex-wrap gap-2 justify-center relative">
              {category.items
                .slice(0, expandedSections[category.name] ? undefined : 5)
                .map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white/80 border border-gray-200 rounded-full text-sm shadow-sm cursor-default hover:shadow-md transition-shadow"
                  >
                    {skill}
                  </span>
              ))}
            </div>
            {category.items.length > 5 && (
              <button
                onClick={() => toggleSection(category.name)}
                className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mx-auto group"
              >
                {expandedSections[category.name] ? (
                  <>Show Less <ChevronUp className="w-4 h-4 group-hover:animate-bounce" /></>
                ) : (
                  <>More <ChevronDown className="w-4 h-4 group-hover:animate-bounce" /></>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};