import { describe, expect, it } from 'vitest';
import {
    buildSearchArgs,
    cardsFromMessages,
    filterReason,
    filtersToSearchInput,
    formatMonths,
    latestSearchInput,
    SEARCH_TOOL,
    SHOW_TOOL,
} from './travelSearch';
import type { AgentMessage } from './travelSearch';
import { DEFAULT_FILTERS } from '@/types/travel';
import type { DestinationRow, SearchFilters } from '@/types/travel';

const row = (id: string, name: string): DestinationRow => ({
    id,
    name,
    country: 'Italy',
    country_code: 'ITA',
    description: null,
    category: [],
    best_months: null,
    avg_cost_dkk: null,
    flight_hours: null,
    image_url: null,
    image_credit: null,
    image_credit_url: null,
    image_page_url: null,
    similarity: null,
    category_overlap: 0,
});

const search = (input: object, destinations: DestinationRow[]) => ({
    type: SEARCH_TOOL,
    state: 'output-available',
    input,
    output: { destinations },
});

const show = (picks: { id: string; reason: string }[]) => ({ type: SHOW_TOOL, state: 'input-available', input: { picks } });

const assistant = (...parts: AgentMessage['parts']): AgentMessage => ({ role: 'assistant', parts });

describe('buildSearchArgs', () => {
    it('excludes visited countries unless they are included', () => {
        const excluded = buildSearchArgs({}, { useVictorHistory: true, includeVisited: false }, null);
        expect(excluded.exclude_country_codes).toContain('ITA');
        expect(excluded.use_profile).toBe(true);

        const included = buildSearchArgs({}, { useVictorHistory: false, includeVisited: true }, null);
        expect(included.exclude_country_codes).toBeNull();
        expect(included.use_profile).toBe(false);
    });

    it('maps tool input to RPC arguments and treats empty lists as no filter', () => {
        const args = buildSearchArgs(
            { maxCostDkk: 8000, maxFlightHours: 4, months: [3], categories: [] },
            { useVictorHistory: false, includeVisited: true },
            [0.1, 0.2]
        );
        expect(args).toMatchObject({
            query_embedding: '[0.1,0.2]',
            max_cost_dkk: 8000,
            max_flight_hours: 4,
            months: [3],
            categories: null,
        });
    });
});

describe('filtersToSearchInput', () => {
    const filters = (patch: Partial<SearchFilters>): SearchFilters => ({ ...DEFAULT_FILTERS, ...patch });

    it('sends no filters for the default panel state', () => {
        expect(filtersToSearchInput(filters({}), '  ')).toEqual({});
    });

    it('maps budget, season, categories and text', () => {
        const input = filtersToSearchInput(
            filters({ budgetRange: [5000, 12000], season: 'June - August', categories: ['Beach'] }),
            ' great seafood '
        );
        expect(input).toEqual({ query: 'great seafood', minCostDkk: 5000, maxCostDkk: 12000, months: [6, 7, 8], categories: ['Beach'] });
    });

    it('turns trip length and distance into a range of travel hours', () => {
        expect(filtersToSearchInput(filters({ tripDuration: 'Weekend' }), '')).toEqual({ maxFlightHours: 7 });
        expect(filtersToSearchInput(filters({ distanceCategory: 'Long' }), '')).toEqual({ minFlightHours: 7 });
        expect(filtersToSearchInput(filters({ tripDuration: '2 Weeks', distanceCategory: 'Mid' }), '')).toEqual({
            minFlightHours: 3.5,
            maxFlightHours: 7,
        });
    });

    it('returns null when trip length and distance rule each other out', () => {
        expect(filtersToSearchInput(filters({ tripDuration: 'Day Trip', distanceCategory: 'Long' }), '')).toBeNull();
    });
});

describe('filterReason', () => {
    const history = { useVictorHistory: true, includeVisited: false };
    const noHistory = { useVictorHistory: false, includeVisited: false };

    it('prefers the description, then categories, then taste', () => {
        const rome = { ...row('a', 'Rome'), category: ['Cultural', 'Historical'] };
        expect(filterReason(rome, { query: 'food' }, noHistory)).toBe('Close match to your description.');
        expect(filterReason(rome, { categories: ['Cultural', 'Beach'] }, history)).toBe('Matches your categories: Cultural.');
        expect(filterReason(rome, {}, history)).toBe("Fits Victor's travel taste based on his travel history.");
        expect(filterReason(rome, {}, noHistory)).toBe('Matches your filters.');
    });
});

describe('cardsFromMessages', () => {
    it('shows the picks of the agent with their reasons, in pick order', () => {
        const cards = cardsFromMessages([
            assistant(search({}, [row('a', 'Rome'), row('b', 'Bari')]), show([{ id: 'b', reason: 'Great food' }])),
        ]);
        expect(cards.map((c) => [c.destination.name, c.reason])).toEqual([['Bari', 'Great food']]);
    });

    it('drops picks with ids the search never returned', () => {
        const cards = cardsFromMessages([assistant(search({}, [row('a', 'Rome')]), show([{ id: 'x', reason: 'Made up' }]))]);
        expect(cards).toEqual([]);
    });

    it('falls back to the latest search when nothing was picked after it', () => {
        const cards = cardsFromMessages([
            assistant(search({}, [row('a', 'Rome')]), show([{ id: 'a', reason: 'First' }])),
            assistant(search({}, [row('b', 'Bari')])),
        ]);
        expect(cards.map((c) => [c.destination.name, c.reason])).toEqual([['Bari', '']]);
    });

    it('returns nothing before any search', () => {
        expect(cardsFromMessages([{ role: 'user', parts: [{ type: 'text' }] }])).toEqual([]);
    });
});

describe('latestSearchInput', () => {
    it('returns the input of the most recent search', () => {
        const messages = [assistant(search({ maxCostDkk: 9000 }, [])), assistant(search({ maxCostDkk: 6000 }, []))];
        expect(latestSearchInput(messages)).toEqual({ maxCostDkk: 6000 });
        expect(latestSearchInput([])).toBeNull();
    });
});

describe('formatMonths', () => {
    it('formats ranges, including ranges across new year', () => {
        expect(formatMonths([6, 7, 8, 9])).toBe('Jun-Sep');
        expect(formatMonths([11, 12, 1, 2])).toBe('Nov-Feb');
        expect(formatMonths([4, 5, 9])).toBe('Apr-May, Sep');
        expect(formatMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])).toBe('All year');
        expect(formatMonths([])).toBe('');
    });
});
