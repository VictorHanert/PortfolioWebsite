import { useState } from "react";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import BackToTopButton from "@/components/BackToTopButton";
import { ChatBot, ChatBotButton } from "@/components/ChatBot";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <BackToTopButton />
      
      {/* Floating Chat Button */}
      <ChatBotButton onClick={() => setIsChatOpen(true)} />
      
      {/* Chat Dialog */}
      <ChatBot isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
};

export default Index;