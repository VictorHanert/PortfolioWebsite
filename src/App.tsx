import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatBot, ChatBotButton } from "@/components/ChatBot";
import Index from "./pages/Index";
import GlobePage from "./pages/Globe";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const queryClient = new QueryClient();

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/globe" element={<GlobePage />} />
          </Routes>

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
        </BrowserRouter>
      </TooltipProvider>
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  );
};

export default App;
