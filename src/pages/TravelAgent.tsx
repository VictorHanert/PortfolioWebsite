import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import FilterSidebar from '@/components/travel-agent/FilterSidebar';
import ChatPanel from '@/components/travel-agent/ChatPanel';
import AnalysisLoader from '@/components/travel-agent/AnalysisLoader';
import DestinationCard from '@/components/travel-agent/DestinationCard';
import { Button } from '@/components/ui/button';
import { findDestinations } from '@/services/travelService';
import { isSupabaseConfigured } from '@/services/supabaseClient';
import type { SearchFilters, ChatMessage, AnalysisStep, DestinationMatch } from '@/types/travel';
import { DEFAULT_FILTERS } from '@/types/travel';

const INITIAL_STEPS: AnalysisStep[] = [
  { label: 'Analyzing your preferences...', status: 'pending' },
  { label: 'Matching against travel database...', status: 'pending' },
  { label: 'Searching semantically in the database...', status: 'pending' },
];

export default function TravelAgent() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [semanticText, setSemanticText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'agent',
      content: 'Welcome! Use the filters on the left and describe your dream trip below. Click "Find my destination" when you are ready.',
      timestamp: new Date(),
    },
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [results, setResults] = useState<DestinationMatch[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const runSearch = useCallback(async () => {
    if (isSearching) return;
    setIsSearching(true);
    setResults([]);

    // Add user message
    if (semanticText.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          content: semanticText,
          timestamp: new Date(),
        },
      ]);
    }

    // Run analysis steps
    const steps = INITIAL_STEPS.map((s) => ({ ...s }));
    for (let i = 0; i < steps.length; i++) {
      steps[i].status = 'active';
      setAnalysisSteps([...steps]);
      await new Promise((r) => setTimeout(r, 900));
      steps[i].status = 'done';
      setAnalysisSteps([...steps]);
    }

    // Fetch results
    const matches = await findDestinations(filters, semanticText);
    setResults(matches);

    // Agent reply
    const demoNote = !isSupabaseConfigured ? ' (Demo-results)' : '';
    setMessages((prev) => [
      ...prev,
      {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: matches.length
          ? `I found ${matches.length} destinations that match your preferences.${demoNote}`
          : 'No destinations matched your filters. Try adjusting your criteria.',
        timestamp: new Date(),
        results: matches,
      },
    ]);

    setAnalysisSteps([]);
    setIsSearching(false);
  }, [filters, semanticText, isSearching]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-[300px] transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-[320px] flex-shrink-0`}
      >
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onSearch={runSearch}
          isSearching={isSearching}
        />
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat + results area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat */}
          <div className="flex-1 min-h-0">
            <ChatPanel
              messages={messages}
              semanticText={semanticText}
              onSemanticTextChange={setSemanticText}
            />
          </div>

          {/* Analysis loader or results */}
          <AnimatePresence>
            {analysisSteps.length > 0 && (
              <div className="border-t border-border">
                <AnalysisLoader steps={analysisSteps} />
              </div>
            )}
          </AnimatePresence>

          {results.length > 0 && (
            <div className="border-t border-border overflow-y-auto max-h-[45vh] px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((r, i) => (
                  <DestinationCard key={r.id} match={r} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
