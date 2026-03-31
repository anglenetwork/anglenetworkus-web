-- 20260107_subscriptions_entitlements.sql

begin;

-- 1) Ensure entitlements can't duplicate keys per user
create unique index if not exists entitlements_user_key_unique
  on public.entitlements (user_id, key);

-- Helpful for queries like "key like 'tier:%'"
create index if not exists entitlements_key_idx
  on public.entitlements (key);

create index if not exists entitlements_user_id_idx
  on public.entitlements (user_id);

-- 2) RLS (users can read their entitlements, but not write them from the client)
alter table public.entitlements enable row level security;

drop policy if exists "read own entitlements" on public.entitlements;

create policy "read own entitlements"
on public.entitlements
for select
using (auth.uid() = user_id);

-- No insert/update/delete policies → blocked for anon/authenticated.
-- Writes happen via SECURITY DEFINER functions (or service_role later).

-- 3) Create set_updated_at() function if it doesn't exist, then add trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_entitlements_updated_at on public.entitlements;

create trigger trg_entitlements_updated_at
before update on public.entitlements
for each row
execute function public.set_updated_at();

-- 4) When a profile is created, bootstrap free tier.
create or replace function public.bootstrap_free_tier()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.entitlements (user_id, key, active, valid_until, source)
  values (new.id, 'tier:free', true, null, 'system')
  on conflict (user_id, key)
  do update set
    active = true,
    valid_until = null,
    source = 'system',
    updated_at = now();

  return new;
end;
$$;

revoke all on function public.bootstrap_free_tier() from public;

drop trigger if exists trg_profiles_bootstrap_free_tier on public.profiles;

create trigger trg_profiles_bootstrap_free_tier
after insert on public.profiles
for each row
execute function public.bootstrap_free_tier();

-- 5) RPC to "purchase" a subscription (manual for now; Stripe later).
create or replace function public.purchase_subscription(p_tier text, p_cycle text default null)
returns table (tier text, valid_until timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_key text;
  v_valid_until timestamptz;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  -- always ensure free exists
  insert into public.entitlements (user_id, key, active, valid_until, source)
  values (v_uid, 'tier:free', true, null, 'system')
  on conflict (user_id, key)
  do update set
    active = true,
    valid_until = null,
    source = 'system',
    updated_at = now();

  if p_tier = 'pro' then
    if p_cycle not in ('month', 'year') then
      raise exception 'Invalid cycle for pro. Use month|year';
    end if;

    v_key := 'tier:pro';
    v_valid_until := now() + case when p_cycle = 'month' then interval '1 month' else interval '1 year' end;

  elsif p_tier = 'lifetime' then
    v_key := 'tier:lifetime';
    v_valid_until := now() + interval '99 years';

  elsif p_tier = 'free' then
    -- downgrade/reset
    v_key := 'tier:free';
    v_valid_until := null;

  else
    raise exception 'Invalid tier. Use free|pro|lifetime';
  end if;

  insert into public.entitlements (user_id, key, active, valid_until, source)
  values (v_uid, v_key, true, v_valid_until, 'manual')
  on conflict (user_id, key)
  do update set
    active = true,
    valid_until = excluded.valid_until,
    source = 'manual',
    updated_at = now();

  -- If user buys lifetime, pro isn't needed (optional cleanup)
  if p_tier = 'lifetime' then
    update public.entitlements
      set active = false, updated_at = now()
    where user_id = v_uid
      and key = 'tier:pro';
  end if;

  return query select p_tier, v_valid_until;
end;
$$;

revoke all on function public.purchase_subscription(text, text) from public;
grant execute on function public.purchase_subscription(text, text) to authenticated;

-- 6) Helper RPC to compute current tier in one call.
create or replace function public.current_user_tier()
returns table (tier text, valid_until timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  with e as (
    select key, valid_until
    from public.entitlements
    where user_id = auth.uid()
      and active = true
      and (valid_until is null or valid_until > now())
      and key in ('tier:free', 'tier:pro', 'tier:lifetime')
  )
  select
    case
      when exists (select 1 from e where key = 'tier:lifetime') then 'lifetime'
      when exists (select 1 from e where key = 'tier:pro') then 'pro'
      else 'free'
    end as tier,
    (select valid_until from e where key in ('tier:lifetime','tier:pro') order by valid_until desc limit 1) as valid_until;
$$;

revoke all on function public.current_user_tier() from public;
grant execute on function public.current_user_tier() to authenticated;

commit;

