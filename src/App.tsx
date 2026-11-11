import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound.tsx";
import CommonNavbar from "./components/CommonNavbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Travel pages are loaded on demand to keep the landing page bundle small
const GlobePage = lazy(() => import("./pages/Globe"));
const TravelStatsPage = lazy(() => import("./pages/TravelStats"));

// The travel agent is its own site under /travel-agent (see src/features/travel-agent)
const TravelLayout = lazy(() => import("./features/travel-agent/TravelLayout"));
const TravelSearchPage = lazy(() => import("./features/travel-agent/pages/SearchPage"));
const TravelTopPage = lazy(() => import("./features/travel-agent/pages/TopDestinationsPage"));
const TravelFavoritesPage = lazy(() => import("./features/travel-agent/pages/FavoritesPage"));

const queryClient = new QueryClient();

const SharedPagesLayout = () => (
  <>
    <CommonNavbar />
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  </>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/travel-agent"
              element={
                <Suspense fallback={null}>
                  <TravelLayout />
                </Suspense>
              }
            >
              <Route index element={<TravelSearchPage />} />
              <Route path="top" element={<TravelTopPage />} />
              <Route path="favorites" element={<TravelFavoritesPage />} />
            </Route>
            <Route element={<SharedPagesLayout />}>
              <Route path="/globe" element={<GlobePage />} />
              <Route path="/stats" element={<TravelStatsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  );
};

export default App;
