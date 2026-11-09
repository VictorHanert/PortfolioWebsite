export type DistanceCategory = 'Short' | 'Mid' | 'Long';

// Row shape returned by the search_destinations RPC in Supabase
export interface SearchDestinationRow {
    id: string;
    name: string;
    country: string;
    country_code: string | null;
    description: string | null;
    category: string[];
    budget_level: number; // 1-4
    distance_category: DistanceCategory;
    similarity: number | null;
    category_overlap: number;
}

export interface DestinationMatch {
    id: string;
    name: string;
    country: string;
    description: string;
    similarity: number | null;
    matchScore: number;
    budgetLevel: number;
    matchReason: string;
    categories: string[];
}

export interface SearchFilters {
    budgetLevels: [number, number]; // 1-4, see BUDGET_LEVELS
    distanceCategory: DistanceCategory | null;
    tripDuration: TravelDuration | null;
    useVisitedCountriesData: boolean;
    includeVisitedCountries: boolean;
    categories: string[];
}

export type TravelDuration =
    | 'Day Trip'
    | 'Weekend'
    | '1-3 Days'
    | '3-6 Days'
    | '1 Week'
    | '2 Weeks'
    | '15+ Days'
    | 'No Preference';

export interface ChatMessage {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
    results?: DestinationMatch[];
}

export interface AnalysisStep {
    label: string;
    status: 'pending' | 'active' | 'done';
}

// Matches budget_level in Supabase
export const BUDGET_LEVELS: Record<number, string> = {
    1: 'Under 5.000 kr.',
    2: '5.000 - 10.000 kr.',
    3: '10.000 - 20.000 kr.',
    4: '20.000+ kr.',
};

export const DISTANCE_OPTIONS = [
    { value: 'Short', label: 'Short Trip' },
    { value: 'Mid', label: 'Semi-long Destination' },
    { value: 'Long', label: 'Long Flight' },
] as const;

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
    budgetLevels: [1, 4],
    distanceCategory: null,
    tripDuration: null,
    useVisitedCountriesData: true,
    includeVisitedCountries: false,
    categories: [],
};
