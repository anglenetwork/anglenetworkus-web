begin;

-- 1) Backfill: ensure all existing profiles have tier:free
insert into public.entitlements (user_id, key, active, valid_until, source)
select
  p.id as user_id,
  'tier:free' as key,
  true as active,
  null as valid_until,
  'backfill' as source
from public.profiles p
where not exists (
  select 1
  from public.entitlements e
  where e.user_id = p.id
    and e.key = 'tier:free'
);

-- 2) RPC: ensure_free_tier() for current user (idempotent)
create or replace function public.ensure_free_tier()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.entitlements (user_id, key, active, valid_until, source)
  values (v_uid, 'tier:free', true, null, 'system')
  on conflict (user_id, key)
  do update set
    active = true,
    valid_until = null,
    source = 'system',
    updated_at = now();
end;
$$;

revoke all on function public.ensure_free_tier() from public;
grant execute on function public.ensure_free_tier() to authenticated;

commit;

