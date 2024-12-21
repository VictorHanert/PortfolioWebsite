import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;