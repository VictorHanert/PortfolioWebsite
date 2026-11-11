// "My favorites": destinations saved in this browser. No account, nothing leaves the device.
import { useSyncExternalStore } from 'react';
import type { DestinationRow } from '../types';

const STORAGE_KEY = 'travel-agent-favorites';
const listeners = new Set<() => void>();
let cache: DestinationRow[] | null = null;

function read(): DestinationRow[] {
    if (cache) return cache;
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        cache = Array.isArray(stored) ? stored : [];
    } catch {
        cache = [];
    }
    return cache;
}

function write(next: DestinationRow[]) {
    cache = next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function toggleFavorite(favorites: DestinationRow[], destination: DestinationRow): DestinationRow[] {
    return favorites.some((f) => f.id === destination.id)
        ? favorites.filter((f) => f.id !== destination.id)
        : [destination, ...favorites];
}

export function useFavorites() {
    const favorites = useSyncExternalStore(subscribe, read);
    return {
        favorites,
        isFavorite: (id: string) => favorites.some((f) => f.id === id),
        toggle: (destination: DestinationRow) => write(toggleFavorite(favorites, destination)),
    };
}
