-- Add 'processed' status for AI-processed candidates awaiting Sanity draft creation.
-- Safe to run repeatedly; does not recreate the enum or table.
alter type public.story_candidate_status add value if not exists 'processed';
