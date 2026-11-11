import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DestinationCard from '@/features/travel-agent/components/DestinationCard';
import DestinationSheet from '@/features/travel-agent/components/DestinationSheet';
import { useFavorites } from '@/features/travel-agent/lib/favorites';
import { askAgentPrompt, preferencesFromFilters } from '@/features/travel-agent/lib/travelSearch';
import type { DestinationCardData } from '@/features/travel-agent/types';
import { DEFAULT_FILTERS } from '@/features/travel-agent/types';

export default function FavoritesPage() {
    const navigate = useNavigate();
    const { favorites } = useFavorites();
    const [selected, setSelected] = useState<DestinationCardData | null>(null);

    return (
        <div className="ta-grid min-h-[calc(100vh-3.5rem)] px-4 py-8 sm:px-6 lg:px-10">
            <header className="mb-6 max-w-2xl">
                <p className="ta-label">Saved in this browser</p>
                <h1 className="ta-display mt-1 text-4xl font-medium leading-tight text-foreground sm:text-5xl">
                    My <span className="ta-accent italic">favorites</span>
                </h1>
            </header>

            {favorites.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {favorites.map((destination, index) => (
                        <DestinationCard key={destination.id} card={{ destination, reason: '' }} index={index} onSelect={setSelected} />
                    ))}
                </div>
            ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    Nothing saved yet. Use the bookmark on a destination to keep it here, or{' '}
                    <Link to="/travel-agent" className="ta-accent underline underline-offset-2">
                        start a search
                    </Link>
                    .
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
