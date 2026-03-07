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
  title?: string;
  welcomeMessage?: string;
  starterQuestions?: string[];
  apiEndpoint?: string;
}

export const ChatBot = ({
  isOpen,
  onOpenChange,
  title = "Portfolio Assistant",
  welcomeMessage = "👋 Hi! I'm an AI assistant for this portfolio. Feel free to ask me anything about Victor, his skills, or his projects!",
  starterQuestions = [],
  apiEndpoint = "/api/chat",
}: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ]);
  }, [welcomeMessage, apiEndpoint]);

  const sendMessage = async (rawInput: string) => {
    const trimmedInput = rawInput.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedInput,
          messages: messages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content }))
            .concat([{ role: "user", content: trimmedInput }]),
        }),
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("ModelUnavailable");
        } else if (response.status === 504) {
          throw new Error("Timeout");
        } else {
          throw new Error("UnknownError");
        }
      }

      const data = await response.json();
      const assistantContent = data.message || data.answer || "I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: assistantContent,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      let errorMessage = "Sorry, I encountered an error. Please try again later.";

      if (error.message === "ModelUnavailable") {
        errorMessage = "The AI model is currently unavailable due to high demand. Please try again in a few moments.";
      } else if (error.message === "Timeout") {
        errorMessage = "The request took too long to process, so it was cancelled. Please try to rephrase your question.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "error",
          role: "assistant",
          content: errorMessage,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(inputValue);
  };

  const handleStarterQuestionClick = async (question: string) => {
    await sendMessage(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 flex h-full w-full max-w-full flex-col overflow-hidden border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-2 sm:bottom-4 sm:left-4 sm:h-[600px] sm:max-w-[380px] sm:w-[calc(100%-2rem)] sm:rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <h2 className="text-sm font-bold tracking-tight text-foreground">{title}</h2>
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
          {messages.map((message, index) => (
            <div key={message.id} className="flex flex-col gap-3">
              <div
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

              {/* Render starter questions ONLY after the first assistant message and ONLY if user hasn't replied yet */}
              {index === 0 && starterQuestions.length > 0 && messages.length === 1 && (
                <div className="ml-2 flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-2 duration-500">
                  {starterQuestions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="h-auto whitespace-normal rounded-xl border-border bg-background/50 px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      onClick={() => handleStarterQuestionClick(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}
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
          autoFocus
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