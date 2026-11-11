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

// One search request, built by the filter panel or by the agent's searchDestinations tool
export interface SearchInput {
    query?: string;
    minCostDkk?: number;
    maxCostDkk?: number;
    minFlightHours?: number;
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

// ── Filter panel state ─────────────────────────────────────────────────
export type DistanceCategory = 'Short' | 'Mid' | 'Long';

export type TravelDuration =
    | 'Day Trip'
    | 'Weekend'
    | '1-3 Days'
    | '3-6 Days'
    | '1 Week'
    | '2 Weeks'
    | '15+ Days'
    | 'No Preference';

export interface SearchFilters {
    budgetRange: [number, number];
    distanceCategory: DistanceCategory | null;
    tripDuration: TravelDuration | null;
    useVisitedCountriesData: boolean;
    includeVisitedCountries: boolean;
    categories: string[];
    season: string | null;
}

// The top of the budget slider means "no upper limit"
export const BUDGET_MAX = 40000;

export const DISTANCE_OPTIONS = [
    { value: 'Short', label: 'Short Trip' },
    { value: 'Mid', label: 'Semi-long Destination' },
    { value: 'Long', label: 'Long Flight' },
] as const;

export const SEASON_MONTHS: Record<string, number[]> = {
    'January - March': [1, 2, 3],
    'March - April': [3, 4],
    'May - June': [5, 6],
    'June - August': [6, 7, 8],
    'September - November': [9, 10, 11],
    December: [12],
};

export const SEASON_OPTIONS = Object.keys(SEASON_MONTHS);

export const TRAVEL_DURATION_OPTIONS: ReadonlyArray<TravelDuration> = [
    'Day Trip',
    'Weekend',
    '1-3 Days',
    '3-6 Days',
    '1 Week',
    '2 Weeks',
    '15+ Days',
    'No Preference',
];

export const DEFAULT_FILTERS: SearchFilters = {
    budgetRange: [0, BUDGET_MAX],
    distanceCategory: null,
    tripDuration: null,
    useVisitedCountriesData: true,
    includeVisitedCountries: false,
    categories: [],
    season: null,
};
