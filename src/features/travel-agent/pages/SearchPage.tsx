import { useEffect, useMemo, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useMutation } from '@tanstack/react-query';
import { DefaultChatTransport } from 'ai';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatPanel from '@/features/travel-agent/components/ChatPanel';
import DestinationCard from '@/features/travel-agent/components/DestinationCard';
import DestinationSheet from '@/features/travel-agent/components/DestinationSheet';
import PreferencePanel from '@/features/travel-agent/components/PreferencePanel';
import { searchByFilters } from '@/features/travel-agent/lib/api';
import {
    askAgentPrompt,
    cardsFromMessages,
    filtersToSearchInput,
    findOrigin,
    latestSearchInput,
    preferencesFromFilters,
    searchLabels,
} from '@/features/travel-agent/lib/travelSearch';
import type { DestinationCardData, SearchFilters } from '@/features/travel-agent/types';
import { DEFAULT_FILTERS } from '@/features/travel-agent/types';

type Mode = 'filters' | 'chat';

const MODES: { value: Mode; label: string }[] = [
    { value: 'filters', label: 'Filters' },
    { value: 'chat', label: 'Ask the agent' },
];

const HISTORY_KEY = 'travel-agent-history';
const MAX_HISTORY = 6;

interface HistoryEntry {
    id: number;
    filters: SearchFilters;
    semanticText: string;
}

const transport = new DefaultChatTransport({ api: '/api/travel-agent' });

