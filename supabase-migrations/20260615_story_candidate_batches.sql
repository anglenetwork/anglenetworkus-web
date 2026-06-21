begin;

-- Batch-level orchestration tracking for staged ingestion:
-- Fetcher -> AI worker -> Gunner worker.

create table if not exists public.story_candidate_batches (
  id uuid primary key default gen_random_uuid(),
  run_id text not null,
  run_label text,
  status text not null default 'fetching',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  scraped_count integer not null default 0,
  normalized_valid_count integer not null default 0,
  inserted_count integer not null default 0,
  duplicate_count integer not null default 0,
  rejected_count integer not null default 0,
  ai_processed_count integer not null default 0,
  ai_failed_count integer not null default 0,
  gunner_drafted_count integer not null default 0,
  gunner_failed_count integer not null default 0,
  workflow_run_id text,
  metadata jsonb not null default '{}'::jsonb,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.story_candidate_batches is
  'Batch rows for staged ingestion orchestration and progress tracking.';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'story_candidate_batches_status_check'
      and conrelid = 'public.story_candidate_batches'::regclass
  ) then
    alter table public.story_candidate_batches
      add constraint story_candidate_batches_status_check
      check (
        status in (
          'fetching',
          'fetched',
          'ai_processing',
          'ai_completed',
          'drafting',
          'completed',
          'failed'
        )
      );
  end if;
end $$;

alter table public.story_candidates
  add column if not exists ingestion_batch_id uuid references public.story_candidate_batches(id) on delete set null,
  add column if not exists ingestion_run_id text;

create index if not exists story_candidates_batch_status_idx
  on public.story_candidates (ingestion_batch_id, status);

create index if not exists story_candidates_run_created_idx
  on public.story_candidates (ingestion_run_id, created_at);

create index if not exists story_candidate_batches_run_created_idx
  on public.story_candidate_batches (run_id, created_at);

create index if not exists story_candidate_batches_status_created_idx
  on public.story_candidate_batches (status, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_story_candidate_batches_set_updated_at on public.story_candidate_batches;
create trigger trg_story_candidate_batches_set_updated_at
before update on public.story_candidate_batches
for each row
execute function public.set_updated_at();

commit;
