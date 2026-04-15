begin;

-- Customer mapping
create table if not exists public.stripe_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Subscription mapping (Pro)
create table if not exists public.stripe_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_subscription_id text not null unique,
  price_id text,
  status text,
  current_period_end timestamptz,
  cancel_at_period_end boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stripe_subscriptions_user_id_idx
  on public.stripe_subscriptions (user_id);

-- Webhook idempotency
create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  created_at timestamptz not null default now()
);

-- Lock these tables down (server-only via service role)
alter table public.stripe_customers enable row level security;
alter table public.stripe_subscriptions enable row level security;
alter table public.stripe_webhook_events enable row level security;

-- No RLS policies on purpose (server-only access via service role)

commit;
