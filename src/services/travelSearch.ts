// Pure travel agent logic shared by api/travel-agent.ts and the UI. Keep imports relative: the API bundle has no "@" alias.
import { visitedCountries } from '../data/visitedCountries';
import { BUDGET_MAX, SEASON_MONTHS } from '../types/travel';
import type { DestinationCardData, DestinationRow, DistanceCategory, SearchFilters, SearchInput, TravelDuration, TravelPreferences } from '../types/travel';

const VISITED_COUNTRY_CODES = visitedCountries.map((country) => country.id);
const MAX_FALLBACK_CARDS = 6;

export const SEARCH_TOOL = 'tool-searchDestinations';
export const SHOW_TOOL = 'tool-showDestinations';

// Minimal shape of the AI SDK UI messages this module reads
export interface AgentMessagePart {
    type: string;
    state?: string;
    input?: unknown;
    output?: unknown;
}

export interface AgentMessage {
    role: string;
    parts: AgentMessagePart[];
}

// Arguments for the search_destinations RPC
export function buildSearchArgs(input: SearchInput, preferences: TravelPreferences, queryEmbedding: number[] | null) {
    return {
        query_embedding: queryEmbedding ? JSON.stringify(queryEmbedding) : null,
        use_profile: preferences.useVictorHistory,
        min_cost_dkk: input.minCostDkk ?? null,
        max_cost_dkk: input.maxCostDkk ?? null,
        min_flight_hours: input.minFlightHours ?? null,
        max_flight_hours: input.maxFlightHours ?? null,
        months: input.months?.length ? input.months : null,
        categories: input.categories?.length ? input.categories : null,
        exclude_country_codes: preferences.includeVisited ? null : VISITED_COUNTRY_CODES,
        match_count: 12,
    };
}

// ── Filter panel ───────────────────────────────────────────────────────
const DURATION_DISTANCES: Record<TravelDuration, DistanceCategory[]> = {
    'Day Trip': ['Short'],
    'Weekend': ['Short', 'Mid'],
    '1-3 Days': ['Short', 'Mid'],
    '3-6 Days': ['Short', 'Mid'],
    '1 Week': ['Short', 'Mid', 'Long'],
    '2 Weeks': ['Mid', 'Long'],
    '15+ Days': ['Long'],
    'No Preference': ['Short', 'Mid', 'Long'],
};

// One-way travel time from Copenhagen in hours: above min, up to max
const DISTANCE_HOURS: Record<DistanceCategory, { min: number; max: number | null }> = {
    Short: { min: 0, max: 3.5 },
    Mid: { min: 3.5, max: 7 },
    Long: { min: 7, max: null },
};

export function preferencesFromFilters(filters: SearchFilters): TravelPreferences {
    return { useVictorHistory: filters.useVisitedCountriesData, includeVisited: filters.includeVisitedCountries };
}

// Turns the panel state into a search request. Returns null when trip length and distance rule each other out.
export function filtersToSearchInput(filters: SearchFilters, semanticText: string): SearchInput | null {
    let distances: DistanceCategory[] = filters.tripDuration ? DURATION_DISTANCES[filters.tripDuration] : ['Short', 'Mid', 'Long'];
    if (filters.distanceCategory) distances = distances.filter((d) => d === filters.distanceCategory);
    if (distances.length === 0) return null;

    // The allowed distances are always neighbours, so they form one range of hours
    const minHours = Math.min(...distances.map((d) => DISTANCE_HOURS[d].min));
    const maxHours = distances.some((d) => DISTANCE_HOURS[d].max === null)
        ? null
        : Math.max(...distances.map((d) => DISTANCE_HOURS[d].max as number));

    const [minBudget, maxBudget] = filters.budgetRange;
    const query = semanticText.trim();

    return {
        ...(query ? { query } : {}),
        ...(minBudget > 0 ? { minCostDkk: minBudget } : {}),
        ...(maxBudget < BUDGET_MAX ? { maxCostDkk: maxBudget } : {}),
        ...(minHours > 0 ? { minFlightHours: minHours } : {}),
        ...(maxHours !== null ? { maxFlightHours: maxHours } : {}),
        ...(filters.season ? { months: SEASON_MONTHS[filters.season] } : {}),
        ...(filters.categories.length > 0 ? { categories: filters.categories } : {}),
    };
}

// Reason shown on a card for a panel search, where no model writes one
export function filterReason(row: DestinationRow, input: SearchInput, preferences: TravelPreferences): string {
    if (input.query && preferences.useVictorHistory) return "Close match to your description and Victor's travel taste.";
    if (input.query) return 'Close match to your description.';

    const matched = row.category.filter((c) => input.categories?.includes(c));
    if (matched.length > 0) return `Matches your categories: ${matched.join(', ')}.`;
    return preferences.useVictorHistory ? "Fits Victor's travel taste based on his travel history." : 'Matches your filters.';
}

// ── Agent conversation ─────────────────────────────────────────────────
const hasInput = (part: AgentMessagePart) => part.state === 'input-available' || part.state === 'output-available';

// The filters of the most recent search, for showing what the agent applied
export function latestSearchInput(messages: AgentMessage[]): SearchInput | null {
    const searches = messages.flatMap((m) => m.parts).filter((p) => p.type === SEARCH_TOOL && hasInput(p));
    return (searches[searches.length - 1]?.input as SearchInput | undefined) ?? null;
}

// Cards to show: the agent's latest picks, or the top of the latest search when it picked nothing
export function cardsFromMessages(messages: AgentMessage[]): DestinationCardData[] {
    const parts = messages.filter((m) => m.role === 'assistant').flatMap((m) => m.parts);

    const byId = new Map<string, DestinationRow>();
    let lastSearch: DestinationRow[] = [];
    let picks: { id: string; reason: string }[] | null = null;

    for (const part of parts) {
        if (part.type === SEARCH_TOOL && part.state === 'output-available') {
            lastSearch = (part.output as { destinations?: DestinationRow[] } | undefined)?.destinations ?? [];
            lastSearch.forEach((row) => byId.set(row.id, row));
            picks = null; // a new search replaces earlier picks
        }
        if (part.type === SHOW_TOOL && hasInput(part)) {
            picks = (part.input as { picks?: { id: string; reason: string }[] } | undefined)?.picks ?? null;
        }
    }

    if (picks) {
        return picks.flatMap((pick) => {
            const destination = byId.get(pick.id);
            return destination ? [{ destination, reason: pick.reason }] : [];
        });
    }

    return lastSearch.slice(0, MAX_FALLBACK_CARDS).map((destination) => ({ destination, reason: '' }));
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// [11, 12, 1, 2] -> "Nov-Feb", [4, 5, 9] -> "Apr-May, Sep"
export function formatMonths(months: number[]): string {
    const set = new Set(months.filter((m) => m >= 1 && m <= 12));
    if (set.size === 0) return '';
    if (set.size === 12) return 'All year';

    const prev = (m: number) => (m === 1 ? 12 : m - 1);
    const next = (m: number) => (m === 12 ? 1 : m + 1);
    const starts = [...set].filter((m) => !set.has(prev(m))).sort((a, b) => a - b);

    return starts
        .map((start) => {
            let end = start;
            while (set.has(next(end))) end = next(end);
            return start === end ? MONTH_NAMES[start - 1] : `${MONTH_NAMES[start - 1]}-${MONTH_NAMES[end - 1]}`;
        })
        .join(', ');
}
