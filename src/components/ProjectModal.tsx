import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Globe, Github, Maximize2, Calendar, Code, ExternalLink, Building, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id?: number;
    title: string;
    description: string;
    websiteUrl?: string;
    githubUrl?: string;
    technologies: string[];
    screenshots?: string[];
    previewImage: string;
  };
};

export const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (project.screenshots && project.screenshots.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.screenshots.length);
    }
  };

  const previousImage = () => {
    if (project.screenshots && project.screenshots.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.screenshots.length - 1 : prev - 1
      );
    }
  };

  const openFullImage = () => {
    if (!project.screenshots?.length) return;
    window.open(project.screenshots[currentImageIndex], '_blank');
  };

  const hasScreenshots = project.screenshots && project.screenshots.length > 0;

  // Define client list for the first project (Pandi Web)
  const clientsList = [
    { name: "Ergoterapeutforeningen", url: "https://pandiweb.dk/cases/etf/" },
    { name: "Global Fund Search", url: null },
    { name: "Pairy", url: null },
    { name: "The Planner Studio", url: null },
    { name: "Veltek", url: null },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-11/12 p-0 overflow-hidden bg-white dark:bg-gray-900 rounded-lg">
        <div className="flex flex-col md:flex-row h-[80vh] max-h-[800px]">
          {/* Left side - Image gallery */}
          {hasScreenshots && (
            <div className="w-full md:w-1/2 h-[30vh] md:h-full relative bg-gray-100 dark:bg-gray-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <img
                    src={project.screenshots[currentImageIndex]}
                    alt={`Project screenshot ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />

                  {/* Image gallery pagination dots */}
                  {project.screenshots.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {project.screenshots.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            index === currentImageIndex 
                              ? "bg-primary" 
                              : "bg-gray-300 dark:bg-gray-600"
                          )}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Navigation arrows */}
                  {project.screenshots.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Full screen button */}
                  <button
                    onClick={openFullImage}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="View full size"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right side - Content */}
          <div className={`w-full ${hasScreenshots ? 'md:w-1/2' : ''} p-6 overflow-y-auto`}>
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </DialogTitle>
                <div className="w-12 h-12 shrink-0">
                  <img
                    src={project.previewImage}
                    alt={`${project.title} logo`}
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>
              </div>
            </DialogHeader>
            
            {/* Description with better typography */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                <Code className="w-4 h-4 mr-2" />
                Project Overview
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </div>
            
            {/* Client list only for Pandi Web (project.id === 1) */}
            {project.id === 1 && (
              <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
                  <Users className="w-4 h-4 mr-2" />
                  <Building className="w-4 h-4 mr-2" />
                  Clients I've Worked With
                </h3>
                <ul className="space-y-2">
                  {clientsList.map((client, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      {client.url ? (
                        <div>
                          <a
                            href={client.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            {client.name}
                            <ExternalLink className="w-3 h-3 ml-1 inline" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300">{client.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Technologies */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-auto">
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Website</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
