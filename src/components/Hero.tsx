import { GithubIcon, LinkedinIcon, InstagramIcon, Mail, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// birtday set to: 28-02-2001
export const age = new Date().getFullYear() - 2001 - (new Date() < new Date(new Date().getFullYear(), 1, 28) ? 1 : 0);

export const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-4 animate-fade-in relative">
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="flip-container hover:flip">
          <div className="flipper">
            <div className="front">
              <Avatar className="w-48 h-48 border-4 border-white/20 shiny-effect">
                <AvatarImage src="pic-of-me.png" />
                <AvatarFallback>VH</AvatarFallback>
              </Avatar>
            </div>
            <div className="back">
              {/* <div className="w-48 h-48 rounded-full border-4 border-white/20 bg-gradient-to-br from-gray-500 bg-gray-800 flex items-center justify-center shiny-effect">
                  <span className="text-4xl font-bold text-white">VH</span>
              </div> */}
              <Avatar className="w-48 h-48 border-4 border-white/20 shiny-effect">
                <AvatarImage src="pic-of-me-2.png" />
                <AvatarFallback>VH</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground mb-2">Hello, I'm</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Victor Hanert, <span className="font-light block md:inline-block md:text-6xl">
              {age} years
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">Full Stack Developer</p>
        </div>
      </div>
      
      <div className="flex gap-6 mb-12">
        <a href="https://github.com/VictorHanert" target="_blank" rel="noopener noreferrer" className="hover-lift">
          <GithubIcon className="w-6 h-6" />
        </a>
        <a href="https://linkedin.com/in/victor-hanert/" target="_blank" rel="noopener noreferrer" className="hover-lift">
          <LinkedinIcon className="w-6 h-6" />
        </a>
        <a href="https://instagram.com/VictorHanert" target="_blank" rel="noopener noreferrer" className="hover-lift">
          <InstagramIcon className="w-6 h-6" />
        </a>
        <a href="mailto:v.hanert@gmail.com" className="hover-lift">
          <Mail className="w-6 h-6" />
        </a>
      </div>
      
      <div className="glass-card p-6 max-w-md rounded-lg mb-20">
        <p className="text-sm text-muted-foreground">
          Based in <span className="font-semibold">København V</span> • Open to opportunities
        </p>
      </div>

      <div className="absolute bottom-0 cursor-pointer" onClick={scrollToAbout}>
        <ChevronDown className="w-8 h-8 text-muted-foreground animate-bounce" />
      </div>
    </section>
  );
};