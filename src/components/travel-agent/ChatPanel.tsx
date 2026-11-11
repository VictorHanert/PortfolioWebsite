import { useEffect, useRef, useState } from 'react';
import { Loader2, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { TravelPreferences } from '@/types/travel';
import { SEARCH_TOOL, type AgentMessage } from '@/services/travelSearch';

const STARTER_PROMPTS = [
    'Warm beach in March for under 8.000 kr.',
    'Weekend city trip with great food',
    'Nature and hiking somewhere quiet',
    'Ski trip in February',
];

const MAX_INPUT_LENGTH = 1000;

interface ChatPanelProps {
    messages: (AgentMessage & { id: string })[];
    isBusy: boolean;
    error: string | null;
    preferences: TravelPreferences;
    onPreferencesChange: (preferences: TravelPreferences) => void;
    onSend: (text: string) => void;
}

const textOf = (message: AgentMessage) =>
    message.parts.map((part) => (part.type === 'text' ? (part as { text?: string }).text ?? '' : '')).join('');

export default function ChatPanel({ messages, isBusy, error, preferences, onPreferencesChange, onSend }: ChatPanelProps) {
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
            <div className="border-b border-border px-4 pb-4 pt-6 sm:px-6 lg:pt-8">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">Next Destination</h1>
                <p className="text-xs text-muted-foreground">
                    Describe the trip you have in mind. The agent searches a curated set of destinations from Copenhagen.
                </p>

                <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="use-history" className="text-xs text-foreground">
                            Tune results to Victor's travel taste
                        </Label>
                        <Switch
                            id="use-history"
                            checked={preferences.useVictorHistory}
                            onCheckedChange={(checked) => onPreferencesChange({ ...preferences, useVictorHistory: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="include-visited" className="text-xs text-foreground">
                            Include countries Victor has visited
                        </Label>
                        <Switch
                            id="include-visited"
                            checked={preferences.includeVisited}
                            onCheckedChange={(checked) => onPreferencesChange({ ...preferences, includeVisited: checked })}
                        />
                    </div>
                </div>
            </div>

            {/* Conversation */}
            <div className="max-h-[40vh] space-y-3 overflow-y-auto px-4 py-4 sm:px-6 lg:max-h-none lg:flex-1">
                {messages.length === 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Try one of these</p>
                        {STARTER_PROMPTS.map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                onClick={() => submit(prompt)}
                                className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-muted"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                {messages.map((message) => {
                    const text = textOf(message);
                    if (!text) return null;
                    const isUser = message.role === 'user';
                    return (
                        <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <p
                                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${isUser
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-foreground'
                                    }`}
                            >
                                {text}
                            </p>
                        </div>
                    );
                })}

                {isBusy && (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {isSearching ? 'Searching the destination database...' : 'Thinking...'}
                    </p>
                )}

                {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
                className="border-t border-border p-4 sm:p-6"
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
                    className="min-h-[72px] resize-none bg-muted/40 text-sm"
                />
                <Button type="submit" disabled={isBusy || !input.trim()} className="mt-3 h-11 w-full text-sm font-semibold">
                    {isBusy ? 'Working...' : messages.length === 0 ? 'Find my destination' : 'Send'}
                    <Plane className="ml-2 h-4 w-4" />
                </Button>
            </form>
        </aside>
    );
}
