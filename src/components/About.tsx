import { useEffect, useRef, useState } from "react";
import { FileJsonIcon, BikeIcon, WineIcon, GraduationCap, BriefcaseBusiness, TicketsPlaneIcon } from "lucide-react";
import { age } from "./Hero";

type Section = 'default' | 'sports' | 'social' | 'travel';

const sections = {
  default: {
    title: "About Me",
    icon: FileJsonIcon,
    content: `I'm a ${age}-year-old software developer with a passion for software solutions.`
    + " With high self-discipline and determination, I'm always ready to take on new challenges and responsibilities. I'm eager to learn new technologies and skills to further develop my career and contribute to the success of my team."
  },
  sports: {
    title: "Sports & Lifestyle",
    icon: BikeIcon,
    content: "I love playing sports and staying active, especially football which I've played all my life."
    + " I bike to work every day and around Copenhagen, and I place great importance on my diet and physical well-being, carefully considering what I eat and maintaining an active lifestyle."
  },
  social: {
    title: "Social Life",
    icon: WineIcon,
    content: "You'll find me to be an energetic and smiling person who values creating a positive atmosphere. I believe in maintaining good relationships with colleagues and enjoy social activities that promote team building and collaboration."
    + " I've gained a passion for Champagne and also wine in general through my earlier job as a waiter at Tirage Champagne bar, and I love to share my knowledge and experience with others."
  },
  travel: {
    title: "Travelling",
    icon: TicketsPlaneIcon,
    content: "Travelling is a passion of mine, and I love exploring new cultures and meeting new people. I believe that traveling is an essential part of personal growth and development, and I'm always looking for new destinations to visit. The worst thing I know is a charter trip to a tourist trap."
  },
};

export const About = () => {
  const [activeSection, setActiveSection] = useState<Section>('default');
  const [fade, setFade] = useState<boolean>(false);
  const educationRefs = useRef<HTMLParagraphElement[]>([]);
  const experienceRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const animateLines = (elements: HTMLParagraphElement[]) => {
      const delay = 750;

      const animate = (index: number) => {
        if (index >= elements.length) return;

        const element = elements[index];
        if (element) {
          element.style.opacity = "1";
          element.classList.add("typing-text");

          const textWidth = element.textContent?.length || 0;
          element.style.setProperty('--text-width', `${textWidth}ch`);

          setTimeout(() => {
            element.classList.add("typed");
            element.classList.remove("typing-text");
            animate(index + 1);
          }, delay);
        }
      };

      animate(0);
    };

    const allRefs = [...educationRefs.current, ...experienceRefs.current];
    animateLines(allRefs);
  }, []);

  const handleSectionChange = (key: Section) => {
    setFade(true);
    setTimeout(() => {
      setActiveSection(key);
      setFade(false);
    }, 500);
  };

  return (
    <section id="about-section" className="py-20 px-4 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">About me</h2>
      <div className="glass-card p-8 rounded-lg">
        <div className="flex justify-center gap-2 sm:gap-5 md:gap-20 mb-8">
          {(Object.entries(sections) as [Section, typeof sections[keyof typeof sections]][]).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <div key={key} className="flex flex-col items-center">
                <button
                  onClick={() => handleSectionChange(key)}
                  className={`p-3 rounded-full transition-colors ${
                    activeSection === key
                      ? "bg-gradient-to-br from-gray-300 bg-gray-600/80 hover:bg-gray-900/80"
                      : "bg-gradient-to-br from-gray-50 bg-gray-300/80 hover:bg-gray-900/80 hover-small-lift"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
                <p className="text-sm mt-2">{section.title}</p>
              </div>
            );
          })}
        </div>
        
        <div className={`md:text-lg mb-6 min-h-[100px] transition-opacity duration-500 ease-in-out ${fade ? 'opacity-0' : 'opacity-100'}`}>
          {sections[activeSection].content}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">Education
              <GraduationCap className="w-6 h-6 inline-block ml-2" />
            </h3>
            <ul className="space-y-4">
              <li>
                <li>
                  <p ref={(el) => educationRefs.current[0] = el} className="font-medium typing-container">Software Development</p>
                  <p ref={(el) => educationRefs.current[1] = el} className="text-sm typing-container">Top-up Bachelor's Degree</p>
                  <p ref={(el) => educationRefs.current[2] = el} className="text-sm text-muted-foreground typing-container">KEA • 2025-2026</p>
                </li>
                <p ref={(el) => educationRefs.current[3] = el} className="font-medium typing-container">AP Graduate in Computer Science</p>
                <p ref={(el) => educationRefs.current[4] = el} className="text-sm text-muted-foreground typing-container">KEA • 2022-2025</p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Experience
              <BriefcaseBusiness className="w-6 h-6 inline-block ml-2" />
            </h3>
            <ul className="space-y-4">
              <li>
                <p ref={(el) => experienceRefs.current[0] = el} className="font-medium typing-container">Web developer • PandiWeb</p>
                <p ref={(el) => experienceRefs.current[1] = el} className="text-sm text-muted-foreground typing-container">Oct 2024 - Present</p>
              </li>
              <li>
                <p ref={(el) => experienceRefs.current[2] = el} className="font-medium typing-container">Internship • PandiWeb</p>
                <p ref={(el) => experienceRefs.current[3] = el} className="text-sm text-muted-foreground typing-container">Jul 2024 - Oct 2024</p>
              </li>
              <li>
                <p ref={(el) => experienceRefs.current[4] = el} className="font-medium typing-container">
                  Websiteadministrator • <span className="block lg:inline-block">Tirage Champagne Bar</span></p>
                <p ref={(el) => experienceRefs.current[5] = el} className="text-sm text-muted-foreground typing-container">Nov 2022 - Jul 2024</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};