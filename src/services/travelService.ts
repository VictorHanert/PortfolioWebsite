import type { SearchFilters, DestinationMatch, DistanceCategory, SearchDestinationRow, TravelDuration } from '@/types/travel';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { generateEmbedding } from './embedService';
import { visitedCountries } from '@/data/visitedCountries';

const VISITED_COUNTRY_CODES = visitedCountries.map((country) => country.id);
const MIN_SEMANTIC_TEXT_LENGTH = 4;
const MATCH_COUNT = 9;

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

// Combines trip duration and the explicit distance choice. null means no distance restriction.
function allowedDistances(filters: SearchFilters): DistanceCategory[] | null {
    const fromDuration = filters.tripDuration ? DURATION_DISTANCES[filters.tripDuration] : null;
    if (filters.distanceCategory) {
        return !fromDuration || fromDuration.includes(filters.distanceCategory) ? [filters.distanceCategory] : [];
    }
    return fromDuration;
}

// ── Demo data (shown only when Supabase is not connected) ──────────────
const DEMO_RESULTS: DestinationMatch[] = [
    {
        id: 'demo-1',
        name: 'Barcelona',
        country: 'Spain',
        description: 'Exciting city with world-class football, Gaudí architecture, and vibrant culture.',
        similarity: null,
        matchScore: 96,
        budgetLevel: 2,
        matchReason: 'Demo result: football and culture, with Camp Nou and Gaudí close by.',
        categories: ['Football', 'Cultural'],
    },
    {
        id: 'demo-2',
        name: 'Lisbon',
        country: 'Portugal',
        description: 'Historic city with beautiful coastal views, vibrant culture, and delicious cuisine.',
        similarity: null,
        matchScore: 91,
        budgetLevel: 2,
        matchReason: 'Demo result: history and food on a moderate budget.',
        categories: ['Cultural', 'Relax'],
    },
    {
        id: 'demo-3',
        name: 'Reykjavik',
        country: 'Iceland',
        description: 'Wild nature, warm springs, and the northern lights close to Denmark.',
        similarity: null,
        matchScore: 87,
        budgetLevel: 3,
        matchReason: 'Demo result: a short flight from Denmark with unique nature.',
        categories: ['Nature', 'Relax'],
    },
];

function buildMatchReason(row: SearchDestinationRow, filters: SearchFilters, hasQuery: boolean): string {
    if (hasQuery && filters.useVisitedCountriesData) return "Close match to your description and Victor's travel taste.";
    if (hasQuery) return 'Close match to your description.';
    if (filters.useVisitedCountriesData) return "Fits Victor's travel taste based on his travel history.";

    const matched = row.category.filter((c) => filters.categories.includes(c));
    return matched.length > 0 ? `Matches your categories: ${matched.join(', ')}.` : 'Matches your filters.';
}

function toMatch(row: SearchDestinationRow, filters: SearchFilters, hasQuery: boolean): DestinationMatch {
    const matchScore = row.similarity !== null
        ? Math.round(row.similarity * 100)
        : filters.categories.length > 0
            ? Math.round((row.category_overlap / filters.categories.length) * 100)
            : 0;

    return {
        id: row.id,
        name: row.name,
        country: row.country,
        description: row.description ?? '',
        similarity: row.similarity,
        matchScore,
        budgetLevel: row.budget_level,
        matchReason: buildMatchReason(row, filters, hasQuery),
        categories: row.category,
    };
}

export type SearchProgress = 'embedding' | 'searching';

// ── Main entry point. Throws on failure so the UI can show an error. ───
export async function findDestinations(
    filters: SearchFilters,
    semanticText: string,
    onProgress?: (step: SearchProgress) => void
): Promise<DestinationMatch[]> {
    if (!isSupabaseConfigured) {
        return DEMO_RESULTS;
    }

    const distances = allowedDistances(filters);
    if (distances && distances.length === 0) return [];

    const text = semanticText.trim();
    const hasQuery = text.length >= MIN_SEMANTIC_TEXT_LENGTH;

    let queryEmbedding: number[] | null = null;
    if (hasQuery) {
        onProgress?.('embedding');
        queryEmbedding = await generateEmbedding(text);
    }

    onProgress?.('searching');
    const client = await getSupabaseClient();
    if (!client) throw new Error('Supabase client is not available');

    const { data, error } = await client.rpc('search_destinations', {
        query_embedding: queryEmbedding ? JSON.stringify(queryEmbedding) : null,
        use_profile: filters.useVisitedCountriesData,
        min_budget_level: filters.budgetLevels[0],
        max_budget_level: filters.budgetLevels[1],
        distances,
        categories: filters.categories.length > 0 ? filters.categories : null,
        exclude_country_codes: filters.includeVisitedCountries ? null : VISITED_COUNTRY_CODES,
        match_count: MATCH_COUNT,
    });

    if (error) throw new Error(`Search failed: ${error.message}`);

    return ((data ?? []) as SearchDestinationRow[]).map((row) => toMatch(row, filters, hasQuery));
}
