-- Travel agent phase 2/3 (step 1 of 2): richer destination data and a search RPC for the agent.
-- Additive only. The previous search_destinations signature keeps working until
-- 20261111101000_drop_old_search_destinations.sql runs after the new frontend is deployed.

alter table public.travel_destinations
  add column if not exists best_months smallint[],
  add column if not exists avg_cost_dkk integer,
  add column if not exists flight_hours numeric(4,1),
  add column if not exists image_url text,
  add column if not exists image_credit text,
  add column if not exists image_credit_url text,
  add column if not exists image_page_url text;

-- avg_cost_dkk: estimate per person for one week including return flights from Copenhagen.
-- flight_hours: typical total travel time from Copenhagen.

-- Hybrid search for the agent: hard filters, then rank by semantic similarity.
-- With use_profile, similarity is blended 75/25 between the query and Victor's taste profile.
-- Without any vector, rows are ranked by category overlap, then cost.
create or replace function public.search_destinations(
  query_embedding extensions.vector(768) default null,
  use_profile boolean default false,
  max_cost_dkk integer default null,
  max_flight_hours numeric default null,
  months smallint[] default null,
  categories text[] default null,
  exclude_country_codes text[] default null,
  match_count integer default 12
)
returns table (
  id uuid,
  name text,
  country text,
  country_code text,
  description text,
  category text[],
  best_months smallint[],
  avg_cost_dkk integer,
  flight_hours numeric,
  image_url text,
  image_credit text,
  image_credit_url text,
  image_page_url text,
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
      and (max_cost_dkk is null or td.avg_cost_dkk <= max_cost_dkk)
      and (max_flight_hours is null or td.flight_hours <= max_flight_hours)
      and (coalesce(cardinality(months), 0) = 0 or td.best_months && months)
      and (coalesce(cardinality(categories), 0) = 0 or td.category && categories)
      and (exclude_country_codes is null or td.country_code is null or not (td.country_code = any(exclude_country_codes)))
  )
  select
    c.id, c.name, c.country, c.country_code, c.description, c.category,
    c.best_months, c.avg_cost_dkk, c.flight_hours,
    c.image_url, c.image_credit, c.image_credit_url, c.image_page_url,
    case
      when c.query_sim is not null and c.profile_sim is not null then 0.75 * c.query_sim + 0.25 * c.profile_sim
      else coalesce(c.query_sim, c.profile_sim)
    end as similarity,
    c.overlap as category_overlap
  from candidates c
  order by similarity desc nulls last, c.overlap desc, c.avg_cost_dkk nulls last, c.name
  limit least(greatest(coalesce(match_count, 12), 1), 30);
$$;

revoke execute on function public.search_destinations(extensions.vector, boolean, integer, numeric, smallint[], text[], text[], integer) from public;
grant execute on function public.search_destinations(extensions.vector, boolean, integer, numeric, smallint[], text[], text[], integer) to anon, authenticated;
