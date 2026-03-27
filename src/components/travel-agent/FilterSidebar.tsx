import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Plane, MapPin, Palmtree, Landmark, Dribbble, Leaf, Sun, CloudRain, Snowflake, Flower2 } from 'lucide-react';
import type { SearchFilters } from '@/types/travel';
import {
  DISTANCE_OPTIONS,
  CATEGORY_OPTIONS,
  SEASON_OPTIONS,
} from '@/types/travel';

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
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

export default function FilterSidebar({ filters, onChange, onSearch, isSearching }: FilterSidebarProps) {
  const update = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch });

  return (
    <aside className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Plane className="h-5 w-5 text-foreground" />
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Next Destination
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">Find your next travel destination based on your preferences.</p>
      </div>

      {/* Scrollable filters */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
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

        {/* Distance */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">
            Distance from Denmark
          </label>
          <ToggleGroup
            type="single"
            value={filters.distanceCategory ?? ''}
            onValueChange={(v) => update({ distanceCategory: (v || null) as any })}
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
      </div>

      {/* Action */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={onSearch}
          disabled={isSearching}
          className="w-full h-11 text-sm font-semibold"
        >
          {isSearching ? 'Searching...' : 'Find my destination'}
        </Button>
      </div>
    </aside>
  );
}
