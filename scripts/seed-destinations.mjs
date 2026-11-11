// Seeds public.travel_destinations from supabase/seed/destinations.json.
// Run locally: node --env-file=.env scripts/seed-destinations.mjs
// Requires GEMINI_API_KEY, SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

// Must match api/embed.ts and the vector(768) column in Supabase
const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = 768;

const geminiKey = process.env.GEMINI_API_KEY;
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!geminiKey || !supabaseUrl || !serviceRoleKey) {
    console.error('Missing GEMINI_API_KEY, SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const normalize = (values) => {
    const norm = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
    return norm === 0 ? values : values.map((v) => v / norm);
};

const destinations = JSON.parse(await readFile(new URL('../supabase/seed/destinations.json', import.meta.url), 'utf8'));
const tasteProfile = (await readFile(new URL('../supabase/seed/taste-profile.txt', import.meta.url), 'utf8')).trim();

console.log(`Embedding ${destinations.length} destinations and the taste profile with ${EMBEDDING_MODEL}...`);

// The taste profile acts as a second query, so it uses the query task type
const requests = [
    ...destinations.map((d) => ({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text: `${d.name}, ${d.country}. ${d.description} Categories: ${d.category.join(', ')}.` }] },
        taskType: 'RETRIEVAL_DOCUMENT',
        title: d.name,
        outputDimensionality: EMBEDDING_DIMENSIONS,
    })),
    {
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text: tasteProfile }] },
        taskType: 'RETRIEVAL_QUERY',
        outputDimensionality: EMBEDDING_DIMENSIONS,
    },
];

// batchEmbedContents accepts at most 100 requests per call
const embeddings = [];
for (let i = 0; i < requests.length; i += 100) {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
            body: JSON.stringify({ requests: requests.slice(i, i + 100) }),
        }
    );

    if (!res.ok) {
        console.error('Gemini batch embed failed:', res.status, await res.text());
        process.exit(1);
    }

    embeddings.push(...(await res.json()).embeddings);
}

// budget_level and distance_category are legacy columns, derived here until they are dropped
const budgetLevel = (cost) => (cost <= 5000 ? 1 : cost <= 10000 ? 2 : cost <= 20000 ? 3 : 4);
const distanceCategory = (hours) => (hours <= 3.5 ? 'Short' : hours <= 7 ? 'Mid' : 'Long');

const rows = destinations.map((d, i) => ({
    image_url: null,
    image_credit: null,
    image_credit_url: null,
    image_page_url: null,
    ...d,
    budget_level: budgetLevel(d.avg_cost_dkk),
    distance_category: distanceCategory(d.flight_hours),
    embedding: normalize(embeddings[i].values),
}));
const profileEmbedding = normalize(embeddings[destinations.length].values);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
});

const { error: upsertError } = await supabase
    .from('travel_destinations')
    .upsert(rows, { onConflict: 'name,country_code' });

if (upsertError) {
    console.error('Upsert failed:', upsertError.message);
    process.exit(1);
}

// Remove rows that are no longer in the seed file, so the JSON stays the source of truth
const { data: existing, error: selectError } = await supabase.from('travel_destinations').select('id, name, country_code');
if (selectError) {
    console.error('Select failed:', selectError.message);
    process.exit(1);
}

const keep = new Set(destinations.map((d) => `${d.name}||${d.country_code}`));
const staleIds = existing.filter((r) => !keep.has(`${r.name}||${r.country_code}`)).map((r) => r.id);

if (staleIds.length > 0) {
    const { error: deleteError } = await supabase.from('travel_destinations').delete().in('id', staleIds);
    if (deleteError) {
        console.error('Delete of stale rows failed:', deleteError.message);
        process.exit(1);
    }
}

const { error: profileError } = await supabase
    .from('travel_profiles')
    .upsert({ id: 'victor', embedding: profileEmbedding }, { onConflict: 'id' });

if (profileError) {
    console.error('Taste profile upsert failed:', profileError.message);
    process.exit(1);
}

console.log(`Done. Upserted ${rows.length}, removed ${staleIds.length} stale rows.`);
