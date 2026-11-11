-- Travel agent as its own site: "Top destinations" counters, and coordinates in search results.

-- 1) How often each destination was suggested (shown as a result) and opened. No visitor data is stored.
create table if not exists public.travel_destination_stats (
  destination_id uuid primary key references public.travel_destinations(id) on delete cascade,
  suggested_count bigint not null default 0,
  opened_count bigint not null default 0
);
alter table public.travel_destination_stats enable row level security;

do $$
begin
  if not exists (select 1 from pg_policy where polname = 'Public read' and polrelid = 'public.travel_destination_stats'::regclass) then
    create policy "Public read" on public.travel_destination_stats for select to anon, authenticated using (true);
  end if;
end $$;

revoke all on public.travel_destination_stats from anon, authenticated;
grant select on public.travel_destination_stats to anon, authenticated;

-- Counters are only written by the API with the service role, never by the browser.
create or replace function public.record_destination_events(destination_ids uuid[], event text)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.travel_destination_stats (destination_id, suggested_count, opened_count)
  select d.id, (event = 'suggested')::int, (event = 'opened')::int
  from public.travel_destinations d
  where d.id = any(destination_ids) and event in ('suggested', 'opened')
  on conflict (destination_id) do update set
    suggested_count = public.travel_destination_stats.suggested_count + excluded.suggested_count,
    opened_count = public.travel_destination_stats.opened_count + excluded.opened_count;
$$;

revoke execute on function public.record_destination_events(uuid[], text) from public, anon, authenticated;
grant execute on function public.record_destination_events(uuid[], text) to service_role;

-- 2) search_destinations also returns coordinates. The return type changes, so the function is recreated.
drop function if exists public.search_destinations(extensions.vector, boolean, integer, integer, numeric, numeric, smallint[], text[], text[], double precision, double precision, uuid, integer);

create or replace function public.search_destinations(
  query_embedding extensions.vector(768) default null,
  use_profile boolean default false,
  min_cost_dkk integer default null,
  max_cost_dkk integer default null,
  min_flight_hours numeric default null,
  max_flight_hours numeric default null,
  months smallint[] default null,
  categories text[] default null,
  exclude_country_codes text[] default null,
  origin_lat double precision default null,
  origin_lng double precision default null,
  exclude_id uuid default null,
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
  latitude double precision,
  longitude double precision,
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
  located as (
    -- Travel time: the curated value from Copenhagen, or an estimate from another origin
    -- (great-circle distance at 800 km/h plus 1.5 hours for airports and connections).
    select
      td.*,
      case
        when origin_lat is null or origin_lng is null or td.latitude is null or td.longitude is null then td.flight_hours
        else round((
          2 * 6371 * asin(sqrt(
            power(sin(radians(td.latitude - origin_lat) / 2), 2)
            + cos(radians(origin_lat)) * cos(radians(td.latitude)) * power(sin(radians(td.longitude - origin_lng) / 2), 2)
          )) / 800 + 1.5
        )::numeric, 1)
      end as travel_hours
    from public.travel_destinations td
  ),
  candidates as (
    select
      td.*,
      case when query_embedding is null then null
           else 1 - (td.embedding operator(extensions.<=>) query_embedding) end as query_sim,
      (select 1 - (td.embedding operator(extensions.<=>) pr.embedding) from profile pr) as profile_sim,
      (select count(*) from unnest(td.category) c where c = any(coalesce(categories, '{}')))::integer as overlap
    from located td
    where td.embedding is not null
      and (exclude_id is null or td.id <> exclude_id)
      and (min_cost_dkk is null or td.avg_cost_dkk >= min_cost_dkk)
      and (max_cost_dkk is null or td.avg_cost_dkk <= max_cost_dkk)
      and (min_flight_hours is null or td.travel_hours > min_flight_hours)
      and (max_flight_hours is null or td.travel_hours <= max_flight_hours)
      and (coalesce(cardinality(months), 0) = 0 or td.best_months && months)
      and (coalesce(cardinality(categories), 0) = 0 or td.category && categories)
      and (exclude_country_codes is null or td.country_code is null or not (td.country_code = any(exclude_country_codes)))
  )
  select
    c.id, c.name, c.country, c.country_code, c.description, c.category,
    c.best_months, c.avg_cost_dkk, c.travel_hours, c.latitude, c.longitude,
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

revoke execute on function public.search_destinations(extensions.vector, boolean, integer, integer, numeric, numeric, smallint[], text[], text[], double precision, double precision, uuid, integer) from public;
grant execute on function public.search_destinations(extensions.vector, boolean, integer, integer, numeric, numeric, smallint[], text[], text[], double precision, double precision, uuid, integer) to anon, authenticated;
