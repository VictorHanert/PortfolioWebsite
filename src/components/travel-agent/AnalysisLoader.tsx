import { motion } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import type { AnalysisStep } from '@/types/travel';

interface AnalysisLoaderProps {
  steps: AnalysisStep[];
}

export default function AnalysisLoader({ steps }: AnalysisLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="flex flex-col items-center justify-center py-12 gap-6"
    >
      <div className="space-y-4 w-full max-w-xs">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {step.status === 'done' ? (
                <Check className="h-4 w-4 text-foreground" />
              ) : step.status === 'active' ? (
                <Loader2 className="h-4 w-4 animate-spin text-foreground" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-border" />
              )}
            </div>
            <span
              className={`text-sm ${
                step.status === 'active'
                  ? 'text-foreground font-medium'
                  : step.status === 'done'
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/60'
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
