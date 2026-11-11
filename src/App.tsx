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
const TravelAgentPage = lazy(() => import("./pages/TravelAgent"));

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
            <Route element={<SharedPagesLayout />}>
              <Route path="/globe" element={<GlobePage />} />
              <Route path="/stats" element={<TravelStatsPage />} />
              <Route path="/travel-agent" element={<TravelAgentPage />} />
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
