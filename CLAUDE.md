# CLAUDE.md

Personal portfolio for Victor Hanert (victorhanert.com). Vite + React SPA deployed on Vercel, with Vercel edge functions in `api/`.

## Commands

- `npm install` - install deps (npm is the source of truth: `package-lock.json`. `bun.lockb` is stale)
- `npm run dev` - Vite dev server. Note: `api/*` functions do not run under plain Vite; use `vercel dev` to exercise them locally
- `npm run build` - production build to `dist/`
- `npm run lint` - ESLint
- `npx tsc -p tsconfig.app.json --noEmit` - typecheck (no `typecheck` script exists)
- No test runner is configured yet.

## Stack

- React 18.3 (not 19), TypeScript, Vite 7, `react-router-dom` v6
- Tailwind CSS + shadcn/ui (`src/components/ui/*`, generated, avoid hand-editing)
- `styled-components` only in `StyledText.tsx` and `Switch.tsx` (legacy, do not spread it)
- framer-motion, Recharts, tsparticles, MapTiler SDK
- AI: Gemini via `@google/generative-ai` (chatbot + embeddings)
- Supabase (pgvector) for the travel agent

## Layout

- `src/App.tsx` - routes: `/`, `/globe`, `/stats`, `/travel-agent`, `/admin/seed`. Providers: React Query, Tooltip, both toasters, Vercel Analytics + SpeedInsights
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
  - `embed.ts` - text to 768-dim embedding (Gemini, mock fallback for local requests)
  - `seed.ts` - seeds Supabase `travel_destinations`, protected by `SEED_ADMIN_TOKEN`

## Globe (`/globe`)

- MapTiler, key from `VITE_MAPTILER_API_KEY`
- `countriesData` vector source, `administrative` source-layer at `level` 0, feature-state coloring
- Keep the `sourcedata` handler: it refreshes states for small countries
- Feature lookup: alpha-3 from feature properties first, then numeric mapping fallback
- Legend swatches share the visit-count bins with the map fill; keep them in sync
- Drawer must stay compact on mobile (no overflow / extra whitespace)

## Travel agent (`/travel-agent`) - work in progress

- UI: `src/pages/TravelAgent.tsx` + `src/components/travel-agent/*` (PreferencePanel, ResultsWorkspace, DestinationCard, AnalysisLoader). Analysis steps are fake 900 ms delays
- Logic: `src/services/travelService.ts` (filters, trip duration to distance mapping, visited-country exclusion, demo results when Supabase is not configured)
- `embedService.ts` calls `/api/embed`; `travelSeeder.ts` + `src/pages/AdminSeed.tsx` + `/api/seed` populate the DB
- DB: `supabase/match_destinations.sql` defines the `match_destinations(query_embedding vector(768), match_threshold, match_count)` RPC. The script truncates `travel_destinations`, so never run it against data you want to keep
- Embeddings are normalized to 768 dims (`to768Dimensions` in `api/embed.ts`)
- Known open issue: the `adminSeedEnabled` guard in `App.tsx` is commented out, so `/admin/seed` is routed in production

## Environment

Keys are listed in `.env.example` (never read or print `.env`): `GMAIL_USER`, `GMAIL_PASS`, `VITE_MAPTILER_API_KEY`, `GEMINI_API_KEY`, `AI_GATEWAY_API`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SEED_ADMIN_TOKEN`, `VITE_SEED_ADMIN_TOKEN`, `VITE_ENABLE_ADMIN_SEED`. Anything prefixed `VITE_` is shipped to the browser.

## Conventions

- All code, comments and site copy in English. No emojis in code or docs
- Tailwind only for new styling; inline styles only for dynamic values (progress widths, legend colors)
- PascalCase component files, camelCase hooks
- Keep components focused; no extra abstractions
- New routes need a matching rewrite in `vercel.json` and an entry in `public/sitemap.xml`
- `.github/copilot-instructions.md` holds older Copilot rules (it wrongly says React 19.2); this file wins where they differ
