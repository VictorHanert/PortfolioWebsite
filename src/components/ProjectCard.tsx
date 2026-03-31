
import { Button } from "@/components/ui/button";

export type Project = {
    id: number;
    title: string;
    description: string;
    tech: string[];
    category: string;
    websiteUrl?: string;
    githubUrl?: string;
    screenshots?: string[];
    previewImage: string;
};

type ProjectCardProps = {
    project: Project;
    onClick: (project: Project) => void;
};

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
    return (
        <button
            onClick={() => onClick(project)}
            className="glass-card p-6 rounded-lg hover-lift text-left"
        >
            <div className="aspect-image mb-4 rounded-lg overflow-hidden">
                <img
                    src={project.previewImage}
                    alt={project.title}
                    className="w-full h-full object-contain max-h-52"
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
    );
};