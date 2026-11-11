import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/Footer';
import TravelNavbar from '@/features/travel-agent/components/TravelNavbar';
import './theme.css';

// The travel agent is its own small site inside the portfolio: own theme, own navbar, shared footer.
export default function TravelLayout() {
    return (
        <div className="ta flex min-h-screen flex-col">
            <TravelNavbar />
            <main className="flex-1 pt-14">
                <Suspense fallback={null}>
                    <Outlet />
                </Suspense>
            </main>
            <div className="border-t border-foreground/80 bg-card px-4 py-3 sm:px-6">
                <Link to="/" className="ta-label inline-flex items-center gap-2 hover:text-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Victor's portfolio
                </Link>
            </div>
            <Footer />
        </div>
    );
}
