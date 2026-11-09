import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import PreferencePanel from '@/components/travel-agent/PreferencePanel';
import ResultsWorkspace from '@/components/travel-agent/ResultsWorkspace';
import AnalysisLoader from '@/components/travel-agent/AnalysisLoader';
import { findDestinations, type SearchProgress } from '@/services/travelService';
import { isSupabaseConfigured } from '@/services/supabaseClient';
import type { SearchFilters, ChatMessage, AnalysisStep, DestinationMatch } from '@/types/travel';
import { DEFAULT_FILTERS } from '@/types/travel';

const STEP_LABELS = {
    embedding: 'Understanding your description...',
    searching: 'Searching the destination database...',
} as const;

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

        // Show each real search phase as it starts, marking earlier phases as done
        const onProgress = (step: SearchProgress) => {
            setAnalysisSteps((prev) => [
                ...prev.map((s) => ({ ...s, status: 'done' as const })),
                { label: STEP_LABELS[step], status: 'active' },
            ]);
        };

        let content: string;
        let matches: DestinationMatch[] = [];
        try {
            matches = await findDestinations(filters, semanticText, onProgress);
            const demoNote = !isSupabaseConfigured ? ' (Demo results)' : '';
            content = matches.length
                ? `I found ${matches.length} destinations that match your preferences.${demoNote}`
                : 'No destinations matched your filters. Try adjusting your criteria.';
        } catch (error) {
            console.error('Travel search failed:', error);
            content = 'Something went wrong while searching. Please try again in a moment.';
        }

        setResults(matches);
        setMessages((prev) => [
            ...prev,
            {
                id: `agent-${Date.now()}`,
                role: 'agent',
                content,
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
                <div className="w-full lg:w-[420px] lg:min-w-[460px] xl:w-[560px] xl:min-w-[500px]">
                    <PreferencePanel
                        filters={filters}
                        onChange={setFilters}
                        semanticText={semanticText}
                        onSemanticTextChange={setSemanticText}
                        onSearch={runSearch}
                        isSearching={isSearching}
                    />
                </div>

                {/* Main area */}
                <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
                    {/* Results area */}
                    <div className="flex flex-1 flex-col lg:min-h-0 lg:overflow-hidden">
                        <AnimatePresence>
                            {analysisSteps.length > 0 && (
                                <div className="border-b border-border">
                                    <AnalysisLoader steps={analysisSteps} />
                                </div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 min-h-0">
                            <ResultsWorkspace messages={messages} results={results} isSearching={isSearching} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
