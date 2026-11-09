-- Travel agent phase 1 (step 1 of 2): hybrid search RPC, taste profile, tighter grants,
-- vector extension out of public. Idempotent and non-destructive: existing rows are kept.
-- The old match_destinations RPC keeps working until 20261109231000_drop_match_destinations.sql
-- runs after the new frontend is deployed.

-- 1) Move pgvector out of the exposed public schema (advisor 0014).
-- Columns reference the type by OID, so stored data is unaffected.
create schema if not exists extensions;
do $$
begin
  if exists (select 1 from pg_extension e join pg_namespace n on n.oid = e.extnamespace
             where e.extname = 'vector' and n.nspname = 'public') then
    alter extension vector set schema extensions;
  end if;
end $$;

-- Keep the old RPC resolving the <=> operator until it is dropped.
do $$
begin
  if to_regprocedure('public.match_destinations(extensions.vector, double precision, integer)') is not null then
    alter function public.match_destinations(extensions.vector, double precision, integer)
      set search_path = public, extensions;
  end if;
end $$;

-- 2) Country code (ISO alpha-3) for exclusion of visited countries, backfilled for existing rows.
alter table public.travel_destinations add column if not exists country_code text;

update public.travel_destinations td
set country_code = m.code
from (values
  ('Albania', 'ALB'), ('Austria', 'AUT'), ('Canada', 'CAN'), ('Croatia', 'HRV'), ('Czech Republic', 'CZE'),
  ('France', 'FRA'), ('Georgia', 'GEO'), ('Germany', 'DEU'), ('Greece', 'GRC'), ('Hungary', 'HUN'),
  ('Iceland', 'ISL'), ('Indonesia', 'IDN'), ('Italy', 'ITA'), ('Japan', 'JPN'), ('Maldives', 'MDV'),
  ('Morocco', 'MAR'), ('Norway', 'NOR'), ('Portugal', 'PRT'), ('South Africa', 'ZAF'), ('South Korea', 'KOR'),
  ('Spain', 'ESP'), ('Sweden', 'SWE'), ('Turkey', 'TUR'), ('USA', 'USA'), ('United Kingdom', 'GBR')
) as m(country, code)
where td.country = m.country and td.country_code is null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'travel_destinations_name_country_code_key') then
    alter table public.travel_destinations
      add constraint travel_destinations_name_country_code_key unique (name, country_code);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'travel_destinations_budget_level_check') then
    alter table public.travel_destinations
      add constraint travel_destinations_budget_level_check check (budget_level between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'travel_destinations_distance_category_check') then
    alter table public.travel_destinations
      add constraint travel_destinations_distance_category_check check (distance_category in ('Short', 'Mid', 'Long'));
  end if;
end $$;

-- 3) Taste profile vectors (written by scripts/seed-destinations.mjs).
create table if not exists public.travel_profiles (
  id text primary key,
  embedding extensions.vector(768) not null
);
alter table public.travel_profiles enable row level security;

do $$
begin
  if not exists (select 1 from pg_policy where polname = 'Public read' and polrelid = 'public.travel_profiles'::regclass) then
    create policy "Public read" on public.travel_profiles for select to anon, authenticated using (true);
  end if;
end $$;

-- 4) Client roles may only read. RLS already blocks writes; this is defense in depth.
revoke insert, update, delete, truncate, references, trigger on public.travel_destinations from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.travel_profiles from anon, authenticated;
grant select on public.travel_profiles to anon, authenticated;

-- 5) Hybrid search: hard filters, then rank by semantic similarity.
-- With use_profile, similarity is blended 75/25 between the query and Victor's taste profile.
-- Without any vector, rows are ranked by category overlap.
create or replace function public.search_destinations(
  query_embedding extensions.vector(768) default null,
  use_profile boolean default false,
  min_budget_level integer default 1,
  max_budget_level integer default 4,
  distances text[] default null,
  categories text[] default null,
  exclude_country_codes text[] default null,
  match_count integer default 10
)
returns table (
  id uuid,
  name text,
  country text,
  country_code text,
  description text,
  category text[],
  budget_level integer,
  distance_category text,
  similarity double precision,
  category_overlap integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  with profile as (
    select p.embedding from public.travel_profiles p where use_profile and p.id = 'victor'
  ),
  candidates as (
    select
      td.*,
      case when query_embedding is null then null
           else 1 - (td.embedding operator(extensions.<=>) query_embedding) end as query_sim,
      (select 1 - (td.embedding operator(extensions.<=>) pr.embedding) from profile pr) as profile_sim,
      (select count(*) from unnest(td.category) c where c = any(coalesce(categories, '{}')))::integer as overlap
    from public.travel_destinations td
    where td.embedding is not null
      and td.budget_level between min_budget_level and max_budget_level
      and (distances is null or td.distance_category = any(distances))
      and (coalesce(cardinality(categories), 0) = 0 or td.category && categories)
      and (exclude_country_codes is null or td.country_code is null or not (td.country_code = any(exclude_country_codes)))
  )
  select
    c.id, c.name, c.country, c.country_code, c.description, c.category, c.budget_level, c.distance_category,
    case
      when c.query_sim is not null and c.profile_sim is not null then 0.75 * c.query_sim + 0.25 * c.profile_sim
      else coalesce(c.query_sim, c.profile_sim)
    end as similarity,
    c.overlap as category_overlap
  from candidates c
  order by similarity desc nulls last, c.overlap desc, c.name
  limit least(greatest(coalesce(match_count, 10), 1), 50);
$$;

revoke execute on function public.search_destinations(extensions.vector, boolean, integer, integer, text[], text[], text[], integer) from public;
grant execute on function public.search_destinations(extensions.vector, boolean, integer, integer, text[], text[], text[], integer) to anon, authenticated;
