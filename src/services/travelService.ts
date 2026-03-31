import type { SearchFilters, DestinationMatch, TravelDestination } from '@/types/travel';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { generateEmbedding } from './embedService';
import { visitedCountries } from '@/data/visitedCountries';

const VISITED_COUNTRY_NAMES = new Set(visitedCountries.map((country) => country.name.trim().toLowerCase()));

function isVisitedCountry(destination: Pick<TravelDestination, 'country'> | Pick<DestinationMatch, 'country'>) {
    return VISITED_COUNTRY_NAMES.has(destination.country.trim().toLowerCase());
}

function durationAllowsDistance(filters: SearchFilters, distance: TravelDestination['distance_category']) {
    if (!filters.tripDuration) return true;

    const durationDistanceMap: Record<NonNullable<SearchFilters['tripDuration']>, Array<TravelDestination['distance_category']>> = {
        'Day Trip': ['Short'],
        'Weekend': ['Short', 'Mid'],
        '1-3 Days': ['Short', 'Mid'],
        '3-6 Days': ['Short', 'Mid'],
        '1 Week': ['Short', 'Mid', 'Long'],
        '2 Weeks': ['Mid', 'Long'],
        '15+ Days': ['Long'],
        'No Preference': ['Short', 'Mid', 'Long'],
    };

    return durationDistanceMap[filters.tripDuration].includes(distance);
}

// ── Demo data (shown only when Supabase is not connected) ──────────────
const DEMO_RESULTS: DestinationMatch[] = [
    {
        id: 'demo-1',
        name: 'Barcelona',
        country: 'Spain',
        description: 'Exciting city with world-class football, Gaudí architecture, and vibrant culture.',
        similarity: 0.94,
        matchScore: 96,
        estimatedCostDKK: 8500,
        matchReason: 'Perfect match for your interest in football and culture — Camp Nou and Gaudí’s masterpieces await.',
        categories: ['Football', 'Culture'],
    },
    {
        id: 'demo-2',
        name: 'Lissabon',
        country: 'Portugal',
        description: 'Historic city with beautiful coastal views, vibrant culture, and delicious cuisine.',
        similarity: 0.89,
        matchScore: 91,
        estimatedCostDKK: 7200,
        matchReason: 'Perfect match for your budget and passion for history and gastronomy.',
        categories: ['Culture', 'Relax'],
    },
    {
        id: 'demo-3',
        name: 'Reykjavik',
        country: 'Iceland',
        description: 'Wild nature, warm springs, and the northern lights close to Denmark.',
        similarity: 0.85,
        matchScore: 87,
        estimatedCostDKK: 12000,
        matchReason: 'Short flight from Denmark with unique nature — perfect for a nature trip.',
        categories: ['Nature', 'Relax'],
    },
];

// ── Structured filter query ────────────────────────────────────────────
export async function fetchByFilters(
    filters: SearchFilters
): Promise<TravelDestination[]> {
    const client = await getSupabaseClient();
    if (!client) return [];

    let query = client.from('travel_destinations').select('*');

    if (filters.distanceCategory) {
        query = query.eq('distance_category', filters.distanceCategory);
    }

    if (filters.categories.length > 0) {
        query = query.overlaps('category', filters.categories);
    }

    // Budget level mapping: [0-10k]=1, [10-20k]=2, [20-35k]=3, [35k+]=4
    const maxBudget = filters.budgetRange[1];
    const budgetLevel =
        maxBudget <= 10000 ? 1 : maxBudget <= 20000 ? 2 : maxBudget <= 35000 ? 3 : 4;
    query = query.lte('budget_level', budgetLevel);

    const { data, error } = await query;
    if (error) {
        console.error('Filter query error:', error);
        return [];
    }
    return data ?? [];
}

