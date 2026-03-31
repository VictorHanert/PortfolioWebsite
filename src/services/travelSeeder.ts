import { generateEmbedding } from "@/services/embedService";

type SeedDestination = {
  name: string;
  country: string;
  budget: number;
  dist: 'Short' | 'Mid' | 'Long';
  cats: string[];
  desc: string;
};

const DESTINATIONS_TO_SEED: SeedDestination[] = [
  { name: 'Barcelona', country: 'Spain', budget: 2, dist: 'Short', cats: ['Football', 'Cultural', 'Beach'], desc: 'A vibrant Mediterranean city with top football, architecture, and beach life.' },
  { name: 'Tokyo', country: 'Japan', budget: 4, dist: 'Long', cats: ['Cultural', 'Shopping', 'Capital'], desc: 'A dynamic capital blending neon districts, temples, and exceptional food.' },
  { name: 'Chamonix', country: 'France', budget: 3, dist: 'Short', cats: ['Ski', 'Nature', 'Cold Weather'], desc: 'A mountain destination for winter sports and summer alpine trails.' },
  { name: 'Amalfi Coast', country: 'Italy', budget: 3, dist: 'Short', cats: ['Romantic', 'Warm Weather', 'Relax'], desc: 'Cliffside villages, sea views, and slow luxury along the Italian coast.' },
  { name: 'Rome', country: 'Italy', budget: 2, dist: 'Short', cats: ['Romantic', 'Capital', 'Shopping', 'Cultural', 'Historical'], desc: 'Ancient wonders, Renaissance art, and vibrant culture in Italy’s historic capital.' },
  { name: 'New York City', country: 'USA', budget: 4, dist: 'Long', cats: ['Shopping', 'Capital', 'Nightlife'], desc: 'Iconic skyline, endless neighborhoods, and world-class entertainment.' },
  { name: 'Albanian Riviera', country: 'Albania', budget: 1, dist: 'Short', cats: ['Hidden Gem', 'Nature', 'Beach'], desc: 'A value-for-money coastline with crystal water and dramatic mountain backdrops.' },
  { name: 'Maldives Atolls', country: 'Maldives', budget: 4, dist: 'Long', cats: ['Beach', 'Relax', 'Romantic'], desc: 'Overwater villas, coral lagoons, and complete tropical downtime.' },
  { name: 'London', country: 'United Kingdom', budget: 3, dist: 'Short', cats: ['Football', 'Shopping', 'Historical'], desc: 'A historic city with museums, football culture, and diverse neighborhoods.' },
  { name: 'Lisbon', country: 'Portugal', budget: 2, dist: 'Short', cats: ['Cultural', 'Warm Weather', 'Trending'], desc: 'Hillside streets, ocean light, and a growing food and design scene.' },
  { name: 'Reykjavik', country: 'Iceland', budget: 4, dist: 'Mid', cats: ['Nature', 'Cold Weather', 'Trending'], desc: 'Northern landscapes, geothermal spas, and a compact creative capital.' },
  { name: 'Prague', country: 'Czech Republic', budget: 2, dist: 'Short', cats: ['Historical', 'Cultural', 'Capital'], desc: 'Fairytale architecture, riverside walks, and rich Central European history.' },
  { name: 'Vienna', country: 'Austria', budget: 3, dist: 'Short', cats: ['Historical', 'Cultural', 'Capital'], desc: 'Elegant boulevards, classical music heritage, and grand imperial landmarks.' },
  { name: 'Bali', country: 'Indonesia', budget: 2, dist: 'Long', cats: ['Nature', 'Relax', 'Warm Weather'], desc: 'Rice terraces, surf beaches, and wellness retreats in tropical weather.' },
  { name: 'Cape Town', country: 'South Africa', budget: 3, dist: 'Long', cats: ['Nature', 'Beach', 'Trending'], desc: 'Coastal drives, mountain hikes, and a diverse urban food culture.' },
  { name: 'Dubrovnik', country: 'Croatia', budget: 3, dist: 'Short', cats: ['Historical', 'Beach', 'Romantic'], desc: 'Stone walls, Adriatic views, and romantic old-town evenings.' },
  { name: 'Marrakesh', country: 'Morocco', budget: 2, dist: 'Mid', cats: ['Cultural', 'Shopping', 'Warm Weather'], desc: 'Colorful souks, riads, and rich North African design and cuisine.' },
  { name: 'Stockholm', country: 'Sweden', budget: 3, dist: 'Short', cats: ['Capital', 'Cultural', 'Quiet'], desc: 'Island city life with clean design, waterfront views, and calm neighborhoods.' },
  { name: 'Oslo', country: 'Norway', budget: 3, dist: 'Short', cats: ['Nature', 'Capital', 'Quiet'], desc: 'A compact capital with fjord access, forests, and modern architecture.' },
  { name: 'Whistler', country: 'Canada', budget: 4, dist: 'Long', cats: ['Ski', 'Nature', 'Cold Weather'], desc: 'Top-tier ski terrain, alpine village atmosphere, and year-round mountain activities.' },
  { name: 'Istanbul', country: 'Turkey', budget: 2, dist: 'Mid', cats: ['Cultural', 'Historical', 'Shopping'], desc: 'A transcontinental city with bazaars, mosques, and rich layered history.' },
  { name: 'Santorini', country: 'Greece', budget: 3, dist: 'Short', cats: ['Romantic', 'Beach', 'Warm Weather'], desc: 'Cliffside sunsets, white villages, and iconic Aegean island scenery.' },
  { name: 'Edinburgh', country: 'United Kingdom', budget: 2, dist: 'Short', cats: ['Historical', 'Cultural', 'Quiet'], desc: 'Castle skyline, literary heritage, and dramatic landscapes nearby.' },
  { name: 'Seoul', country: 'South Korea', budget: 3, dist: 'Long', cats: ['Shopping', 'Capital', 'Nightlife'], desc: 'Fast-paced districts, excellent transit, and a strong food and fashion culture.' },
  { name: 'Tbilisi', country: 'Georgia', budget: 1, dist: 'Mid', cats: ['Hidden Gem', 'Cultural', 'Trending'], desc: 'Old-town charm, wine traditions, and strong value for budget-conscious trips.' },
  { name: 'Madeira', country: 'Portugal', budget: 2, dist: 'Mid', cats: ['Nature', 'Relax', 'Warm Weather'], desc: 'Volcanic island trails, ocean cliffs, and mild weather all year.' },
  { name: 'Munich', country: 'Germany', budget: 3, dist: 'Short', cats: ['Historical', 'Cultural', 'Football'], desc: 'Classic Bavarian culture, museums, and major football atmosphere.' },
  { name: 'Budapest', country: 'Hungary', budget: 2, dist: 'Short', cats: ['Historical', 'Nightlife', 'Cultural'], desc: 'Thermal baths, riverside architecture, and a lively evening scene.' },
  { name: 'Valencia', country: 'Spain', budget: 2, dist: 'Short', cats: ['Beach', 'Cultural', 'Warm Weather'], desc: 'A sunny coastal city balancing modern design, old quarters, and beaches.' },
  { name: 'Kyoto', country: 'Japan', budget: 4, dist: 'Long', cats: ['Historical', 'Cultural', 'Quiet'], desc: 'Temple gardens, traditional neighborhoods, and a slower Japanese rhythm.' }
];

