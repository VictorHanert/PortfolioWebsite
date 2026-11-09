import { describe, expect, it } from 'vitest';
import { allowedDistances, toMatch } from './travelService';
import { DEFAULT_FILTERS } from '@/types/travel';
import type { SearchDestinationRow, SearchFilters } from '@/types/travel';

const filters = (patch: Partial<SearchFilters>): SearchFilters => ({ ...DEFAULT_FILTERS, ...patch });

const row = (patch: Partial<SearchDestinationRow>): SearchDestinationRow => ({
    id: 'id-1',
    name: 'Rome',
    country: 'Italy',
    country_code: 'ITA',
    description: 'Eternal city',
    category: ['Cultural', 'Historical'],
    budget_level: 2,
    distance_category: 'Short',
    similarity: null,
    category_overlap: 0,
    ...patch,
});

describe('allowedDistances', () => {
    it('returns null when neither duration nor distance is set', () => {
        expect(allowedDistances(filters({}))).toBeNull();
    });

    it('uses the trip duration mapping', () => {
        expect(allowedDistances(filters({ tripDuration: 'Weekend' }))).toEqual(['Short', 'Mid']);
    });

    it('uses the explicit distance when no duration is set', () => {
        expect(allowedDistances(filters({ distanceCategory: 'Long' }))).toEqual(['Long']);
    });

    it('keeps the distance when it fits the duration', () => {
        expect(allowedDistances(filters({ tripDuration: '1 Week', distanceCategory: 'Mid' }))).toEqual(['Mid']);
    });

    it('returns an empty list when distance and duration conflict', () => {
        expect(allowedDistances(filters({ tripDuration: 'Day Trip', distanceCategory: 'Long' }))).toEqual([]);
    });
});

describe('toMatch', () => {
    it('scores by similarity when a vector was used', () => {
        const match = toMatch(row({ similarity: 0.734 }), filters({ useVisitedCountriesData: false }), true);
        expect(match.matchScore).toBe(73);
        expect(match.matchReason).toBe('Close match to your description.');
    });

    it('scores by category overlap without a vector', () => {
        const match = toMatch(
            row({ category_overlap: 1 }),
            filters({ useVisitedCountriesData: false, categories: ['Cultural', 'Beach'] }),
            false
        );
        expect(match.matchScore).toBe(50);
        expect(match.matchReason).toBe('Matches your categories: Cultural.');
    });

    it('has no score when there is nothing to score against', () => {
        const match = toMatch(row({}), filters({ useVisitedCountriesData: false }), false);
        expect(match.matchScore).toBe(0);
        expect(match.matchReason).toBe('Matches your filters.');
    });

    it("mentions Victor's travel taste when the profile is used", () => {
        const match = toMatch(row({ similarity: 0.6 }), filters({ useVisitedCountriesData: true }), false);
        expect(match.matchReason).toBe("Fits Victor's travel taste based on his travel history.");
    });

    it('maps row fields to the card model', () => {
        const match = toMatch(row({ description: null, budget_level: 4 }), filters({}), false);
        expect(match).toMatchObject({ id: 'id-1', name: 'Rome', country: 'Italy', description: '', budgetLevel: 4 });
    });
});
