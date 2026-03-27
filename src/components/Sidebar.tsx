import { useState } from "react";
import { Menu, X, Home, User, Code, Briefcase, Mail, Globe, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="sticky top-0 h-screen overflow-y-auto pt-20 px-4">
          <nav className="space-y-4">
            <button
              onClick={() => scrollToSection('#root')}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" /> Introduction
            </button>
            <button
              onClick={() => scrollToSection('#about-section')}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" /> About
            </button>
            <button
              onClick={() => scrollToSection('#skills-section')}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Code className="w-5 h-5" /> Skills
            </button>
            <button
              onClick={() => scrollToSection('#projects-section')}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Briefcase className="w-5 h-5" /> Projects
            </button>
            <button
              onClick={() => navigateTo('/globe')}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Globe className="w-5 h-5" /> Travel Map
            </button>
            <button
              onClick={() => navigateTo('/travel-agent')}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Plane className="w-5 h-5" /> Travel Agent
            </button>
            <button
              onClick={() => scrollToSection('#contact-section')}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" /> Contact
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};