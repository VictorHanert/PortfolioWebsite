import { useMemo, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useMutation } from '@tanstack/react-query';
import { DefaultChatTransport } from 'ai';
import { MessageCircle, SlidersHorizontal } from 'lucide-react';
import ChatPanel from '@/components/travel-agent/ChatPanel';
import DestinationCard from '@/components/travel-agent/DestinationCard';
import PreferencePanel from '@/components/travel-agent/PreferencePanel';
import {
    cardsFromMessages,
    filterReason,
    filtersToSearchInput,
    formatMonths,
    latestSearchInput,
    preferencesFromFilters,
} from '@/services/travelSearch';
import type { DestinationCardData, DestinationRow, SearchFilters, SearchInput } from '@/types/travel';
import { DEFAULT_FILTERS } from '@/types/travel';

type Mode = 'filters' | 'chat';

const MODES: { value: Mode; label: string; icon: typeof SlidersHorizontal }[] = [
    { value: 'filters', label: 'Filters', icon: SlidersHorizontal },
    { value: 'chat', label: 'Ask the agent', icon: MessageCircle },
];

const transport = new DefaultChatTransport({ api: '/api/travel-agent' });

// Panel search: no language model, the filters go straight to the database
async function searchByFilters(filters: SearchFilters, semanticText: string): Promise<DestinationCardData[]> {
    const input = filtersToSearchInput(filters, semanticText);
    if (!input) return [];

    const preferences = preferencesFromFilters(filters);
    const res = await fetch('/api/travel-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, preferences }),
    });
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);

    const { destinations } = (await res.json()) as { destinations: DestinationRow[] };
    return destinations.map((destination) => ({ destination, reason: filterReason(destination, input, preferences) }));
}

// Short labels for the filters the agent applied in its latest search
function filterLabels(input: SearchInput | null): string[] {
    if (!input) return [];
    return [
        input.minCostDkk ? `Min ${input.minCostDkk.toLocaleString('da-DK')} kr.` : '',
        input.maxCostDkk ? `Max ${input.maxCostDkk.toLocaleString('da-DK')} kr.` : '',
        input.minFlightHours ? `Over ${input.minFlightHours.toLocaleString('da-DK')} h travel` : '',
        input.maxFlightHours ? `Max ${input.maxFlightHours.toLocaleString('da-DK')} h travel` : '',
        input.months?.length ? formatMonths(input.months) : '',
        ...(input.categories ?? []),
    ].filter(Boolean);
}

export default function TravelAgent() {
    const [mode, setMode] = useState<Mode>('filters');
    const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
    const [semanticText, setSemanticText] = useState('');

    const panelSearch = useMutation({ mutationFn: () => searchByFilters(filters, semanticText) });
    const { messages, sendMessage, status, error: chatError } = useChat({ transport });

    const chatCards = useMemo(() => cardsFromMessages(messages), [messages]);
    const chatFilters = useMemo(() => filterLabels(latestSearchInput(messages)), [messages]);
    const chatBusy = status === 'submitted' || status === 'streaming';

    const isChat = mode === 'chat';
    const cards = isChat ? chatCards : panelSearch.data ?? [];
    const isBusy = isChat ? chatBusy : panelSearch.isPending;

    let emptyText = isChat
        ? 'Tell the agent what kind of trip you want, and your suggestions will show up here.'
        : 'Set your preferences and click "Find my destination" to see tailored results here.';
    if (isBusy) emptyText = 'Finding destinations for you...';
    else if (!isChat && panelSearch.isError) emptyText = 'Something went wrong while searching. Please try again in a moment.';
    else if (!isChat && panelSearch.isSuccess) emptyText = 'No destinations matched your filters. Try adjusting your criteria.';

    return (
        <div className="pt-16">
            <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-background lg:h-[calc(100vh-4rem)] lg:min-h-0 lg:flex-row lg:overflow-hidden">
                {/* Controls: stacked on mobile, sidebar on desktop */}
                <div className="flex w-full flex-col lg:h-full lg:w-[420px] lg:min-w-[460px] xl:w-[560px] xl:min-w-[500px]">
                    <div className="grid grid-cols-2 gap-1 border-b border-border bg-card p-2 lg:border-r">
                        {MODES.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setMode(value)}
                                className={`flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-medium transition-colors ${mode === value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="lg:min-h-0 lg:flex-1">
                        {isChat ? (
                            <ChatPanel
                                messages={messages}
                                isBusy={chatBusy}
                                error={chatError ? 'The travel agent is unavailable right now. Try again in a moment, or use the filters instead.' : null}
                                filters={filters}
                                onFiltersChange={setFilters}
                                onSend={(text) => sendMessage({ text }, { body: { preferences: preferencesFromFilters(filters) } })}
                            />
                        ) : (
                            <PreferencePanel
                                filters={filters}
                                onChange={setFilters}
                                semanticText={semanticText}
                                onSemanticTextChange={setSemanticText}
                                onSearch={() => panelSearch.mutate()}
                                isSearching={panelSearch.isPending}
                            />
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
                    {isChat && chatFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Filters applied</span>
                            {chatFilters.map((label) => (
                                <span key={label} className="rounded-full bg-primary/15 px-3 py-1 text-xs text-foreground">
                                    {label}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                        {cards.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {cards.map((card, index) => (
                                    <DestinationCard key={card.destination.id} card={card} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
                                <p className="max-w-md text-sm text-muted-foreground">{emptyText}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
