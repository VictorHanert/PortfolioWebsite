import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import OriginPicker from '@/components/travel-agent/OriginPicker';
import type { SearchFilters } from '@/types/travel';
import { SEARCH_TOOL, type AgentMessage } from '@/services/travelSearch';

const STARTER_PROMPTS = [
    'Warm beach in March for under 12.000 kr.',
    'Weekend city trip with great food',
    'Nature and hiking somewhere quiet',
    'Ski trip in February',
];

const MAX_INPUT_LENGTH = 1000;

interface ChatPanelProps {
    messages: (AgentMessage & { id: string })[];
    isBusy: boolean;
    error: string | null;
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
    onSend: (text: string) => void;
}

const textOf = (message: AgentMessage) =>
    message.parts.map((part) => (part.type === 'text' ? (part as { text?: string }).text ?? '' : '')).join('');

export default function ChatPanel({ messages, isBusy, error, filters, onFiltersChange, onSend }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages, isBusy]);

    const submit = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isBusy) return;
        onSend(trimmed);
        setInput('');
    };

    // While waiting, say whether the agent is thinking or already searching the database
    const lastParts = messages[messages.length - 1]?.parts ?? [];
    const isSearching = lastParts.some((part) => part.type === SEARCH_TOOL && part.state !== 'output-available');

    return (
        <aside className="flex h-auto flex-col border-b border-border bg-card lg:h-full lg:border-b-0 lg:border-r">
            {/* Header */}
            <div className="border-b border-dashed border-border px-4 py-5 sm:px-6">
                <h1 className="ta-display text-2xl font-medium leading-tight text-foreground">Talk it through</h1>
                <p className="mt-1 text-xs text-muted-foreground">
                    Describe the trip, then refine it. The agent sets the filters for you.
                </p>

                <div className="mt-4 space-y-2.5">
                    <div className="ta-label flex flex-wrap items-center gap-1.5">
                        <span>Travelling from</span>
                        <OriginPicker code={filters.originCode} onChange={(originCode) => onFiltersChange({ ...filters, originCode })} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <label htmlFor="chat-use-history" className="text-xs text-foreground">
                            Tune results to Victor's travel taste
                        </label>
                        <Switch
                            id="chat-use-history"
                            checked={filters.useVisitedCountriesData}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, useVisitedCountriesData: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <label htmlFor="chat-include-visited" className="text-xs text-foreground">
                            Include countries Victor has visited
                        </label>
                        <Switch
                            id="chat-include-visited"
                            checked={filters.includeVisitedCountries}
                            onCheckedChange={(checked) => onFiltersChange({ ...filters, includeVisitedCountries: checked })}
                        />
                    </div>
                </div>
            </div>

            {/* Conversation */}
            <div className="max-h-[40vh] space-y-4 overflow-y-auto px-4 py-4 sm:px-6 lg:max-h-none lg:flex-1">
                {messages.length === 0 && (
                    <div>
                        <p className="ta-label mb-2">Try one of these</p>
                        <div className="divide-y divide-dashed divide-border border-y border-dashed border-border">
                            {STARTER_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => submit(prompt)}
                                    className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-xs text-foreground transition-colors hover:bg-muted/60"
                                >
                                    {prompt}
                                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message) => {
                    const text = textOf(message);
                    if (!text) return null;
                    const isUser = message.role === 'user';
                    return (
                        <div key={message.id}>
                            <p className="ta-label mb-1">{isUser ? 'You' : 'Agent'}</p>
                            <p
                                className={`whitespace-pre-wrap text-sm leading-relaxed text-foreground ${isUser
                                        ? 'ta-display text-base italic'
                                        : 'border-l-2 border-[hsl(var(--ta-accent))] pl-3'
                                    }`}
                            >
                                {text}
                            </p>
                        </div>
                    );
                })}

                {isBusy && (
                    <p className="ta-label flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {isSearching ? 'Searching the destination database' : 'Thinking'}
                    </p>
                )}

                {error && <p className="border-l-2 border-destructive pl-3 text-xs text-destructive">{error}</p>}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
                className="border-t border-border p-4 sm:px-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    submit(input);
                }}
            >
                <Textarea
                    value={input}
                    maxLength={MAX_INPUT_LENGTH}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submit(input);
                        }
                    }}
                    placeholder={messages.length === 0 ? 'Where do you want to go, when, and for how much?' : 'Refine it: cheaper, warmer, shorter flight...'}
                    className="min-h-[64px] resize-none bg-background text-sm"
                />
                <button
                    type="submit"
                    disabled={isBusy || !input.trim()}
                    className="ta-mono mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-foreground text-xs uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isBusy ? 'Working...' : messages.length === 0 ? 'Find my destination' : 'Send'}
                    <ArrowRight className="h-4 w-4" />
                </button>
            </form>
        </aside>
    );
}