export const seedDatabase = async () => {
  console.log("Preparing embedding vectors...");

  const rows = [] as Array<{
    name: string;
    country: string;
    description: string;
    category: string[];
    budget_level: number;
    distance_category: 'Short' | 'Mid' | 'Long';
    embedding: number[];
  }>;

  for (const item of DESTINATIONS_TO_SEED) {
    try {
      const embedding = await generateEmbedding(
        `${item.name} ${item.country} ${item.desc} ${item.cats.join(' ')}`
      );

      rows.push({
        name: item.name,
        country: item.country,
        description: item.desc,
        category: item.cats,
        budget_level: item.budget,
        distance_category: item.dist,
        embedding,
      });

      console.log(`Prepared: ${item.name}`);
    } catch (err) {
      console.error(`Embedding failed for ${item.name}:`, err);
      return { successCount: 0, errorCount: DESTINATIONS_TO_SEED.length };
    }
  }

  console.log("Sending rows to secure seed endpoint...");

  const seedToken = import.meta.env.VITE_SEED_ADMIN_TOKEN;
  if (!seedToken) {
    console.error('VITE_SEED_ADMIN_TOKEN is missing. Seeding is blocked for safety.');
    return { successCount: 0, errorCount: DESTINATIONS_TO_SEED.length };
  }

  const res = await fetch('/api/seed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-seed-token': seedToken,
    },
    body: JSON.stringify({ reset: true, rows }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('Seed API failed:', errorBody);
    return { successCount: 0, errorCount: DESTINATIONS_TO_SEED.length };
  }

  const result = await res.json();
  if (result.projectRef) {
    console.log(`Seed target project: ${result.projectRef}`);
  }
  if (typeof result.tableRowCount === 'number') {
    console.log(`Rows now in travel_destinations: ${result.tableRowCount}`);
  }
  console.log(`Seeding done! Success: ${result.successCount}, Errors: ${result.errorCount}`);
  return { successCount: result.successCount, errorCount: result.errorCount };
};
