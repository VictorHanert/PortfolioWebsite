import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import GlobePage from "./pages/Globe";
import TravelStatsPage from "./pages/TravelStats";
import TravelAgentPage from "./pages/TravelAgent";
import AdminSeedPage from "./pages/AdminSeed";
import NotFound from "./pages/NotFound.tsx";
import CommonNavbar from "./components/CommonNavbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const queryClient = new QueryClient();
const adminSeedEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN_SEED === "true";

const SharedPagesLayout = () => (
  <>
    <CommonNavbar />
    <Outlet />
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
            {/* {adminSeedEnabled &&  */}
            <Route path="/admin/seed" element={<AdminSeedPage />} />
            {/* } */}
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
