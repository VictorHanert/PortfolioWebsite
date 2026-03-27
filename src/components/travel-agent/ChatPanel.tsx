import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { User, Bot } from 'lucide-react';
import type { ChatMessage } from '@/types/travel';

interface ChatPanelProps {
  messages: ChatMessage[];
  semanticText: string;
  onSemanticTextChange: (text: string) => void;
}

export default function ChatPanel({ messages, semanticText, onSemanticTextChange }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const welcomeMessage = messages.find((msg) => msg.id === 'welcome' && msg.role === 'agent');
  const visibleMessages = messages.filter((msg) => msg.id !== 'welcome');

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 sm:px-6 sm:py-6">
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'agent' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Semantic input */}
      <div className="border-t border-border px-4 py-4 sm:px-6">
        {welcomeMessage && (
          <div className="mb-3 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {welcomeMessage.content}
          </div>
        )}
        <Textarea
          value={semanticText}
          onChange={(e) => onSemanticTextChange(e.target.value)}
          placeholder="Describe your preferences about preferred destinations, activities, climate, etc. The more details, the better!"
          className="resize-none min-h-[80px] bg-muted/50 border-border text-sm"
        />
      </div>
    </div>
  );
}
