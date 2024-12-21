import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const skills = [
  { 
    name: "Frontend", 
    items: ["Vue", "React", "Svelte", "JavaScript", "Figma", "Tailwind CSS", "TypeScript", "SvelteKit", "WordPress", "Bootstrap", "HTML", "CSS", "Responsive Design"]
  },
  { 
    name: "Backend", 
    items: ["Laravel", "Node.js", "PHP", "Java", "Python", "Express.js", "MySQL", "MongoDB", "PostGres", "Spring Boot", "Hibernate", "MVC Frameworks", "Redis", "SQLite", "CockroachDB", "Firebase"]
  },
  { 
    name: "Tools & Others", 
    items: ["Git", "Shopify", "Docker", "Vite", "Azure", "npm", "phpMyAdmin", "Vercel", "Heroku", "AWS", "RESTful APIs", "CI/CD", "Scrum", "KanBan", "Postman", "Trello", "UML Modeling"]
  },
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
    <section id="skills-section" className="py-20 px-4 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((category) => (
          <div key={category.name} className="glass-card p-6 rounded-lg h-fit relative">
            <h3 className="text-xl font-semibold mb-4 text-center">{category.name}</h3>
            <div className="flex flex-wrap gap-3 justify-center relative">
              {category.items
                .slice(0, expandedSections[category.name] ? undefined : 5)
                .map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white/80 border border-gray-200 rounded-full text-sm hover-small-lift cursor-pointer shadow-sm"
                  >
                    {skill}
                  </span>
              ))}
            </div>
            {category.items.length > 5 && (
              <button
                onClick={() => toggleSection(category.name)}
                className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mx-auto"
              >
                {expandedSections[category.name] ? (
                  <>Show Less <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>More <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};