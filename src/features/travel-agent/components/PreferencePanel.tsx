import { ArrowRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import OriginPicker from '@/features/travel-agent/components/OriginPicker';
import type { SearchFilters, TravelDuration } from '@/features/travel-agent/types';
import { BUDGET_MAX, CATEGORY_OPTIONS, DISTANCE_OPTIONS, SEASON_OPTIONS, TRAVEL_DURATION_OPTIONS } from '@/features/travel-agent/types';

interface PreferencePanelProps {
    filters: SearchFilters;
    onChange: (filters: SearchFilters) => void;
    semanticText: string;
    onSemanticTextChange: (text: string) => void;
    onSearch: () => void;
    isSearching: boolean;
}

const DURATION_LABELS: Partial<Record<TravelDuration, string>> = { 'No Preference': 'Any' };

// Short display names for the season values in SEASON_MONTHS
const SEASON_LABELS: Record<string, string> = {
    'January - March': 'Jan-Mar',
    'March - April': 'Mar-Apr',
    'May - June': 'May-Jun',
    'June - August': 'Jun-Aug',
    'September - November': 'Sep-Nov',
    December: 'Dec',
};

function formatBudget(v: number) {
    if (v >= BUDGET_MAX) return `${BUDGET_MAX.toLocaleString('da-DK')}+ kr.`;
    return v.toLocaleString('da-DK') + ' kr.';
}

const chipClass = (active: boolean) =>
    `h-8 rounded-sm border px-2.5 text-[11px] font-medium transition-colors ${active
        ? 'border-[hsl(var(--ta-accent))] bg-[hsl(var(--ta-accent))] text-background'
        : 'border-border bg-card text-foreground hover:border-foreground'
    }`;

export default function PreferencePanel({
    filters,
    onChange,
    semanticText,
    onSemanticTextChange,
    onSearch,
    isSearching,
}: PreferencePanelProps) {
    const update = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch });

    return (
        <aside className="flex h-auto flex-col border-b border-border bg-card lg:h-full lg:border-b-0 lg:border-r">
            {/* Scrollable filters */}
            <div className="space-y-5 px-4 py-5 sm:px-6 lg:flex-1 lg:overflow-y-auto">
                <h1 className="ta-display text-2xl font-medium leading-tight text-foreground">Set the brief</h1>

                {/* Budget */}
                <section>
                    <div className="mb-2.5 flex items-baseline justify-between gap-3">
                        <label className="ta-label" title="Estimate per person for one week, including flights">Budget, one week</label>
                        <span className="ta-mono shrink-0 text-[11px] text-foreground">
                            {formatBudget(filters.budgetRange[0])} - {formatBudget(filters.budgetRange[1])}
                        </span>
                    </div>
                    <div className="px-1">
                        <Slider
                            min={0}
                            max={BUDGET_MAX}
                            step={1000}
                            value={filters.budgetRange}
                            onValueChange={(value) => update({ budgetRange: [value[0], value[1]] })}
                        />
                    </div>
                </section>

                {/* Duration */}
                <section>
                    <label className="ta-label mb-2 block">Trip length</label>
                    <div className="grid grid-cols-4 gap-1.5">
                        {TRAVEL_DURATION_OPTIONS.map((duration) => {
                            const active = filters.tripDuration === duration;
                            return (
                                <button
                                    type="button"
                                    key={duration}
                                    onClick={() => update({ tripDuration: active ? null : duration })}
                                    aria-pressed={active}
                                    className={chipClass(active)}
                                >
                                    {DURATION_LABELS[duration] ?? duration}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Distance */}
                <section>
                    <div className="ta-label mb-2 flex flex-wrap items-center gap-1.5">
                        <span>Distance from</span>
                        <OriginPicker code={filters.originCode} onChange={(originCode) => update({ originCode })} />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                        {DISTANCE_OPTIONS.map((opt) => {
                            const active = filters.distanceCategory === opt.value;
                            return (
                                <button
                                    type="button"
                                    key={opt.value}
                                    title={opt.hint}
                                    onClick={() => update({ distanceCategory: active ? null : opt.value })}
                                    aria-pressed={active}
                                    className={chipClass(active)}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Category */}
                <section>
                    <label className="ta-label mb-2 block">Kind of trip</label>
                    <div className="flex flex-wrap gap-1.5">
                        {CATEGORY_OPTIONS.map((cat) => {
                            const active = filters.categories.includes(cat);
                            return (
                                <button
                                    type="button"
                                    key={cat}
                                    onClick={() =>
                                        update({
                                            categories: active
                                                ? filters.categories.filter((c) => c !== cat)
                                                : [...filters.categories, cat],
                                        })
                                    }
                                    aria-pressed={active}
                                    className={chipClass(active)}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Season */}
                <section>
                    <label className="ta-label mb-2 block">Season</label>
                    <div className="flex flex-wrap gap-1.5">
                        {SEASON_OPTIONS.map((s) => {
                            const active = filters.season === s;
                            return (
                                <button
                                    type="button"
                                    key={s}
                                    onClick={() => update({ season: active ? null : s })}
                                    title={s}
                                    aria-pressed={active}
                                    className={chipClass(active)}
                                >
                                    {SEASON_LABELS[s] ?? s}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Extra prompt */}
                <section>
                    <label className="ta-label mb-2 block">Anything else</label>
                    <Textarea
                        value={semanticText}
                        onChange={(e) => onSemanticTextChange(e.target.value)}
                        placeholder="Great seafood, old towns, somewhere walkable..."
                        className="min-h-[56px] resize-none bg-background text-xs"
                    />
                </section>

                {/* Victor's travel history */}
                <section className="space-y-2.5 border-t border-dashed border-border pt-4">
                    <div className="flex items-center justify-between gap-3">
                        <label
                            htmlFor="panel-use-history"
                            className="text-xs text-foreground"
                            title="Results are tuned to Victor's own travel taste, based on the trips on this site."
                        >
                            Tune results to Victor's travel taste
                        </label>
                        <Switch
                            id="panel-use-history"
                            checked={filters.useVisitedCountriesData}
                            onCheckedChange={(checked) => update({ useVisitedCountriesData: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <label htmlFor="panel-include-visited" className="text-xs text-foreground">
                            Include countries Victor has already visited
                        </label>
                        <Switch
                            id="panel-include-visited"
                            checked={filters.includeVisitedCountries}
                            onCheckedChange={(checked) => update({ includeVisitedCountries: checked })}
                        />
                    </div>
                </section>
            </div>

            {/* Action */}
            <div className="border-t border-border p-4 sm:px-6">
                <button
                    type="button"
                    onClick={onSearch}
                    disabled={isSearching}
                    className="ta-mono flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-foreground text-xs uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                    {isSearching ? 'Searching...' : 'Find my destination'}
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </aside>
    );
}
