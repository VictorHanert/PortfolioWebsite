import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
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
        "👋 Hi! I'm an AI assistant for this portfolio. Feel free to ask me anything about Victor, his skills, or his projects!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content }))
            .concat([{ role: "user", content: inputValue }]),
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: "error",
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 flex h-full w-full max-w-full flex-col overflow-hidden sm:rounded-xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-2 sm:bottom-4 sm:left-4 sm:h-[600px] sm:max-w-[380px] sm:w-[calc(100%-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <h2 className="text-sm font-bold tracking-tight text-foreground">Portfolio Assistant</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-muted-foreground rounded-tl-none border border-border"
                )}
              >
                {/* Wrapping ReactMarkdown in a div to avoid the className error */}
                <div className={cn(
                  "prose prose-sm max-w-none break-words leading-relaxed",
                  "prose-p:m-0 prose-ul:my-2 prose-li:my-0.5",
                  "prose-strong:font-bold prose-strong:text-inherit",
                  message.role === "user" ? "prose-invert" : "dark:prose-invert"
                )}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-border bg-muted px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <Loader2 className="h-3 w-3 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={scrollBottomRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 border-t border-border bg-background p-3"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="h-9 flex-1 border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !inputValue.trim()}
          className="h-9 w-9 shrink-0 rounded-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export const ChatBotButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 left-6 gap-2 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 z-40 border-2 border-white"
    >
        <span className="hidden sm:inline">Ask AI about me</span>
        <MessageCircle className="h-4 w-4" />
    </Button>
  );
};