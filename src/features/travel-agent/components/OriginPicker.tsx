import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { originCountries } from '@/features/travel-agent/data/originCountries';
import { findOrigin } from '@/features/travel-agent/lib/travelSearch';

interface OriginPickerProps {
    code: string;
    onChange: (code: string) => void;
}

// The country name inside "Distance from Denmark": click it to travel from somewhere else
export default function OriginPicker({ code, onChange }: OriginPickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="ta-accent inline-flex items-center gap-0.5 border-b border-dashed border-current uppercase tracking-[0.14em]"
                >
                    {findOrigin(code).name}
                    <ChevronDown className="h-3 w-3" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="ta w-64 p-0">
                <Command>
                    <CommandInput placeholder="Travelling from..." className="h-9 text-xs" />
                    <CommandList className="max-h-56">
                        <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">No country found.</CommandEmpty>
                        <CommandGroup>
                            {originCountries.map((country) => (
                                <CommandItem
                                    key={country.code}
                                    value={country.name}
                                    onSelect={() => {
                                        onChange(country.code);
                                        setOpen(false);
                                    }}
                                    className="text-xs"
                                >
                                    {country.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
