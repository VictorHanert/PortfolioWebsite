import { NavLink } from 'react-router-dom';
import { useFavorites } from '@/features/travel-agent/lib/favorites';

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `ta-mono -mb-px flex h-14 items-center border-b-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${isActive
        ? 'border-[hsl(var(--ta-accent))] text-foreground'
        : 'border-transparent text-muted-foreground hover:text-foreground'
    }`;

export default function TravelNavbar() {
    const { favorites } = useFavorites();

    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b border-foreground/80 bg-card">
            <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
                <NavLink to="/travel-agent" end className="flex items-center gap-2.5 text-foreground">
                    {/* Survey mark: a meridian and a parallel inside a circle */}
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="9.25" />
                        <ellipse cx="12" cy="12" rx="4" ry="9.25" />
                        <path d="M2.75 12h18.5" />
                        <circle cx="12" cy="12" r="1.6" fill="hsl(var(--ta-accent))" stroke="none" />
                    </svg>
                    <span className="ta-display text-xl font-medium leading-none">Travel Agent</span>
                </NavLink>

                <nav className="flex items-center gap-4 sm:gap-7">
                    <NavLink to="/travel-agent" end className={linkClass}>
                        Search
                    </NavLink>
                    <NavLink to="/travel-agent/top" className={linkClass}>
                        Top<span className="hidden sm:inline">&nbsp;destinations</span>
                    </NavLink>
                    <NavLink to="/travel-agent/favorites" className={linkClass}>
                        <span className="hidden sm:inline">My&nbsp;</span>Favorites
                        {favorites.length > 0 && <span className="ta-accent ml-1.5">{favorites.length}</span>}
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
