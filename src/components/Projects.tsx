
import { useState } from "react";
import { ProjectModal } from "./ProjectModal";
import { ProjectSearch } from "./ProjectSearch";
import { CategoryFilter } from "./CategoryFilter";
import { ProjectCard, Project } from "./ProjectCard";
import { ShowMoreButton } from "./ShowMoreButton";
import { projects, categories } from "@/data/projectsData.ts";

export const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTechs, setSearchTechs] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const filteredProjects = projects.filter(
    (project) => 
      (activeCategory === "All" || project.category === activeCategory) &&
      (searchTechs.length === 0 || searchTechs.every(tech => 
        project.tech.some(t => t.toLowerCase().includes(tech.toLowerCase()))
      ))
  );

  // Show all projects or just the first 3
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3);
  const hasMoreProjects = filteredProjects.length > 3;

  const handleSearch = (technologies: string[]) => {
    setSearchTechs(technologies);
    setShowAll(false); // Reset to showing only 3 when search changes
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setShowAll(false); // Reset to showing only 3 when category changes
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <section id="projects-section" className="py-20 px-4 max-w-6xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
      
      <ProjectSearch onSearch={handleSearch} />
      
      <CategoryFilter 
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleCategoryChange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((project) => (
          <ProjectCard 
            key={project.id}
            project={project}
            onClick={setSelectedProject}
          />
        ))}
      </div>

      {hasMoreProjects && (
        <ShowMoreButton 
          showAll={showAll}
          totalCount={filteredProjects.length}
          onToggle={toggleShowAll}
        />
      )}

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