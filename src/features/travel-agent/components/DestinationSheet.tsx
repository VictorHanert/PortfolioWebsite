import { useEffect, useState } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, ArrowUpRight, Bookmark, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { fetchSimilar, reportOpened } from '@/features/travel-agent/lib/api';
import { useFavorites } from '@/features/travel-agent/lib/favorites';
import { findOrigin, formatCoordinates, formatMonths } from '@/features/travel-agent/lib/travelSearch';
import type { DestinationCardData, DestinationRow, TravelPreferences } from '@/features/travel-agent/types';

const DAY_OPTIONS = [3, 5, 7, 10];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface DestinationSheetProps {
    card: DestinationCardData | null;
    preferences: TravelPreferences;
    onClose: () => void;
    onSelect: (card: DestinationCardData) => void;
    onAskAgent: (destination: DestinationRow) => void;
}

const chipClass = (active: boolean) =>
    `ta-mono h-7 rounded-sm border px-2.5 text-[11px] transition-colors ${active
        ? 'border-[hsl(var(--ta-accent))] bg-[hsl(var(--ta-accent))] text-background'
        : 'border-border bg-card text-foreground hover:border-foreground'
    }`;

function SheetBody({ card, preferences, onSelect, onAskAgent }: Omit<DestinationSheetProps, 'card' | 'onClose'> & { card: DestinationCardData }) {
    const { destination, reason } = card;
    const origin = findOrigin(preferences.originCode);
    const months = destination.best_months ?? [];

    const { isFavorite, toggle } = useFavorites();
    const saved = isFavorite(destination.id);

    // Counted once per opened destination, for the "Top destinations" page
    useEffect(() => reportOpened(destination.id), [destination.id]);

    const [days, setDays] = useState(5);
    const [month, setMonth] = useState<number | null>(months[0] ?? null);

    const plan = useCompletion({ api: '/api/travel-plan', streamProtocol: 'text' });
    const similar = useQuery({
        queryKey: ['similar-destinations', destination.id, preferences],
        queryFn: () => fetchSimilar(destination, preferences),
        staleTime: Infinity,
    });

    const place = `${destination.name}, ${destination.country}`;

    return (
        <>
            {destination.image_url && (
                <img src={destination.image_url} alt={place} className="aspect-[16/9] w-full object-cover" />
            )}

            <div className="space-y-6 px-5 py-5 sm:px-7">
                {/* Route, like the header of a boarding pass */}
                <div>
                    <div className="flex items-baseline justify-between gap-3">
                        <p className="ta-label">
                            {origin.name} <span className="ta-accent">to</span> {destination.country}
                        </p>
                        <p className="ta-label">{formatCoordinates(destination.latitude, destination.longitude)}</p>
                    </div>
                    <SheetTitle className="ta-display mt-1 text-3xl font-medium leading-tight text-foreground">
                        {destination.name}
                    </SheetTitle>
                    <SheetDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {destination.description}
                    </SheetDescription>
                </div>

                <dl className="grid grid-cols-3 gap-3 border-y border-dashed border-border py-3">
                    <div>
                        <dt className="ta-label">Cost, one week</dt>
                        <dd className="ta-mono mt-1 text-sm text-foreground">
                            {destination.avg_cost_dkk !== null ? `${destination.avg_cost_dkk.toLocaleString('da-DK')} kr.` : '-'}
                        </dd>
                    </div>
                    <div>
                        <dt className="ta-label">Travel time</dt>
                        <dd className="ta-mono mt-1 text-sm text-foreground">
                            {destination.flight_hours !== null ? `${Number(destination.flight_hours).toLocaleString('da-DK')} h` : '-'}
                        </dd>
                    </div>
                    <div>
                        <dt className="ta-label">Best months</dt>
                        <dd className="ta-mono mt-1 text-sm text-foreground">{months.length ? formatMonths(months) : '-'}</dd>
                    </div>
                </dl>
                {origin.code !== 'DNK' && (
                    <p className="-mt-3 text-[11px] text-muted-foreground">
                        Travel time is estimated from {origin.name}. The cost still assumes flights from Copenhagen.
                    </p>
                )}

                {reason && (
                    <p className="ta-display border-l-2 border-[hsl(var(--ta-accent))] pl-3 text-base italic leading-snug text-foreground">
                        {reason}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => toggle(destination)}
                    aria-pressed={saved}
                    className="ta-mono flex h-9 w-full items-center justify-center gap-2 rounded-sm border border-foreground/80 bg-card text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted"
                >
                    <Bookmark className="h-3.5 w-3.5" fill={saved ? 'hsl(var(--ta-accent))' : 'none'} stroke={saved ? 'hsl(var(--ta-accent))' : 'currentColor'} />
                    {saved ? 'Saved to my favorites' : 'Save to my favorites'}
                </button>

                {/* Trip plan */}
                <section>
                    <h3 className="ta-label mb-2">Plan this trip</h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {DAY_OPTIONS.map((option) => (
                            <button type="button" key={option} onClick={() => setDays(option)} className={chipClass(days === option)}>
                                {option} days
                            </button>
                        ))}
                    </div>
                    {months.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {months.map((option) => (
                                <button type="button" key={option} onClick={() => setMonth(option)} className={chipClass(month === option)}>
                                    {MONTH_NAMES[option - 1]}
                                </button>
                            ))}
                        </div>
                    )}
                    <button
                        type="button"
                        disabled={plan.isLoading}
                        onClick={() => plan.complete('', { body: { destinationId: destination.id, days, month, preferences } })}
                        className="ta-mono mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-foreground text-xs uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                        {plan.isLoading ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Writing your plan...
                            </>
                        ) : (
                            <>
                                {plan.completion ? 'Write it again' : `Write my ${days}-day plan`} <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>

                    {plan.error && (
                        <p className="mt-3 text-xs text-destructive">The agent could not write a plan right now. Please try again in a moment.</p>
                    )}
                    {plan.completion && (
                        <div className="ta-prose mt-4 border-t border-dashed border-border pt-3">
                            <ReactMarkdown>{plan.completion}</ReactMarkdown>
                            <p className="mt-3 text-[11px] text-muted-foreground">Written by AI. Check opening hours and bookings yourself.</p>
                        </div>
                    )}
                </section>

                {/* Similar places */}
                {similar.data && similar.data.length > 0 && (
                    <section>
                        <h3 className="ta-label mb-2">If you like this, consider</h3>
                        <div className="divide-y divide-dashed divide-border border-y border-dashed border-border">
                            {similar.data.map((row) => (
                                <button
                                    type="button"
                                    key={row.id}
                                    onClick={() => onSelect({ destination: row, reason: `Similar in feel to ${destination.name}.` })}
                                    className="flex w-full items-center gap-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                                >
                                    {row.image_url && <img src={row.image_url} alt="" loading="lazy" className="h-12 w-16 rounded-sm object-cover" />}
                                    <span className="min-w-0 flex-1">
                                        <span className="ta-display block truncate text-base text-foreground">{row.name}</span>
                                        <span className="ta-label">{row.country}</span>
                                    </span>
                                    <span className="ta-mono text-[11px] text-muted-foreground">
                                        {row.avg_cost_dkk !== null ? `${row.avg_cost_dkk.toLocaleString('da-DK')} kr.` : ''}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Next steps */}
                <section className="space-y-1.5 pb-4">
                    <h3 className="ta-label mb-2">Go further</h3>
                    <button
                        type="button"
                        onClick={() => onAskAgent(destination)}
                        className="flex w-full items-center justify-between rounded-sm border border-border bg-card px-3 py-2.5 text-xs text-foreground transition-colors hover:border-foreground"
                    >
                        Ask the agent about {destination.name} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <a
                        href={`https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${origin.name} to ${place}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-sm border border-border bg-card px-3 py-2.5 text-xs text-foreground transition-colors hover:border-foreground"
                    >
                        Look up flights <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-sm border border-border bg-card px-3 py-2.5 text-xs text-foreground transition-colors hover:border-foreground"
                    >
                        Open on the map <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                </section>
            </div>
        </>
    );
}

export default function DestinationSheet({ card, onClose, ...rest }: DestinationSheetProps) {
    return (
        <Sheet open={card !== null} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="right"
                className="ta w-full overflow-y-auto border-l border-foreground/80 p-0 sm:max-w-xl [&>button]:rounded-sm [&>button]:bg-card [&>button]:p-1 [&>button]:opacity-100"
            >
                {/* Keyed so the plan and the pickers reset when another destination opens */}
                {card && <SheetBody key={card.destination.id} card={card} {...rest} />}
            </SheetContent>
        </Sheet>
    );
}
