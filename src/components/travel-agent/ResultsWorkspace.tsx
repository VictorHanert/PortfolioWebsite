import type { ChatMessage, DestinationMatch } from '@/types/travel';
import DestinationCard from '@/components/travel-agent/DestinationCard';

interface ResultsWorkspaceProps {
  messages: ChatMessage[];
  results: DestinationMatch[];
  isSearching: boolean;
}

export default function ResultsWorkspace({ messages, results, isSearching }: ResultsWorkspaceProps) {
  const recentMessages = messages.slice(-4).reverse();

  return (
    <div className="flex h-full flex-col lg:min-h-0">
      <div className="border-b border-border px-4 py-3 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Search History</p>
        {recentMessages.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-full rounded-full px-3 py-1.5 text-xs ${
                  msg.role === 'user'
                    ? 'bg-primary/15 text-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No previous search notes yet.</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        {results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((result, index) => (
              <DestinationCard key={result.id} match={result} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
            <p className="max-w-md text-sm text-muted-foreground">
              {isSearching
                ? 'Searching for destinations based on your preferences...'
                : 'Set your preferences and click "Find my destination" to see tailored results here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
