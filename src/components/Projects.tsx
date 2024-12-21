import { useState } from "react";
import { ProjectModal } from "./ProjectModal";
import { ProjectSearch } from "./ProjectSearch";

type Project = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  category: string;
  websiteUrl?: string;
  githubUrl?: string;
  screenshots: string[];
  previewImage: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Pandi Web Projects",
    description: "Web development projects using Laravel and Vue.js. Working on various client projects, implementing modern web solutions and maintaining existing applications. Focus on creating responsive, user-friendly interfaces and robust backend systems.",
    tech: ["Laravel", "Vue.js", "PHP", "Inertia.js", "MySQL", "Tailwind CSS"],
    category: "Fullstack",
    websiteUrl: "https://pandiweb.dk",
    screenshots: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    ],
    previewImage: "pandiweb-logo.png",
  },
  {
    id: 2,
    title: "Dream Delivery A/S",
    description: "Final exam project in collaboration with start-up company 'Dream Delivery A/S'. Development of a web application for managing orders and deliveries, including a customer portal and an admin dashboard.",
    tech: ["SvelteKit", "TypeScrypt", "PocketBase", "Figma", "Tailwind CSS"],
    category: "Fullstack",
    websiteUrl: "https://dreamdelivery.dk/",
    screenshots: [
      "https://placehold.co/400x200",
      "https://placehold.co/400x200",
    ],
    previewImage: "dream-delivery-logo.png",
  },
  {
    id: 3,
    title: "Tirage Champagne Bar",
    description: "Web design for the local champagne bar at Vesterbro. Implementation of a webshop using WordPress and Woocommerce, focusing on user experience and design. Custom theme development and updates of new pages, products and events.",
    tech: ["WordPress", "HTML", "JavaScript", "Woocommerce", "YooTheme", "CSS"],
    category: "Frontend",
    websiteUrl: "https://tiragechampagnebar.com/",
    screenshots: [
      "tirage-screenshot-1.png",
    ],
    previewImage: "tirage-logo.png",
  },
  {
    id: 4,
    title: "Earnings Calculator",
    description: "Simple web application for calculating earnings based on hourly rate or monthly income and hours worked. See your salary before and after taxes. Developed primarily with React and TypeScript.",
    tech: ["React", "TypeScript", "HTML", "CSS", "Tailwind CSS", "Vercel"],
    category: "Frontend",
    websiteUrl: "https://earnings-wrapped.vercel.app/",
    screenshots: [
      "earnings-calculator-screenshot-1.png",
      "earnings-calculator-screenshot-2.png",
      "earnings-calculator-screenshot-3.png",
    ],
    previewImage: "earnings-calculator-logo.png",
  },
  {
    id: 5,
    title: "Java Spring Boot",
    description: "Backend services developed with Java Spring Boot, focusing on creating scalable and maintainable applications. Implementation of RESTful APIs and database integration.",
    tech: ["Java", "Spring Boot", "MySQL", "REST APIs", "MVC-framework", "HTML", "CSS"],
    category: "Backend",
    githubUrl: "https://github.com/VictorHanert",
    screenshots: [
      "https://placehold.co/400x200",
    ],
    previewImage: "spring-boot-logo.png",
  },
  {
    id: 6,
    title: "CineMatch",
    description: "Exam Project as Datamatiker. Development of a fullstack application with focus on the backend for finding movies and creating watchlists. Implementation of a RESTful API and database integration.",
    tech: ["Svelte", "Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redis", "Resend", "REST APIs", "Tailwind.css", "Vite", "npm", "WebSockets"],
    category: "Fullstack",
    githubUrl: "https://github.com/VictorHanert",
    screenshots: [
      "https://placehold.co/400x200",
    ],
    previewImage: "cinematch-logo.png",
  },
];

const categories = ["All", "Frontend", "Backend", "Fullstack"];

export const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTechs, setSearchTechs] = useState<string[]>([]);

  const filteredProjects = projects.filter(
    (project) => 
      (activeCategory === "All" || project.category === activeCategory) &&
      (searchTechs.length === 0 || searchTechs.every(tech => 
        project.tech.some(t => t.toLowerCase().includes(tech.toLowerCase()))
      ))
  );

  const handleSearch = (technologies: string[]) => {
    setSearchTechs(technologies);
  };

  return (
    <section id="projects-section" className="py-20 px-4 max-w-6xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
      
      <ProjectSearch onSearch={handleSearch} />
      
      <div className="flex justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="glass-card p-6 rounded-lg hover-lift text-left"
          >
            <div className="aspect-image mb-4 rounded-lg overflow-hidden">
              <img
                src={project.previewImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.slice(0, 3).map((tech) => (
                <span key={tech} className="inline-block px-2 py-1 bg-secondary rounded-full text-sm">
                  {tech}
                </span>
              ))}
              {project.tech.length > 3 && (
                <span className="inline-block px-2 py-1 bg-secondary rounded-full text-sm">
                  +{project.tech.length - 3}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={{
            ...selectedProject,
            technologies: selectedProject.tech,
          }}
        />
      )}

      {filteredProjects.length === 0 && (
        <p className="text-center mt-8 text-lg">No projects found with the current search criteria.</p>
      )}

    </section>
  );
};
