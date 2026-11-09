-- Travel agent phase 1 (step 2 of 2): run only after the frontend using search_destinations is deployed.
drop function if exists public.match_destinations(extensions.vector, double precision, integer);
