// Adds one Unsplash photo to each destination in supabase/seed/destinations.json.
// Run locally: node --env-file=.env scripts/fetch-destination-images.mjs [--force]
// Requires UNSPLASH_ACCESS_KEY. Without --force, destinations that already have an image are skipped.
// Follows the Unsplash API guidelines: images are hotlinked, the photographer and Unsplash are credited
// with referral links, and each used photo triggers its download endpoint once.
import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const SEED_FILE = new URL('../supabase/seed/destinations.json', import.meta.url);
const UTM = `utm_source=${process.env.UNSPLASH_APP_NAME || 'victorhanert_portfolio'}&utm_medium=referral`;
const force = process.argv.includes('--force');

const accessKey = process.env.UNSPLASH_ACCESS_KEY;
if (!accessKey) {
    console.error('Missing UNSPLASH_ACCESS_KEY');
    process.exit(1);
}

const headers = { Authorization: `Client-ID ${accessKey}`, 'Accept-Version': 'v1' };
const destinations = JSON.parse(await readFile(SEED_FILE, 'utf8'));

let added = 0;
let missing = 0;

for (const d of destinations) {
    if (d.image_url && !force) continue;

    const query = encodeURIComponent(`${d.name} ${d.country}`);
    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&content_filter=high&per_page=1`,
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

    const photo = (await res.json()).results?.[0];
    if (!photo) {
        console.warn(`No photo found for ${d.name}`);
        missing += 1;
        continue;
    }

    d.image_url = `${photo.urls.raw}&w=800&h=450&fit=crop&q=70&auto=format`;
    d.image_credit = photo.user.name;
    d.image_credit_url = `${photo.user.links.html}?${UTM}`;
    d.image_page_url = `${photo.links.html}?${UTM}`;
    added += 1;

    // Required by Unsplash when a photo is put to use
    await fetch(photo.links.download_location, { headers });
    await sleep(150);
}

await writeFile(SEED_FILE, JSON.stringify(destinations, null, 2) + '\n', 'utf8');
console.log(`Done. Added ${added} images, ${missing} without a match, ${destinations.filter((d) => !d.image_url).length} still missing.`);
