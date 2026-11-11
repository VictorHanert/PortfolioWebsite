// Calls from the travel agent UI to its own API routes (api/travel-*.ts)
import { filterReason, filtersToSearchInput, preferencesFromFilters } from './travelSearch';
import type { DestinationCardData, DestinationRow, SearchFilters, TopDestination, TravelPreferences } from '../types';

async function postSearch(body: object): Promise<DestinationRow[]> {
    const res = await fetch('/api/travel-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    return ((await res.json()) as { destinations: DestinationRow[] }).destinations;
}

// Panel search: no language model, the filters go straight to the database
export async function searchByFilters(filters: SearchFilters, semanticText: string): Promise<DestinationCardData[]> {
    const input = filtersToSearchInput(filters, semanticText);
    if (!input) return [];

    const preferences = preferencesFromFilters(filters);
    const destinations = await postSearch({ input, preferences });
    return destinations.map((destination) => ({ destination, reason: filterReason(destination, input, preferences) }));
}

export async function fetchSimilar(destination: DestinationRow, preferences: TravelPreferences): Promise<DestinationRow[]> {
    const destinations = await postSearch({
        input: { query: `${destination.name}, ${destination.country}. ${destination.description ?? ''}`.slice(0, 480) },
        preferences,
        excludeId: destination.id,
    });
    return destinations.slice(0, 3);
}

export async function fetchTopDestinations(sort: 'suggested' | 'opened'): Promise<TopDestination[]> {
    const res = await fetch(`/api/travel-top?sort=${sort}`);
    if (!res.ok) throw new Error(`Top destinations failed: ${res.status}`);
    return ((await res.json()) as { destinations: TopDestination[] }).destinations;
}

// Counts an opened destination for the "Top destinations" page. Failures are ignored on purpose.
export function reportOpened(destinationId: string): void {
    fetch('/api/travel-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationId }),
    }).catch(() => undefined);
}
