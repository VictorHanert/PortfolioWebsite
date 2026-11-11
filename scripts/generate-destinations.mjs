// Generates supabase/seed/destinations.json with Gemini, region by region.
// Run locally: node --env-file=.env scripts/generate-destinations.mjs
// Requires GEMINI_API_KEY. Review the JSON diff before seeding: the output is AI-written estimates.
// Existing image fields are kept for destinations that survive the regeneration.
import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
const SEED_FILE = new URL('../supabase/seed/destinations.json', import.meta.url);

// Must match CATEGORY_OPTIONS in src/features/travel-agent/types.ts
const CATEGORIES = [
    'Beach', 'Warm Weather', 'Relax', 'Quiet', 'Nature', 'Cultural', 'Historical', 'Shopping', 'Capital',
    'Football', 'Nightlife', 'Ski', 'Cold Weather', 'Romantic', 'Trending', 'Hidden Gem',
];

const REGIONS = [
    { name: 'Nordics and Baltics (excluding Denmark)', count: 14 },
    { name: 'Western Europe: UK, Ireland, Benelux, France, Germany, Austria, Switzerland', count: 22 },
    { name: 'Southern Europe: Portugal, Spain, Italy, Malta, Greece, Cyprus, Croatia and the western Balkans', count: 30 },
    { name: 'Eastern Europe, Turkey and the Caucasus', count: 14 },
    { name: 'Middle East and North Africa', count: 10 },
    { name: 'Sub-Saharan Africa and the Indian Ocean islands', count: 10 },
    { name: 'South and Southeast Asia', count: 18 },
    { name: 'East Asia', count: 8 },
    { name: 'North America and the Caribbean', count: 12 },
    { name: 'Central and South America', count: 8 },
    { name: 'Oceania', count: 4 },
];

const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
    console.error('Missing GEMINI_API_KEY');
    process.exit(1);
}

const existing = JSON.parse(await readFile(SEED_FILE, 'utf8'));
const key = (d) => `${d.name}||${d.country_code}`.toLowerCase();
const existingByKey = new Map(existing.map((d) => [key(d), d]));

const responseSchema = {
    type: 'ARRAY',
    items: {
        type: 'OBJECT',
        properties: {
            name: { type: 'STRING' },
            country: { type: 'STRING' },
            country_code: { type: 'STRING' },
            description: { type: 'STRING' },
            category: { type: 'ARRAY', items: { type: 'STRING', enum: CATEGORIES } },
            best_months: { type: 'ARRAY', items: { type: 'INTEGER' } },
            avg_cost_dkk: { type: 'INTEGER' },
            flight_hours: { type: 'NUMBER' },
        },
        required: ['name', 'country', 'country_code', 'description', 'category', 'best_months', 'avg_cost_dkk', 'flight_hours'],
    },
};

function buildPrompt(region, taken) {
    return `You are building a travel destination dataset for a traveller based in Copenhagen, Denmark.

Return exactly ${region.count} destinations in this region: ${region.name}.

Rules:
- A destination is a city, island, coast or region a person would plan one trip around. No whole countries.
- Mix well-known places with lesser-known ones. Cover different trip types: city, beach, nature, ski, culture.
- Include these when they belong to the region: ${existing.map((d) => `${d.name} (${d.country})`).join(', ')}.
- Also include, when they belong to the region: Sydney, a New Zealand destination, a Vietnam destination.
- Do not return any of these, they are already taken: ${taken.length ? taken.join(', ') : 'none'}.
- name: the place name in English. country: the common English country name. country_code: ISO 3166-1 alpha-3.
- description: one concrete sentence, at most 140 characters, about what makes the place worth the trip. No marketing filler.
- category: 2 to 4 values, only from the allowed list.
- best_months: the months (1-12) with the best conditions for the main reason to go.
- avg_cost_dkk: realistic total in Danish kroner per person for 7 days at a mid-range level, including return flights from Copenhagen.
- flight_hours: typical total travel time from Copenhagen one way, including a normal connection, with one decimal.`;
}

// Newer Gemini models are often overloaded, so each region retries across a few models.
async function generateRegion(region, taken) {
    let lastError;
    for (let attempt = 0; attempt < 6; attempt++) {
        const model = MODELS[attempt % MODELS.length];
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                method: 'POST',
                signal: AbortSignal.timeout(120_000),
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: buildPrompt(region, taken) }] }],
                    generationConfig: { responseMimeType: 'application/json', responseSchema, temperature: 0.6 },
                }),
            });
            if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);

            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
            return JSON.parse(text);
        } catch (error) {
            lastError = error;
            console.warn(`  ${model} failed (${error.message.split('\n')[0]}), retrying...`);
            await sleep(3000 * (attempt + 1));
        }
    }
    throw new Error(`Gemini failed for "${region.name}": ${lastError.message}`);
}

function validate(d) {
    const problems = [];
    if (!d.name?.trim() || !d.country?.trim()) problems.push('missing name or country');
    if (!/^[A-Z]{3}$/.test(d.country_code ?? '')) problems.push('bad country_code');
    if (!d.description?.trim() || d.description.length > 200) problems.push('bad description');
    if (!Array.isArray(d.category) || d.category.length < 1 || d.category.some((c) => !CATEGORIES.includes(c))) problems.push('bad category');
    if (!Array.isArray(d.best_months) || d.best_months.length < 1 || d.best_months.some((m) => !Number.isInteger(m) || m < 1 || m > 12)) problems.push('bad best_months');
    if (!Number.isInteger(d.avg_cost_dkk) || d.avg_cost_dkk < 1500 || d.avg_cost_dkk > 80000) problems.push('bad avg_cost_dkk');
    if (typeof d.flight_hours !== 'number' || d.flight_hours < 0.5 || d.flight_hours > 40) problems.push('bad flight_hours');
    return problems;
}

const result = new Map();
for (const region of REGIONS) {
    console.log(`Generating ${region.count} for ${region.name}...`);
    const rows = await generateRegion(region, [...result.values()].map((d) => `${d.name} (${d.country})`));

    for (const raw of rows) {
        const d = {
            name: raw.name?.trim(),
            country: raw.country?.trim(),
            country_code: raw.country_code?.trim().toUpperCase(),
            description: raw.description?.trim(),
            category: [...new Set(raw.category ?? [])],
            best_months: [...new Set(raw.best_months ?? [])].sort((a, b) => a - b),
            avg_cost_dkk: Math.round((raw.avg_cost_dkk ?? 0) / 100) * 100,
            flight_hours: Math.round((raw.flight_hours ?? 0) * 10) / 10,
        };

        const problems = validate(d);
        if (problems.length > 0) {
            console.warn(`  Skipped ${d.name ?? '(no name)'}: ${problems.join(', ')}`);
            continue;
        }
        if (result.has(key(d))) {
            console.warn(`  Skipped duplicate ${d.name}`);
            continue;
        }

        // Keep image fields that fetch-destination-images.mjs added earlier
        const previous = existingByKey.get(key(d));
        const images = previous
            ? Object.fromEntries(Object.entries(previous).filter(([k]) => k.startsWith('image_')))
            : {};
        result.set(key(d), { ...d, ...images });
    }
}

const destinations = [...result.values()].sort(
    (a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name)
);
const dropped = existing.filter((d) => !result.has(key(d))).map((d) => d.name);

await writeFile(SEED_FILE, JSON.stringify(destinations, null, 2) + '\n', 'utf8');
console.log(`Done. Wrote ${destinations.length} destinations.`);
if (dropped.length > 0) console.log(`Not regenerated from the previous file: ${dropped.join(', ')}`);
