import { GithubIcon, InstagramIcon, LinkedinIcon, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <div>Abel Cathrines Gade 7, <span className="block sm:inline">1654, København V</span></div>
              </p>
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
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Victor Hanert. All rights reserved.
        </div>
      </div>
    </footer>
  );
};