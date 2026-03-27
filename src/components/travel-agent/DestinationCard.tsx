import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { DestinationMatch } from '@/types/travel';

interface DestinationCardProps {
  match: DestinationMatch;
  index: number;
}

export default function DestinationCard({ match, index }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4, ease: 'easeOut' }}
      className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{match.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="h-3 w-3" />
            {match.country}
          </div>
        </div>
        {/* Match score */}
        <div className="flex flex-col items-center">
          <div className="relative h-11 w-11">
            <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${match.matchScore} ${100 - match.matchScore}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
              {match.matchScore}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5">Match</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{match.description}</p>

      {/* Cost */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">Estimeret pris</span>
        <span className="text-sm font-semibold text-foreground">
          {match.estimatedCostDKK.toLocaleString('da-DK')} kr.
        </span>
      </div>

      {/* Match reason */}
      <div className="bg-muted/60 rounded-lg px-3 py-2.5">
        <p className="text-xs font-medium text-muted-foreground mb-0.5">Hvorfor dette match</p>
        <p className="text-xs text-foreground leading-relaxed">{match.matchReason}</p>
      </div>

      {/* Category chips */}
      {match.categories.length > 0 && (
        <div className="flex gap-1.5 mt-3">
          {match.categories.map((c) => (
            <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
              {c}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
