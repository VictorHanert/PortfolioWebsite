// Must match CATEGORIES in scripts/generate-destinations.mjs
export const CATEGORY_OPTIONS = [
    'Beach',
    'Warm Weather',
    'Relax',
    'Quiet',
    'Nature',
    'Cultural',
    'Historical',
    'Shopping',
    'Capital',
    'Football',
    'Nightlife',
    'Ski',
    'Cold Weather',
    'Romantic',
    'Trending',
    'Hidden Gem',
] as const;

// Row shape returned by the search_destinations RPC in Supabase
export interface DestinationRow {
    id: string;
    name: string;
    country: string;
    country_code: string | null;
    description: string | null;
    category: string[];
    best_months: number[] | null;
    avg_cost_dkk: number | null; // per person, one week, including flights from Copenhagen
    flight_hours: number | null;
    image_url: string | null;
    image_credit: string | null;
    image_credit_url: string | null;
    image_page_url: string | null;
    similarity: number | null;
    category_overlap: number;
}

// Input of the agent's searchDestinations tool
export interface SearchInput {
    query?: string;
    maxCostDkk?: number;
    maxFlightHours?: number;
    months?: number[];
    categories?: string[];
}

// Toggles the visitor controls. The server applies them, the model cannot change them.
export interface TravelPreferences {
    useVictorHistory: boolean;
    includeVisited: boolean;
}

export interface DestinationCardData {
    destination: DestinationRow;
    reason: string;
}
