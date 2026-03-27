import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import FilterSidebar from '@/components/travel-agent/FilterSidebar';
import ChatPanel from '@/components/travel-agent/ChatPanel';
import AnalysisLoader from '@/components/travel-agent/AnalysisLoader';
import DestinationCard from '@/components/travel-agent/DestinationCard';
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [results, setResults] = useState<DestinationMatch[]>([]);

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
    <div className="pt-16">
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-background lg:h-[calc(100vh-4rem)] lg:min-h-0 lg:flex-row lg:overflow-hidden">
      {/* Filters panel: stacked on mobile, sidebar on desktop */}
      <div className="w-full lg:w-[420px] lg:min-w-[420px] xl:w-[460px] xl:min-w-[460px]">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onSearch={runSearch}
          isSearching={isSearching}
        />
      </div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
        {/* Chat + results area */}
        <div className="flex flex-1 flex-col lg:min-h-0 lg:overflow-hidden">
          {/* Chat */}
          <div className="flex-1 min-h-0">
            <ChatPanel messages={messages} semanticText={semanticText} onSemanticTextChange={setSemanticText} />
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
            <div className="max-h-[45vh] overflow-y-auto border-t border-border px-4 py-4 sm:px-6 sm:py-6">
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
    </div>
  );
}
