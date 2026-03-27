# Project Rules: React 19.2 Frontend

## Strictly NO Tests
- NEVER suggest creating test files (Vitest, Jest, Cypress, etc.).
- If asked to create a component, focus ONLY on the implementation and styling.
- Ignore any "Best Practices" related to Test-Driven Development (TDD).

## ⚡ React 19.2 Architecture
- **Ref Handling**: Pass `ref` directly as a prop. Do NOT use `forwardRef`.
- **Context**: Use `<MyContext>` directly instead of `<MyContext.Provider>`.
- **New Hooks**: Use `use()` for promises and `useActionState` for forms.
- **Visibility**: Use the `<Activity>` component to manage UI state preservation.
- **Events**: Use `useEffectEvent()` for non-reactive logic inside effects.

## 🛠 Tech Stack Details
- **Framework**: React 19.2 (Vite-based).
- **Styling**: Tailwind CSS only. No CSS modules or inline styles.
- **Build**: Manual build management. Do not suggest running dev/build commands.

## 🧭 Project Knowledge (Portfolio + Travel)
- **Portfolio Structure**: Primary pages are the landing page and travel map/stats. Globe map uses MapTiler, and travel statistics are derived from `visitedCountries`.
- **Travel Data Source of Truth**: All travel data lives in `visitedCountries` (continent-nested data). Any updates to stats should be derived from this file only.
- **Stats Pipeline**: `travelStats` is derived data for charts (counts, yearly visits, top regions, top countries, coverage). Do not hardcode duplicated stats or mappings elsewhere.
- **Flags**: Countries include a `flag` field used in Top Countries, Recent Trips, and Country Details. Keep flags updated alongside country entries.
- **UI Expectations**: Globe drawer is compact on mobile and should avoid overflow/extra whitespace. Travel stats page uses Recharts for charts.
- **Routing**: `react-router-dom` routes are defined in `App.tsx` for `/` (landing), `/globe`, and `/stats`.
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
- Use PascalCase for component files and camelCase for hooks.
- Always include `use client` or `use server` directives where necessary.
- Use `declare(strict_types=1)` logic in spirit (TypeScript strict mode).
