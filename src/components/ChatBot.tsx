import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChatBot = ({ isOpen, onOpenChange }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm an AI assistant for this portfolio. Feel free to ask me anything about the portfolio owner (Victor), their skills, experience, or projects!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages
            .filter((m) => m.id !== "welcome") // Exclude welcome message from API
            .map((m) => ({
              role: m.role,
              content: m.content,
            }))
            .concat([
              {
                role: "user",
                content: inputValue,
              },
            ]),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error while processing your request. Please make sure the API is properly configured.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[600px] max-w-md flex-col rounded-lg border border-border bg-background p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Portfolio Assistant
          </DialogTitle>
          <DialogDescription>
            Ask me anything about Victor's skills and experience
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs rounded-lg px-4 py-2 text-sm leading-relaxed",
                    message.role === "user"
                      ? "border border-primary bg-primary text-primary-foreground"
                      : "border border-secondary-foreground/20 bg-secondary text-secondary-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-secondary-foreground/20 bg-secondary px-4 py-2 text-sm text-secondary-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Chat Toggle Button - can be used anywhere to trigger the chatbot
export const ChatBotButton = ({
  onClick,
}: { onClick?: () => void }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl text-xs border-2 border-white"
    >
      <span className="hidden sm:inline">Ask AI about me</span>
      <MessageCircle className="h-4 w-4" />
    </Button>
  );
};
