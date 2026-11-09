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
