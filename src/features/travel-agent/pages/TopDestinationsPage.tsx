import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DestinationCard from '@/features/travel-agent/components/DestinationCard';
import DestinationSheet from '@/features/travel-agent/components/DestinationSheet';
import { fetchTopDestinations } from '@/features/travel-agent/lib/api';
import { askAgentPrompt, preferencesFromFilters } from '@/features/travel-agent/lib/travelSearch';
import type { DestinationCardData } from '@/features/travel-agent/types';
import { DEFAULT_FILTERS } from '@/features/travel-agent/types';

type Sort = 'suggested' | 'opened';

const SORTS: { value: Sort; label: string }[] = [
    { value: 'suggested', label: 'Most suggested' },
    { value: 'opened', label: 'Most opened' },
];

const times = (count: number) => `${count.toLocaleString('da-DK')} ${count === 1 ? 'time' : 'times'}`;

export default function TopDestinationsPage() {
    const navigate = useNavigate();
    const [sort, setSort] = useState<Sort>('suggested');
    const [selected, setSelected] = useState<DestinationCardData | null>(null);
    const top = useQuery({ queryKey: ['top-destinations', sort], queryFn: () => fetchTopDestinations(sort) });

    return (
        <div className="ta-grid min-h-[calc(100vh-3.5rem)] px-4 py-8 sm:px-6 lg:px-10">
            <header className="mb-6 max-w-2xl">
                <p className="ta-label">Across every search on this site</p>
                <h1 className="ta-display mt-1 text-4xl font-medium leading-tight text-foreground sm:text-5xl">
                    Top <span className="ta-accent italic">destinations</span>
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    The places the filters and the agent suggest most often, and the ones visitors open most. Only counts are kept.
                </p>
            </header>

            <div className="mb-5 flex border-b border-border">
                {SORTS.map(({ value, label }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setSort(value)}
                        className={`ta-mono -mb-px mr-6 border-b-2 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${sort === value
                                ? 'border-[hsl(var(--ta-accent))] text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {top.data && top.data.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {top.data.map((entry, index) => (
                        <DestinationCard
                            key={entry.destination.id}
                            card={{ destination: entry.destination, reason: '' }}
                            index={index}
                            onSelect={setSelected}
                            note={`Suggested ${times(entry.suggestedCount)} / opened ${times(entry.openedCount)}`}
                        />
                    ))}
                </div>
            ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    {top.isPending
                        ? 'Counting...'
                        : top.isError
                            ? 'The list could not be loaded. Please try again in a moment.'
                            : 'Nothing has been counted yet. Run a search and it will show up here.'}
                </p>
            )}

            <DestinationSheet
                card={selected}
                preferences={preferencesFromFilters(DEFAULT_FILTERS)}
                onClose={() => setSelected(null)}
                onSelect={setSelected}
                onAskAgent={(destination) => navigate('/travel-agent', { state: { ask: askAgentPrompt(destination) } })}
            />
        </div>
    );
}
