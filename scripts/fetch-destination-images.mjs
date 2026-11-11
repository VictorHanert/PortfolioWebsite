// Adds one Unsplash photo to each destination in supabase/seed/destinations.json.
// Run locally: node --env-file=.env scripts/fetch-destination-images.mjs [--force] [--only=Dahab,AlUla]
// Requires UNSPLASH_ACCESS_KEY. Without --force or --only, destinations that already have an image are skipped.
// Follows the Unsplash API guidelines: images are hotlinked, the photographer and Unsplash are credited
// with referral links, and each used photo triggers its download endpoint once.
import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const SEED_FILE = new URL('../supabase/seed/destinations.json', import.meta.url);
const UTM = `utm_source=${process.env.UNSPLASH_APP_NAME || 'victorhanert_portfolio'}&utm_medium=referral`;
const force = process.argv.includes('--force');
const only = process.argv.find((arg) => arg.startsWith('--only='))?.slice(7).split(',') ?? null;

// Search terms for places where "name country" returns photos of somewhere else
const QUERY_OVERRIDES = {
    'Dahab': 'Dahab Sinai Red Sea',
    'Saaremaa': 'Saaremaa Kuressaare',
    'Rovaniemi': 'Rovaniemi northern lights',
    'Nosy Be': 'Nosy Be Madagascar beach',
    'San Pedro de Atacama': 'Atacama desert Valle de la Luna',
    'Split': 'Diocletian Palace Split',
    'Tallinn': 'Tallinn old town',
    'San Juan': 'San Juan Puerto Rico colorful houses',
    'Saint-Gilles': 'Reunion island beach',
    'AlUla': 'AlUla Hegra',
    'Swedish Lapland': 'Abisko Lapland Sweden',
    'Hoi An': 'Hoi An lanterns',
};

const accessKey = process.env.UNSPLASH_ACCESS_KEY;
if (!accessKey) {
    console.error('Missing UNSPLASH_ACCESS_KEY');
    process.exit(1);
}

const headers = { Authorization: `Client-ID ${accessKey}`, 'Accept-Version': 'v1' };
const destinations = JSON.parse(await readFile(SEED_FILE, 'utf8'));

// Unsplash search is fuzzy: the top hit for "Hoi An Vietnam" can be any Vietnamese street.
// Score each candidate by whether its own description names the place, and report weak matches.
const normalizeText = (text) => (text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function scorePhoto(photo, d) {
    const text = normalizeText(`${photo.description} ${photo.alt_description} ${photo.slug}`);
    const nameWords = normalizeText(QUERY_OVERRIDES[d.name] ?? d.name).split(/[^a-z]+/).filter((w) => w.length > 3);
    const nameHits = nameWords.filter((w) => text.includes(w)).length;

    let score = 0;
    if (nameWords.length > 0 && nameHits === nameWords.length) score += 3;
    else if (nameHits > 0) score += 2;
    if (text.includes(normalizeText(d.country))) score += 1;
    return score;
}

let added = 0;
const missing = [];
const weak = [];

for (const d of destinations) {
    if (only ? !only.includes(d.name) : d.image_url && !force) continue;

    const query = encodeURIComponent(QUERY_OVERRIDES[d.name] ?? `${d.name} ${d.country}`);
    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&content_filter=high&per_page=15`,
        { headers }
    );

    if (res.status === 403 || res.status === 429) {
        console.error(`Rate limit reached at ${d.name}. Run the script again later to continue.`);
        break;
    }
    if (!res.ok) {
        console.error(`Search failed for ${d.name}: ${res.status}`);
        break;
    }

    // Highest score wins; Unsplash relevance order breaks ties
    const candidates = (await res.json()).results ?? [];
    const photo = candidates
        .map((candidate, index) => ({ candidate, index, score: scorePhoto(candidate, d) }))
        .sort((a, b) => b.score - a.score || a.index - b.index)[0];

    if (!photo) {
        missing.push(d.name);
        continue;
    }
    if (photo.score < 2) weak.push(`${d.name} (${d.country}): "${photo.candidate.alt_description ?? 'no description'}"`);

    const { candidate } = photo;
    d.image_url = `${candidate.urls.raw}&w=800&h=450&fit=crop&q=70&auto=format`;
    d.image_credit = candidate.user.name;
    d.image_credit_url = `${candidate.user.links.html}?${UTM}`;
    d.image_page_url = `${candidate.links.html}?${UTM}`;
    added += 1;

    // Required by Unsplash when a photo is put to use
    await fetch(candidate.links.download_location, { headers });
    await sleep(150);
}

await writeFile(SEED_FILE, JSON.stringify(destinations, null, 2) + '\n', 'utf8');
console.log(`Done. Added ${added} images, ${destinations.filter((d) => !d.image_url).length} destinations still without one.`);
if (missing.length > 0) console.log(`No photo found: ${missing.join(', ')}`);
if (weak.length > 0) console.log(`Weak matches, check these by eye:\n  ${weak.join('\n  ')}`);
