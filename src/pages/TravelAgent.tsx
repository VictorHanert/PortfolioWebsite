import { useMemo, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ChatPanel from '@/components/travel-agent/ChatPanel';
import DestinationCard from '@/components/travel-agent/DestinationCard';
import { cardsFromMessages, formatMonths, latestSearchInput } from '@/services/travelSearch';
import type { SearchInput, TravelPreferences } from '@/types/travel';

const transport = new DefaultChatTransport({ api: '/api/travel-agent' });

// Short labels for the filters the agent applied in its latest search
function filterLabels(input: SearchInput | null): string[] {
    if (!input) return [];
    return [
        input.maxCostDkk ? `Max ${input.maxCostDkk.toLocaleString('da-DK')} kr.` : '',
        input.maxFlightHours ? `Max ${input.maxFlightHours.toLocaleString('da-DK')} h travel` : '',
        input.months?.length ? formatMonths(input.months) : '',
        ...(input.categories ?? []),
    ].filter(Boolean);
}

export default function TravelAgent() {
    const [preferences, setPreferences] = useState<TravelPreferences>({ useVictorHistory: true, includeVisited: false });
    const { messages, sendMessage, status, error } = useChat({ transport });

    const cards = useMemo(() => cardsFromMessages(messages), [messages]);
    const filters = useMemo(() => filterLabels(latestSearchInput(messages)), [messages]);
    const isBusy = status === 'submitted' || status === 'streaming';

    return (
        <div className="pt-16">
            <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-background lg:h-[calc(100vh-4rem)] lg:min-h-0 lg:flex-row lg:overflow-hidden">
                {/* Chat: stacked on mobile, sidebar on desktop */}
                <div className="w-full lg:w-[420px] lg:min-w-[420px] xl:w-[480px] xl:min-w-[480px]">
                    <ChatPanel
                        messages={messages}
                        isBusy={isBusy}
                        error={error ? 'The travel agent is unavailable right now. Please try again in a moment.' : null}
                        preferences={preferences}
                        onPreferencesChange={setPreferences}
                        onSend={(text) => sendMessage({ text }, { body: { preferences } })}
                    />
                </div>

                {/* Results */}
                <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
                    {filters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Filters applied</span>
                            {filters.map((label) => (
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
                                <p className="max-w-md text-sm text-muted-foreground">
                                    {isBusy
                                        ? 'Finding destinations for you...'
                                        : 'Tell the agent what kind of trip you want, and your suggestions will show up here.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