function loadHistory(): HistoryEntry[] {
    try {
        const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

function historyLabel(entry: HistoryEntry): string {
    const labels = searchLabels(filtersToSearchInput(entry.filters, entry.semanticText));
    const origin = entry.filters.originCode === DEFAULT_FILTERS.originCode ? [] : [`from ${findOrigin(entry.filters.originCode).name}`];
    return [...labels, ...origin].join(' · ') || 'Anywhere';
}

export default function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>('filters');
    const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
    const [semanticText, setSemanticText] = useState('');
    const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
    const [selected, setSelected] = useState<DestinationCardData | null>(null);

    const panelSearch = useMutation({
        mutationFn: (search: { filters: SearchFilters; semanticText: string }) => searchByFilters(search.filters, search.semanticText),
    });
    const { messages, sendMessage, status, error: chatError } = useChat({ transport });

    useEffect(() => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }, [history]);

    const runPanelSearch = (search: { filters: SearchFilters; semanticText: string }) => {
        panelSearch.mutate(search);
        // Newest first, without repeating an identical search
        setHistory((prev) => {
            const entry = { id: Date.now(), ...search };
            const label = historyLabel(entry);
            return [entry, ...prev.filter((old) => historyLabel(old) !== label)].slice(0, MAX_HISTORY);
        });
    };

    const restoreSearch = (entry: HistoryEntry) => {
        const restored = { ...DEFAULT_FILTERS, ...entry.filters };
        setFilters(restored);
        setSemanticText(entry.semanticText);
        runPanelSearch({ filters: restored, semanticText: entry.semanticText });
    };

    const preferences = preferencesFromFilters(filters);
    const askAgent = (text: string) => sendMessage({ text }, { body: { preferences } });

    // "Ask the agent" on another page of the site arrives here as a question in the navigation state
    const pendingQuestion = (location.state as { ask?: string } | null)?.ask;
    useEffect(() => {
        if (!pendingQuestion) return;
        navigate('.', { replace: true, state: null });
        setMode('chat');
        sendMessage({ text: pendingQuestion }, { body: { preferences: preferencesFromFilters(DEFAULT_FILTERS) } });
    }, [pendingQuestion, navigate, sendMessage]);

    const chatCards = useMemo(() => cardsFromMessages(messages), [messages]);
    const chatFilters = useMemo(() => searchLabels(latestSearchInput(messages)).filter((label) => !label.startsWith('"')), [messages]);
    const chatBusy = status === 'submitted' || status === 'streaming';

    const isChat = mode === 'chat';
    const cards = isChat ? chatCards : panelSearch.data ?? [];
    const isBusy = isChat ? chatBusy : panelSearch.isPending;
    const origin = findOrigin(filters.originCode);

    let emptyHint = isChat
        ? 'Tell the agent what kind of trip you want. Your suggestions will show up here.'
        : 'Set the brief on the left and press "Find my destination".';
    if (isBusy) emptyHint = 'Looking through the atlas...';
    else if (!isChat && panelSearch.isError) emptyHint = 'Something went wrong while searching. Please try again in a moment.';
    else if (!isChat && panelSearch.isSuccess) emptyHint = 'Nothing matched this brief. Loosen a filter and try again.';

    return (
        <div>
            <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col lg:h-[calc(100vh-3.5rem)] lg:min-h-0 lg:flex-row lg:overflow-hidden">
                {/* Controls: stacked on mobile, sidebar on desktop */}
                <div className="flex w-full flex-col lg:h-full lg:w-[400px] lg:min-w-[400px] xl:w-[460px] xl:min-w-[460px]">
                    <div className="flex border-b border-border bg-card px-4 sm:px-6 lg:border-r">
                        {MODES.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setMode(value)}
                                className={`ta-mono -mb-px mr-6 border-b-2 py-3 text-[11px] uppercase tracking-[0.14em] transition-colors ${mode === value
                                        ? 'border-[hsl(var(--ta-accent))] text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="lg:min-h-0 lg:flex-1">
                        {isChat ? (
                            <ChatPanel
                                messages={messages}
                                isBusy={chatBusy}
                                error={chatError ? 'The agent is unavailable right now. Try again in a moment, or use the filters instead.' : null}
                                filters={filters}
                                onFiltersChange={setFilters}
                                onSend={askAgent}
                            />
                        ) : (
                            <PreferencePanel
                                filters={filters}
                                onChange={setFilters}
                                semanticText={semanticText}
                                onSemanticTextChange={setSemanticText}
                                onSearch={() => runPanelSearch({ filters, semanticText })}
                                isSearching={panelSearch.isPending}
                            />
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="ta-grid flex min-w-0 flex-1 flex-col lg:min-h-0">
                    {/* Recent panel searches, or the filters the agent applied */}
                    {!isChat && history.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto border-b border-border bg-background px-4 py-2.5 sm:px-6">
                            <span className="ta-label shrink-0">Recent</span>
                            {history.map((entry) => (
                                <button
                                    key={entry.id}
                                    type="button"
                                    onClick={() => restoreSearch(entry)}
                                    title="Run this search again"
                                    className="shrink-0 rounded-sm border border-border bg-card px-2.5 py-1 text-[11px] text-foreground transition-colors hover:border-foreground"
                                >
                                    {historyLabel(entry)}
                                </button>
                            ))}
                            <button type="button" onClick={() => setHistory([])} className="ta-label shrink-0 underline underline-offset-2 hover:text-foreground">
                                Clear
                            </button>
                        </div>
                    )}
                    {isChat && chatFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-4 py-2.5 sm:px-6">
                            <span className="ta-label">Filters applied</span>
                            {chatFilters.map((label) => (
                                <span key={label} className="rounded-sm border border-border bg-card px-2.5 py-1 text-[11px] text-foreground">
                                    {label}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                        {cards.length > 0 ? (
                            <>
                                <p className="ta-label mb-3">
                                    {cards.length} {cards.length === 1 ? 'destination' : 'destinations'} <span className="ta-accent">/</span> from {origin.name}
                                </p>
                                <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                                    {cards.map((card, index) => (
                                        <DestinationCard key={card.destination.id} card={card} index={index} onSelect={setSelected} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full min-h-[260px] flex-col items-center justify-center px-6 text-center">
                                <p className="ta-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
                                    Where to <span className="ta-accent italic">next?</span>
                                </p>
                                <p className="mt-4 max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <DestinationSheet
                card={selected}
                preferences={preferences}
                onClose={() => setSelected(null)}
                onSelect={setSelected}
                onAskAgent={(destination) => {
                    setSelected(null);
                    setMode('chat');
                    askAgent(askAgentPrompt(destination));
                }}
            />
        </div>
    );
}
