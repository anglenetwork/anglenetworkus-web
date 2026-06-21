begin;

-- Internal ingestion queue for normalized scraped stories.
-- This table is server-only and should be accessed via service role scripts.

do $$
begin
  create type public.story_candidate_status as enum (
    'pending',
    'processing',
    'draft_created',
    'failed',
    'rejected',
    'skipped_duplicate'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.story_candidates (
  id uuid primary key default gen_random_uuid(),

  source_key text not null,
  source_name text not null,
  source_url text not null,
  title text not null,
  excerpt text,
  body text not null,
  category text not null,

  published_at timestamptz,
  scraped_at timestamptz not null,

  raw_payload jsonb not null,

  status public.story_candidate_status not null default 'pending',
  attempt_count integer not null default 0,
  last_error text,

  openai_response jsonb,
  processed_payload jsonb,
  sanity_document_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.story_candidates is
  'Internal ingestion queue for normalized story candidates. Server-side scripts only.';
comment on column public.story_candidates.raw_payload is
  'Original normalized candidate payload captured before downstream processing.';

create unique index if not exists story_candidates_source_url_key
  on public.story_candidates (source_url);

create index if not exists story_candidates_status_created_idx
  on public.story_candidates (status, created_at);

create index if not exists story_candidates_source_key_created_idx
  on public.story_candidates (source_key, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_story_candidates_set_updated_at on public.story_candidates;
create trigger trg_story_candidates_set_updated_at
before update on public.story_candidates
for each row
execute function public.set_updated_at();

alter table public.story_candidates enable row level security;

-- Intentionally no RLS policies for anon/authenticated.
-- Service role is expected to access this internal queue.

commit;
