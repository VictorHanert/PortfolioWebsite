import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Plane, MapPin, Palmtree, Landmark, Dribbble, Leaf, Sun, CloudRain, Snowflake, Flower2, Clock3 } from 'lucide-react';
import type { SearchFilters, TravelDuration } from '@/types/travel';
import {
  DISTANCE_OPTIONS,
  CATEGORY_OPTIONS,
  SEASON_OPTIONS,
  TRAVEL_DURATION_OPTIONS,
} from '@/types/travel';

interface PreferencePanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  semanticText: string;
  onSemanticTextChange: (text: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Trending: <MapPin className="h-3.5 w-3.5" />,
  Football: <Dribbble className="h-3.5 w-3.5" />,
  'New Destination': <Plane className="h-3.5 w-3.5" />,
  Relax: <Palmtree className="h-3.5 w-3.5" />,
  Culture: <Landmark className="h-3.5 w-3.5" />,
  Beach: <Sun className="h-3.5 w-3.5" />,
  Shopping: <MapPin className="h-3.5 w-3.5" />,
  Nature: <Leaf className="h-3.5 w-3.5" />,
  Capital: <Landmark className="h-3.5 w-3.5" />,
  Ski: <Snowflake className="h-3.5 w-3.5" />,
  'Warm Weather': <Sun className="h-3.5 w-3.5" />,
};

const SEASON_ICONS: Record<string, React.ReactNode> = {
  'January - March': <Snowflake className="h-3.5 w-3.5" />,
  'March - April': <Flower2 className="h-3.5 w-3.5" />,
  'May - June': <Leaf className="h-3.5 w-3.5" />,
  'June - August': <Sun className="h-3.5 w-3.5" />,
  'September - November': <CloudRain className="h-3.5 w-3.5" />,
  December: <Snowflake className="h-3.5 w-3.5" />,
};

function formatBudget(v: number) {
  if (v >= 20000) return '20.000+ kr.';
  return v.toLocaleString('da-DK') + ' kr.';
}

export default function PreferencePanel({
  filters,
  onChange,
  semanticText,
  onSemanticTextChange,
  onSearch,
  isSearching,
}: PreferencePanelProps) {
  const update = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch });
  const yesNoClassName =
    'h-10 justify-center rounded-lg border border-border px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground';

  return (
    <aside className="flex h-auto flex-col border-b border-border bg-card lg:h-full lg:border-b-0 lg:border-r">
      {/* Header */}
      <div className="border-b border-border px-4 pb-4 pt-6 sm:px-6 lg:pt-8">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Next Destination</h1>
        <p className="text-xs text-muted-foreground">Find your next travel destination based on your preferences.</p>
      </div>

      {/* Scrollable filters */}
      <div className="space-y-8 px-4 py-5 sm:px-6 lg:flex-1 lg:overflow-y-auto lg:py-6">

        {/* Budget */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">
            Budget (DKK)
          </label>
          <div className="px-1">
            <Slider
              min={0}
              max={20000}
              step={500}
              value={filters.budgetRange}
              onValueChange={(value) => update({ budgetRange: [value[0], value[1]] })}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{formatBudget(filters.budgetRange[0])}</span>
            <span className="font-medium text-foreground">{formatBudget(filters.budgetRange[1])}</span>
          </div>
        </section>

        {/* Duration */}
        <section>
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Trip Length
          </label>
          <ToggleGroup
            type="single"
            value={filters.tripDuration ?? ''}
            onValueChange={(v) => update({ tripDuration: (v || null) as TravelDuration | null })}
            className="grid grid-cols-2 gap-2"
          >
            {TRAVEL_DURATION_OPTIONS.map((duration) => (
              <ToggleGroupItem
                key={duration}
                value={duration}
                className="h-10 justify-start gap-2 rounded-lg border border-border px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <Clock3 className="h-3.5 w-3.5" />
                {duration}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>

        {/* Distance */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">
            Distance from Denmark
          </label>
          <ToggleGroup
            type="single"
            value={filters.distanceCategory ?? ''}
            onValueChange={(v) => update({ distanceCategory: (v || null) as 'Short' | 'Mid' | 'Long' | null })}
            className="flex flex-col gap-1.5 w-full"
          >
            {DISTANCE_OPTIONS.map((opt) => (
              <ToggleGroupItem
                key={opt.value}
                value={opt.value}
                className="w-full justify-start gap-2 px-3 py-2 text-xs rounded-lg border border-border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <MapPin className="h-3.5 w-3.5" />
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>

        {/* Category */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">
            Travel Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => {
              const active = filters.categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() =>
                    update({
                      categories: active
                        ? filters.categories.filter((c) => c !== cat)
                        : [...filters.categories, cat],
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {CATEGORY_ICONS[cat]}
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Season */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">
            Season
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {SEASON_OPTIONS.map((s) => {
              const active = filters.season === s;
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => update({ season: active ? null : s })}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {SEASON_ICONS[s]}
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        {/* Extra prompt */}
        <section>
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Extra Prompt (Optional)
          </label>
          <Textarea
            value={semanticText}
            onChange={(e) => onSemanticTextChange(e.target.value)}
            placeholder="Add one extra instruction for this search..."
            className="min-h-[88px] resize-none bg-muted/40 text-sm"
          />
        </section>

        {/* Use visitedCountries data */}
        <section>
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Use visitedCountries data to recommend next travel?
          </label>
          <ToggleGroup
            type="single"
            value={filters.useVisitedCountriesData ? 'yes' : 'no'}
            onValueChange={(v) => {
              if (v === 'yes' || v === 'no') {
                update({ useVisitedCountriesData: v === 'yes' });
              }
            }}
            className="grid grid-cols-2 gap-2"
          >
            <ToggleGroupItem value="yes" className={yesNoClassName}>
              Yes
            </ToggleGroupItem>
            <ToggleGroupItem value="no" className={yesNoClassName}>
              No
            </ToggleGroupItem>
          </ToggleGroup>
        </section>

        {/* Include already visited countries */}
        <section>
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recommend travels to already visited countries?
          </label>
          <ToggleGroup
            type="single"
            value={filters.includeVisitedCountries ? 'yes' : 'no'}
            onValueChange={(v) => {
              if (v === 'yes' || v === 'no') {
                update({ includeVisitedCountries: v === 'yes' });
              }
            }}
            className="grid grid-cols-2 gap-2"
          >
            <ToggleGroupItem value="yes" className={yesNoClassName}>
              Yes
            </ToggleGroupItem>
            <ToggleGroupItem value="no" className={yesNoClassName}>
              No
            </ToggleGroupItem>
          </ToggleGroup>
        </section>
      </div>

      {/* Action */}
      <div className="border-t border-border p-4 sm:p-6">
        <Button
          onClick={onSearch}
          disabled={isSearching}
          className="w-full h-11 text-sm font-semibold"
        >
          {isSearching ? 'Searching...' : 'Find my destination'}
          <Plane className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
