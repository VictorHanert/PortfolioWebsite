# Project Rules: React 18.3 Frontend

`CLAUDE.md` in the repo root is the up-to-date project guide. Where this file and `CLAUDE.md` differ, `CLAUDE.md` wins.

## Tests
- Vitest is set up (`npm test`) and kept minimal: pure logic only.
- Do not add component or end-to-end tests unless asked.

## ⚡ React 18.3 Architecture
- The project runs React 18.3, not 19.
- Do not use React 19 APIs: `use()`, `useActionState`, `<Activity>`, `useEffectEvent()`, `ref` as a plain prop, or `<MyContext>` as a provider.
- Use `forwardRef` and `<MyContext.Provider>`.

## 🛠 Tech Stack Details
- **Framework**: React 18.3 (Vite-based).
- **Styling**: Tailwind CSS only. No CSS modules or inline styles.
- **Build**: Manual build management. Do not suggest running dev/build commands.

## 🧭 Project Knowledge (Portfolio + Travel)
- **Portfolio Structure**: Primary pages are the landing page and travel map/stats. Globe map uses MapTiler, and travel statistics are derived from `visitedCountries`.
- **Travel Data Source of Truth**: All travel data lives in `visitedCountries` (continent-nested data). Any updates to stats should be derived from this file only.
- **Stats Pipeline**: `travelStats` is derived data for charts (counts, yearly visits, top regions, top countries, coverage). Do not hardcode duplicated stats or mappings elsewhere.
- **Flags**: Countries include a `flag` field used in Top Countries, Recent Trips, and Country Details. Keep flags updated alongside country entries.
- **UI Expectations**: Globe drawer is compact on mobile and should avoid overflow/extra whitespace. Travel stats page uses Recharts for charts.
- **Routing**: `react-router-dom` routes are defined in `App.tsx` for `/` (landing), `/globe`, and `/stats` and `/travel-agent`.
- **Global Providers**: App wraps UI with React Query (`QueryClientProvider`), Tooltip provider, and both toast systems (`Toaster` + `Sonner`).
- **Chat Bot**: `ChatBotButton` + `ChatBot` are mounted in `App.tsx` with starter questions; keep the welcome messaging in that component.
- **Analytics**: Vercel `Analytics` and `SpeedInsights` are enabled in `App.tsx`.
- **MapTiler**: Map key is read from `VITE_MAPTILER_API_KEY`.
- **Globe Map Data**: MapTiler uses the `countriesData` vector source with the `administrative` source-layer at `level` 0 and feature-state coloring; keep the `sourcedata` handler to refresh states for small countries.
- **Country ID Matching**: Globe feature lookups resolve alpha-3 IDs from feature properties first, then fall back to numeric ID mapping.
- **Globe Legend Colors**: Legend swatches use the same visit-count bins as the map fill colors; keep them in sync.
- **Stats Charts**: Travel stats charts in `TravelStats.tsx` use Recharts with `travelStats` only.
- **Inline Styles**: Avoid new inline styles; use them only when needed for dynamic values (e.g., progress widths or legend colors).

## 📝 Coding Standard
- Always write text, comments and code in English.
- Never use emojis anywhere in the codebase, including comments, variable names, or documentation. Unless i specifically ask you to use emojis, do not include them in any code or comments.
- Use PascalCase for component files and camelCase for hooks.
- Always include `use client` or `use server` directives where necessary.
- Use `declare(strict_types=1)` logic in spirit (TypeScript strict mode).
- Avoid unnecessary abstractions; keep components focused and straightforward.
- Keep the codebase clean and organized, following the existing project structure and conventions.
- Simple and readable code is preferred over clever or complex solutions.
