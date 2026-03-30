import { BarChart3, GithubIcon, Globe, InstagramIcon, LinkedinIcon, Mail, MapPin, Phone, Plane } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <p>Valby Langgade 30, <span className="block sm:inline">2500 Valby, Denmark</span></p>
              </div>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +45 60812114
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                v.hanert@gmail.com
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Links</h3>
            <div className="flex gap-3">
              <a href="https://github.com/VictorHanert" target="_blank" rel="noopener noreferrer" className="hover-lift">
                <GithubIcon className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/in/victor-hanert/" target="_blank" rel="noopener noreferrer" className="hover-lift">
                <LinkedinIcon className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/VictorHanert" target="_blank" rel="noopener noreferrer" className="hover-lift">
                <InstagramIcon className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-8 flex gap-3">
              <NavLink to="/globe" className="hover-lift">
                <Globe className="w-6 h-6" />
              </NavLink>
              <NavLink to="/stats" className="hover-lift">
                <BarChart3 className="w-6 h-6" />
              </NavLink>
              <NavLink to="/travel-agent" className="hover-lift">
                <Plane className="w-6 h-6" />
              </NavLink>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Victor Hanert. All rights reserved.
        </div>
      </div>
    </footer>
  );
};