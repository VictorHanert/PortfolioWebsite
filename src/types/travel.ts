export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  description: string | null;
  category: string[];
  budget_level: number; // 1-4
  distance_category: 'Short' | 'Mid' | 'Long';
  embedding?: number[];
}

export interface DestinationMatch {
  id: string;
  name: string;
  country: string;
  description: string;
  similarity: number;
  matchScore: number;
  estimatedCostDKK: number;
  matchReason: string;
  categories: string[];
}

export interface SearchFilters {
  budgetRange: [number, number];
  distanceCategory: 'Short' | 'Mid' | 'Long' | null;
  tripDuration: TravelDuration | null;
  useVisitedCountriesData: boolean;
  includeVisitedCountries: boolean;
  categories: string[];
  season: string | null;
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

export const BUDGET_LABELS: Record<number, string> = {
  0: '0 kr.',
  5000: '5.000 kr.',
  10000: '10.000 kr.',
  15000: '15.000 kr.',
  20000: '20.000+ kr.',
};

export const DISTANCE_OPTIONS = [
  { value: 'Short', label: 'Short Trip' },
  { value: 'Mid', label: 'Semi-long Destination' },
  { value: 'Long', label: 'Long Flight' },
] as const;

export const CATEGORY_OPTIONS = ['Trending', 'Football', 'New Destination', 'Relax', 'Culture', 'Beach', 'Shopping', 'Nature', 'Capital', 'Ski', 'Warm Weather'] as const;

export const SEASON_OPTIONS = ['January - March', 'March - April', 'May - June', 'June - August', 'September - November', 'December'] as const;

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
  budgetRange: [0, 20000],
  distanceCategory: null,
  tripDuration: null,
  useVisitedCountriesData: true,
  includeVisitedCountries: false,
  categories: [],
  season: null,
};
