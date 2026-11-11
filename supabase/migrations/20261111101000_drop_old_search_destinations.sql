-- Travel agent phase 2/3 (step 2 of 2): run only after the frontend using /api/travel-agent is deployed.
drop function if exists public.search_destinations(extensions.vector, boolean, integer, integer, text[], text[], text[], integer);
