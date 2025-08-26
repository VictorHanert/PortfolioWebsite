
import { Project } from "@/components/ProjectCard";

export const projects: Project[] = [
    {
      id: 1,
      title: "Pandi Web Projects",
      description: "Developed and maintained web applications using Laravel, PHP, and Vue.js. Worked on diverse client projects, delivering modern, scalable web solutions while ensuring seamless integration with existing systems. Focused on creating responsive, user-friendly interfaces and building robust, efficient backend architectures to meet client needs.",
      tech: ["Laravel", "Vue.js", "PHP", "Inertia.js", "MySQL", "Tailwind CSS"],
      category: "Fullstack",
      websiteUrl: "https://pandiweb.dk",
      previewImage: "pandiweb-logo.png",
    },
    {
      id: 2,
      title: "Dream Delivery A/S",
      description: "Final exam project in collaboration with start-up company 'Dream Delivery A/S'. Development of a web application for managing orders and deliveries, including a customer portal and an admin dashboard.",
      tech: ["SvelteKit", "TypeScrypt", "PocketBase", "Figma", "Tailwind CSS", "SCRUM"],
      category: "Fullstack",
      websiteUrl: "https://dreamdelivery.dk/",
      screenshots: [
        "dream-delivery.png",
        "dream-delivery-2.png"
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
      githubUrl: "https://github.com/orgs/ONAV-KEA/repositories",
      screenshots: [
        "spring-boot-logo.png",
      ],
      previewImage: "spring-boot-logo.png",
    },
    {
      id: 6,
      title: "CineMatch",
      description: "Exam Project as Datamatiker. Development of a fullstack application with focus on the backend for finding movies and creating watchlists. Implementation of a RESTful API and database integration.",
      tech: ["Svelte", "Node.js", "Express.js", "PostgreSQL", "MongoDB", "Redis", "Resend", "REST APIs", "Tailwind.css", "Vite", "npm", "WebSockets"],
      category: "Fullstack",
      githubUrl: "https://github.com/Teller501/Node_Eksamen",
      screenshots: [
        "cinematch-website.png",
      ],
      previewImage: "cinematch-logo.png",
    },
    {
      id: 7,
      title: "Portfolio",
      description: "Personal portfolio website developed with React and Tailwind CSS. Focus on responsive design and modern web development practices. Implementation of animations and transitions.",
      tech: ["React", "TypeScript", "Tailwind CSS", "HTML", "CSS", "Vercel"],
      category: "Frontend",
      websiteUrl: "https://victorhanert.vercel.app/",
      githubUrl: "https://github.com/VictorHanert/PortfolioWebsite",
      screenshots: [
        "portfolio-website.png"
      ],
      previewImage: "favicon.svg",
    },
    {
      id: 8,
      title: "PandiWeb Photo Memories",
      description: "Developed a photo and video sharing platform for PandiWeb employees. Focused on frontend development with a fullstack approach using Laravel. Implemented a RESTful API, database integration, and full CRUD functionality, including an admin page for user management. I cant show images from the project due to privacy reasons, but you can see the logo and a screenshot of the top of the website.",
      tech: ["Laravel", "Vue.js", "PHP", "MySQL", "Tailwind CSS"],
      category: "Fullstack",
      screenshots: [
        "internalmemories-website.png",
      ],
      previewImage: "internalmemories-logo.png",
    },
    {
      id: 9,
      title: "AI - Self Driving Car Game",
      description: "Developed a 2D racing game using Python and Pygame, where a car is controlled by a genetic algorithm (NEAT). The car navigates using sensors, and the model is trained over several generations to complete tracks quickly and without collisions. The goal is to investigate whether the model can learn general driving behavior that also works on new, unknown tracks.",
      tech: ["Python", "AI", "Pygame", "NEAT Python", "Genetic Algorithms"],
      category: "Backend",
      githubUrl: "https://github.com/VictorHanert/genetic_race_track",
      screenshots: [
        "car-with-sensors.png",
        "race-track.png",
      ],
      previewImage: "car.png",
    },
    {
      id: 10,
      title: "GeoGuessr-Style Platform",
      description: "A GeoGuessr-style web platform built using a microservice architecture. Players are dropped at random global locations on a map and must guess where they are based on street view images. The system is composed of several microservices handling authentication, game sessions, map image processing, scoring, and leaderboards. It was designed with scalability, separation of concerns, and maintainability in mind, using technologies such as FastAPI for the backend, Svelte for the frontend, and Docker for containerization.",
      tech: ["Python", "FastAPI", "Svelte", "RabbitMQ", "Docker", "Kubernetes", "MySQL", "MongoDB Atlas", "Google Maps API", "Tailwind CSS", "JWT", "Netlify"],
      category: "Fullstack",
      githubUrl: "https://github.com/GeoGuessrProject",
      screenshots: [
        "geoguessr-architecture.png"
      ],
      previewImage: "geoguessr-logo.png"
    },
    {
      id: 11,
      title: "Footy Value Bets",
      description: "A football betting analysis platform that uses machine learning to identify value bets by comparing AI-powered match predictions with bookmaker odds. The app analyzes upcoming fixtures, calculates expected value for different bet types (win/draw/loss, over/under goals, both teams to score), and tracks historical performance metrics including ROI and accuracy rates.",
      tech: ["Typescript", "React", "Python", "Tailwind CSS"],
      category: "Fullstack",
      screenshots: [
        "footy-screenshot-1.png",
        "footy-screenshot-2.png"
      ],
      previewImage: "footy-logo.png"
    }
  ];

export const categories = ["All", "Frontend", "Backend", "Fullstack"];