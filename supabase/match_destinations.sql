create extension if not exists vector;

-- 1) Drop existing function signature so schema cache can refresh cleanly.
drop function if exists public.match_destinations(vector, float, int);

-- 2) Reset table data and enforce 768-dim vector column.
truncate table public.travel_destinations;
alter table public.travel_destinations
alter column embedding type vector(768);

-- 3) Recreate RPC with matching 768 input shape.
create or replace function public.match_destinations(
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  country text,
  description text,
  similarity float
)
language sql
stable
set search_path = public
as $$
  select
    td.id,
    td.name,
    td.country,
    td.description,
    1 - (td.embedding <=> query_embedding) as similarity
  from public.travel_destinations as td
  where td.embedding is not null
    and 1 - (td.embedding <=> query_embedding) > match_threshold
  order by td.embedding <=> query_embedding
  limit match_count;
$$;

-- 4) Re-grant execute to client roles.
grant execute on function public.match_destinations(vector, float, int) to anon, authenticated;
