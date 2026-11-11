import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Plane, Wallet } from 'lucide-react';
import type { DestinationCardData } from '@/types/travel';
import { formatMonths } from '@/services/travelSearch';

interface DestinationCardProps {
	card: DestinationCardData;
	index: number;
}

export default function DestinationCard({ card, index }: DestinationCardProps) {
	const { destination, reason } = card;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.12, duration: 0.4, ease: 'easeOut' }}
			className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
		>
			{destination.image_url && (
				<div className="relative aspect-video bg-muted">
					<img
						src={destination.image_url}
						alt={`${destination.name}, ${destination.country}`}
						loading="lazy"
						className="h-full w-full object-cover"
					/>
					{/* Attribution required by the Unsplash API guidelines */}
					{destination.image_credit && (
						<p className="absolute bottom-0 right-0 rounded-tl-md bg-black/55 px-2 py-0.5 text-[10px] text-white">
							Photo by{' '}
							<a href={destination.image_credit_url ?? undefined} target="_blank" rel="noopener noreferrer" className="underline">
								{destination.image_credit}
							</a>{' '}
							on{' '}
							<a href={destination.image_page_url ?? undefined} target="_blank" rel="noopener noreferrer" className="underline">
								Unsplash
							</a>
						</p>
					)}
				</div>
			)}

			<div className="flex flex-1 flex-col p-5">
				<h3 className="text-base font-semibold text-foreground">{destination.name}</h3>
				<div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
					<MapPin className="h-3 w-3" />
					{destination.country}
				</div>

				<p className="mt-3 text-xs leading-relaxed text-muted-foreground">{destination.description}</p>

				{/* Facts */}
				<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground">
					{destination.avg_cost_dkk !== null && (
						<span className="inline-flex items-center gap-1" title="Estimate per person for one week, including flights from Copenhagen">
							<Wallet className="h-3.5 w-3.5 text-muted-foreground" />
							ca. {destination.avg_cost_dkk.toLocaleString('da-DK')} kr.
						</span>
					)}
					{destination.flight_hours !== null && (
						<span className="inline-flex items-center gap-1" title="Typical travel time from Copenhagen">
							<Plane className="h-3.5 w-3.5 text-muted-foreground" />
							{destination.flight_hours.toLocaleString('da-DK')} h
						</span>
					)}
					{destination.best_months && destination.best_months.length > 0 && (
						<span className="inline-flex items-center gap-1" title="Best months to go">
							<CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
							{formatMonths(destination.best_months)}
						</span>
					)}
				</div>

				{reason && (
					<div className="mt-3 rounded-lg bg-muted/60 px-3 py-2.5">
						<p className="mb-0.5 text-xs font-medium text-muted-foreground">Why this match</p>
						<p className="text-xs leading-relaxed text-foreground">{reason}</p>
					</div>
				)}

				{destination.category.length > 0 && (
					<div className="mt-auto flex flex-wrap gap-1.5 pt-3">
						{destination.category.map((c) => (
							<span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
								{c}
							</span>
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
}
