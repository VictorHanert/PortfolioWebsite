import { useState } from "react";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ChatBot, ChatBotButton } from "@/components/ChatBot";
import BackToTopButton from "@/components/BackToTopButton";

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
      <ChatBotButton onClick={() => setIsChatOpen(true)} />
          <ChatBot
            isOpen={isChatOpen}
            onOpenChange={setIsChatOpen}
            title="Portfolio Assistant"
            welcomeMessage="Ask me about Victor's projects, skills, background, or travel history and patterns."
            starterQuestions={[
              "Who is Victor?",
              "Victor's most visited countries?",
              "Football teams he support?",
              "What is the top skills of Victor?",
            ]}
          />
    </div>
  );
};

export default Index;