// ── Vector / semantic search via RPC ───────────────────────────────────
export async function semanticSearch(
    queryEmbedding: number[],
    threshold = 0.7,
    count = 5
): Promise<DestinationMatch[]> {
    const client = await getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client.rpc('match_destinations', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: count,
    });

    if (error) {
        if (error.code === 'PGRST202') {
            console.warn(
                'Semantic search RPC function missing. Create public.match_destinations in Supabase SQL editor to enable vector search.'
            );
            return [];
        }
        console.error('Semantic search error:', error);
        return [];
    }

    return (data ?? []).map((d: { id: string; name: string; country: string; description: string | null; similarity: number }) => ({
        id: d.id,
        name: d.name,
        country: d.country,
        description: d.description ?? '',
        similarity: d.similarity,
        matchScore: Math.round(d.similarity * 100),
        estimatedCostDKK: 0, // enrich later
        matchReason: '',
        categories: [],
    }));
}

// ── Combined search (the main entry point) ─────────────────────────────
export async function findDestinations(
    filters: SearchFilters,
    semanticText: string
): Promise<DestinationMatch[]> {
    if (!isSupabaseConfigured) {
        const durationTag = filters.tripDuration ? ` Best for: ${filters.tripDuration}.` : '';
        const filteredDemoResults = filters.includeVisitedCountries
            ? DEMO_RESULTS
            : DEMO_RESULTS.filter((result) => !isVisitedCountry(result));

        // In demo mode we always return suggestions, even if strict filters remove all samples.
        const baseDemoResults = filteredDemoResults.length > 0 ? filteredDemoResults : DEMO_RESULTS;
        const fallbackTag = filteredDemoResults.length === 0
            ? ' Demo fallback: showing sample destinations.'
            : '';

        return baseDemoResults.map((result) => ({
            ...result,
            matchReason: `${result.matchReason}${durationTag}${filters.useVisitedCountriesData ? ' Uses your travel history patterns.' : ''}${fallbackTag}`,
            matchScore: filters.useVisitedCountriesData && isVisitedCountry(result)
                ? Math.min(result.matchScore + 6, 100)
                : result.matchScore,
        }));
    }

    try {
        // 1. Få fat i strukturerede resultater baseret på filtre (Budget, Distance, Category)
        const structuredResults = (await fetchByFilters(filters))
            .filter((d) => durationAllowsDistance(filters, d.distance_category))
            .filter((d) => filters.includeVisitedCountries || !isVisitedCountry(d));

        // 2. Hvis der er indtastet tekst, så kør semantisk søgning (RAG)
        let semanticMatches: DestinationMatch[] = [];
        if (semanticText.trim().length > 3) {
            // Generer embedding direkte via Gemini
            const embedding = await generateEmbedding(semanticText);

            // Søg i Supabase via din RPC funktion
            semanticMatches = await semanticSearch(embedding, 0.4, 10);
        }

        // 3. Kombiner og berig resultaterne
        // Vi tager de strukturerede resultater og tjekker om de også findes i de semantiske matches
        const finalResults: DestinationMatch[] = structuredResults.map((d) => {
            const semanticMatch = semanticMatches.find((sm) => sm.id === d.id);
            
            // Hvis det er et semantisk match, brug den faktiske score, ellers sæt en basis score
            const matchScore = semanticMatch ? semanticMatch.matchScore : 80;
            
            return {
                id: d.id,
                name: d.name,
                country: d.country,
                description: d.description ?? '',
                similarity: semanticMatch ? semanticMatch.similarity : 0,
                matchScore: matchScore,
                estimatedCostDKK: d.budget_level * 5000, // Simpelt estimat
                matchReason: semanticMatch 
                    ? `Dette match foreslås fordi det minder om din beskrivelse: "${semanticText}"`
                    : `Matcher dine valgte filtre for ${d.category.join(', ')}.`,
                categories: d.category,
            };
        });

        // Sortér efter højeste match score
        return finalResults.sort((a, b) => b.matchScore - a.matchScore);

    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}
