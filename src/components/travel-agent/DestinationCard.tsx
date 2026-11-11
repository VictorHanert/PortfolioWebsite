import { motion } from 'framer-motion';
import type { DestinationCardData } from '@/types/travel';
import { formatMonths } from '@/services/travelSearch';

interface DestinationCardProps {
	card: DestinationCardData;
	index: number;
	onSelect: (card: DestinationCardData) => void;
}

export default function DestinationCard({ card, index, onSelect }: DestinationCardProps) {
	const { destination, reason } = card;

	return (
		<motion.button
			type="button"
			onClick={() => onSelect(card)}
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.07, duration: 0.35, ease: 'easeOut' }}
			className="ta-lift flex flex-col overflow-hidden rounded-sm border border-foreground/80 bg-card text-left focus-visible:outline-none"
		>
			<div className="relative aspect-[16/10] w-full bg-muted">
				{destination.image_url && (
					<img
						src={destination.image_url}
						alt={`${destination.name}, ${destination.country}`}
						loading="lazy"
						className="h-full w-full object-cover"
					/>
				)}
				<span className="ta-mono absolute left-0 top-0 bg-card px-2 py-1 text-[11px] text-foreground">
					{String(index + 1).padStart(2, '0')}
				</span>
			</div>

			<div className="flex flex-1 flex-col p-4">
				<p className="ta-label">{destination.country}</p>
				<h3 className="ta-display mt-0.5 text-xl font-medium leading-tight text-foreground">{destination.name}</h3>

				<p className="mt-2 text-xs leading-relaxed text-muted-foreground">{destination.description}</p>

				{/* Facts, laid out like a ticket stub */}
				<dl className="mt-3 grid grid-cols-3 gap-2 border-y border-dashed border-border py-2.5">
					<div title="Estimate per person for one week, including flights from Copenhagen">
						<dt className="ta-label">Cost</dt>
						<dd className="ta-mono mt-0.5 text-xs text-foreground">
							{destination.avg_cost_dkk !== null ? `${destination.avg_cost_dkk.toLocaleString('da-DK')} kr.` : '-'}
						</dd>
					</div>
					<div title="Typical one-way travel time">
						<dt className="ta-label">Travel</dt>
						<dd className="ta-mono mt-0.5 text-xs text-foreground">
							{destination.flight_hours !== null ? `${Number(destination.flight_hours).toLocaleString('da-DK')} h` : '-'}
						</dd>
					</div>
					<div title="Best months to go">
						<dt className="ta-label">Best</dt>
						<dd className="ta-mono mt-0.5 text-xs text-foreground">
							{destination.best_months?.length ? formatMonths(destination.best_months) : '-'}
						</dd>
					</div>
				</dl>

				{reason && (
					<p className="ta-display mt-3 border-l-2 border-[hsl(var(--ta-accent))] pl-3 text-sm italic leading-snug text-foreground">
						{reason}
					</p>
				)}

				{destination.category.length > 0 && (
					<p className="ta-label mt-auto pt-3">{destination.category.join(' / ')}</p>
				)}
			</div>
		</motion.button>
	);
}
