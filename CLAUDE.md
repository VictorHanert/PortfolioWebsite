# CLAUDE.md

Personal portfolio for Victor Hanert (victorhanert.com). Vite + React SPA deployed on Vercel, with Vercel edge functions in `api/`.

## Commands

- `npm install` - install deps (npm is the source of truth: `package-lock.json`. `bun.lockb` is stale)
- `npm run dev` - Vite dev server. Note: `api/*` functions do not run under plain Vite; use `vercel dev` to exercise them locally
- `npm run build` - production build to `dist/`
- `npm run lint` - ESLint
- `npx tsc -p tsconfig.app.json --noEmit` - typecheck (no `typecheck` script exists)
- `npm test` - Vitest (`vitest run`). Kept minimal: pure logic in `src/services/travelSearch.test.ts`

## Stack

- React 18.3 (not 19), TypeScript, Vite 7, `react-router-dom` v6
- Tailwind CSS + shadcn/ui (`src/components/ui/*`, generated, avoid hand-editing)
- `styled-components` only in `StyledText.tsx` and `Switch.tsx` (legacy, do not spread it)
- framer-motion, Recharts, tsparticles, MapTiler SDK
- AI: Gemini. Chatbot via `@google/generative-ai`; travel agent via the AI SDK (`ai` v6, `@ai-sdk/google`, `@ai-sdk/react`); embeddings via REST
- Supabase (pgvector) for the travel agent

## Layout

- `src/App.tsx` - routes: `/`, `/globe`, `/stats`, `/travel-agent` (the three travel pages are `React.lazy` chunks). Providers: React Query, Tooltip, both toasters, Vercel Analytics + SpeedInsights
- `src/pages/Index.tsx` - landing page: Hero, About, Skills, Projects, Contact
- `src/data/` - content source of truth:
  - `portfolioData.ts` - personal facts fed to the chatbot (`api/chat.ts` serializes the whole object into the system prompt)
  - `projectsData.ts` - project cards. Array order = display order. `id === 1` (Pandi Web) drives the client list in `ProjectModal.tsx`, so do not renumber it
  - `visitedCountries.ts` - all travel data (continent-nested). `travelStats.ts` derives everything from it. Never hardcode duplicated stats
  - `countryCodeMapping.ts` - numeric to alpha-3 fallback for globe features
- Work history and education are hardcoded in `src/components/About.tsx` (typing animation uses sequential `experienceRefs` indexes; keep them contiguous when adding rows). Also mirrored in `README.md` and `portfolioData.ts`
- `api/` - Vercel edge functions:
  - `chat.ts` - portfolio chatbot (Gemini), rate limited
  - `send.ts` - contact form mail (nodemailer/Gmail), rate limited
  - `travel-search.ts` - destination search for the filter panel (no language model), rate limited
  - `travel-agent.ts` - the conversational travel agent (see below), rate limited
  - `_lib/` - shared helpers (`rateLimit.ts`, `embedding.ts`, `search.ts`). Underscore folders are not routes. Import with `.js` extensions and relative paths: the API bundle has no `@` alias

## Globe (`/globe`)

- MapTiler, key from `VITE_MAPTILER_API_KEY`
- `countriesData` vector source, `administrative` source-layer at `level` 0, feature-state coloring
- Keep the `sourcedata` handler: it refreshes states for small countries
- Feature lookup: alpha-3 from feature properties first, then numeric mapping fallback
- Legend swatches share the visit-count bins with the map fill; keep them in sync
- Drawer must stay compact on mobile (no overflow / extra whitespace)

## Travel agent (`/travel-agent`)

- Two modes on one page (`src/pages/TravelAgent.tsx`), sharing the result cards:
  - **Filters (primary, default)**: `PreferencePanel.tsx` (budget range, trip length, distance, categories, season, free text, two Victor toggles). `filtersToSearchInput` turns the panel state into a `SearchInput`, posted to `api/travel-search.ts`. No language model: only the optional free text is embedded, and a failed embedding falls back to filter-only ranking. Card reasons come from `filterReason`
  - **Ask the agent (alternative)**: `ChatPanel.tsx` with `useChat`, posting to `api/travel-agent.ts`. Gemini calls the `searchDestinations` tool, then `showDestinations` with 3-6 picks and a reason each, then streams a short reply. Follow-ups re-run the search. Cards and the "filters applied" chips are derived from the tool parts by `cardsFromMessages` and `latestSearchInput`
- Both endpoints go through `runSearch` in `api/_lib/search.ts` (zod schema `searchInputSchema`, query embedding, `search_destinations` RPC with the anon key)
- The Victor toggles ("travel history", "include visited countries") live in the panel state and are applied by the server in `buildSearchArgs`; the model cannot change them
- Models: `AGENT_MODELS` in `api/travel-agent.ts` is a fallback chain, because the free Gemini tier often returns 503/429 and some newer models hang. Check availability before changing it. This is why the filter panel must never depend on a language model
- Shared pure logic: `src/services/travelSearch.ts` (used by both the API and the UI, so it only uses relative imports)
- DB (Supabase project `supabase-travel-agent`): schema lives in `supabase/migrations/`. `search_destinations` is `SECURITY INVOKER` with `search_path = ''`; hard filters (cost range, flight hour range, months, categories, excluded countries), ranked by cosine similarity (blended 75/25 with the `travel_profiles` row `victor` when the taste toggle is on), category overlap as tie-break. `pgvector` lives in the `extensions` schema, so use `extensions.vector` and `operator(extensions.<=>)`. anon/authenticated can only SELECT
- Data: `supabase/seed/destinations.json` is the source of truth (keyed on `name` + `country_code`). `avg_cost_dkk` is an estimate per person for one week including flights from Copenhagen; `flight_hours` is one-way travel time. `supabase/seed/taste-profile.txt` is embedded as Victor's profile
- Scripts (local, `node --env-file=.env scripts/<name>.mjs`):
  - `generate-destinations.mjs` - regenerates the JSON with Gemini, region by region (AI-written estimates: review the diff)
  - `fetch-destination-images.mjs` - adds one Unsplash photo per destination (`UNSPLASH_ACCESS_KEY`). It scores 15 candidates by whether their own description names the place and lists weak matches; fix those with `QUERY_OVERRIDES` and `--only=Name`, then check them by eye. Images are hotlinked and credited on the card, as the Unsplash API guidelines require
  - `seed-destinations.mjs` - embeds and upserts the JSON and the taste profile (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). Removes rows that are no longer in the JSON
- Embedding model and dimensions must stay identical in `seed-destinations.mjs` and `api/_lib/embedding.ts`
- `budget_level` and `distance_category` are legacy columns, still filled by the seed script

## Environment

Keys are listed in `.env.example` (never read or print `.env`): `GMAIL_USER`, `GMAIL_PASS`, `VITE_MAPTILER_API_KEY`, `GEMINI_API_KEY`, `AI_GATEWAY_API`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `UNSPLASH_ACCESS_KEY`. Anything prefixed `VITE_` is shipped to the browser.

## Conventions

- All code, comments and site copy in English. No emojis in code or docs
- Tailwind only for new styling; inline styles only for dynamic values (progress widths, legend colors)
- PascalCase component files, camelCase hooks
- Keep components focused; no extra abstractions
- New routes need a matching rewrite in `vercel.json` and an entry in `public/sitemap.xml`
- `.github/copilot-instructions.md` holds older Copilot rules (it wrongly says React 19.2); this file wins where they differ
