import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Globe, Github, Maximize2 } from "lucide-react";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-11/12 px-6 backdrop-blur-sm max-h-[96vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            <div className="max-w-20 max-h-10 mr-10 items-center hidden md:flex">
              <img
                src={project.previewImage}
                alt="Project preview"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
        </DialogHeader>

        <div className="relative flex justify-center group">
          {project.screenshots && project.screenshots.length > 0 && (
            <>
              <img
                src={project.screenshots[currentImageIndex]}
                alt={`Project screenshot ${currentImageIndex + 1}`}
                className="h-full max-h-[56vh] rounded-lg shadow-sm border"
              />
              <button
                onClick={() => window.open(project.screenshots[currentImageIndex], '_blank')}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              {project.screenshots.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-20 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-20 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        <div className="text-lg text-gray-700 mb-6">
          <p className="mb-4">{project.description}</p>
          {project.id === 1 && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Clients I've Worked With:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li className="text-gray-700 text-base">
                  Ergoterapeutforeningen (
                  <a
                    href="https://pandiweb.dk/cases/etf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-primary"
                  >
                    Read more here
                  </a>
                  )
                </li>
                <li className="text-gray-700 text-base">Global Fund Search</li>
                <li className="text-gray-700 text-base">Veltek</li>
                <li className="text-gray-700 text-base">The Planner Studio</li>
                <li className="text-gray-700 text-base">Pairy</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 bg-white text-gray-800 rounded-full text-sm font-medium shadow-sm border border-gray-100"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.websiteUrl && (
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Globe className="w-5 h-5" />
              Visit Website
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github className="w-5 h-5" />
              View Source
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
