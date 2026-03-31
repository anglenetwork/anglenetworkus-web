begin;

-- Article metrics: daily buckets + rolling totals (Supabase source of truth for ranking)

create table if not exists public.article_metrics_daily (
  article_id text not null,
  article_type text not null,
  view_date date not null,
  views bigint not null default 0,
  last_viewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (article_id, view_date),
  constraint article_metrics_daily_article_type_check check (
    article_type in ('post', 'opinion', 'analysis', 'sponsored')
  )
);

create index if not exists article_metrics_daily_type_date_idx
  on public.article_metrics_daily (article_type, view_date);

create index if not exists article_metrics_daily_view_date_idx
  on public.article_metrics_daily (view_date);

create index if not exists article_metrics_daily_article_id_idx
  on public.article_metrics_daily (article_id);

create table if not exists public.article_metrics_totals (
  article_id text primary key,
  article_type text not null,
  views_all bigint not null default 0,
  last_viewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint article_metrics_totals_article_type_check check (
    article_type in ('post', 'opinion', 'analysis', 'sponsored')
  )
);

create index if not exists article_metrics_totals_type_views_idx
  on public.article_metrics_totals (article_type, views_all desc);

create index if not exists article_metrics_totals_last_viewed_idx
  on public.article_metrics_totals (last_viewed_at desc nulls last);

alter table public.article_metrics_daily enable row level security;
alter table public.article_metrics_totals enable row level security;

-- Rolling windows (UTC calendar days)
create or replace view public.article_metrics_rankings_7d as
select
  article_id,
  article_type,
  sum(views)::bigint as views_7d,
  max(last_viewed_at) as last_viewed_at
from public.article_metrics_daily
where view_date >= ((timezone('UTC', now()))::date - interval '6 days')
group by article_id, article_type;

create or replace view public.article_metrics_rankings_30d as
select
  article_id,
  article_type,
  sum(views)::bigint as views_30d,
  max(last_viewed_at) as last_viewed_at
from public.article_metrics_daily
where view_date >= ((timezone('UTC', now()))::date - interval '29 days')
group by article_id, article_type;

create or replace view public.article_metrics_rankings as
select
  t.article_id,
  t.article_type,
  t.views_all,
  coalesce(r7.views_7d, 0)::bigint as views_7d,
  coalesce(r30.views_30d, 0)::bigint as views_30d,
  t.last_viewed_at,
  t.updated_at
from public.article_metrics_totals t
left join public.article_metrics_rankings_7d r7
  on t.article_id = r7.article_id and t.article_type = r7.article_type
left join public.article_metrics_rankings_30d r30
  on t.article_id = r30.article_id and t.article_type = r30.article_type;

create or replace function public.increment_article_view(
  p_article_id text,
  p_article_type text,
  p_viewed_at timestamptz default now()
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_date date;
begin
  if p_article_id is null or btrim(p_article_id) = '' then
    raise exception 'article_id required';
  end if;

  if p_article_type is null or p_article_type not in ('post', 'opinion', 'analysis', 'sponsored') then
    raise exception 'invalid article_type';
  end if;

  v_date := (p_viewed_at at time zone 'UTC')::date;

  insert into public.article_metrics_daily (
    article_id, article_type, view_date, views, last_viewed_at
  )
  values (p_article_id, p_article_type, v_date, 1, p_viewed_at)
  on conflict (article_id, view_date) do update
  set
    views = public.article_metrics_daily.views + 1,
    last_viewed_at = greatest(
      coalesce(public.article_metrics_daily.last_viewed_at, p_viewed_at),
      p_viewed_at
    ),
    updated_at = now();

  insert into public.article_metrics_totals (
    article_id, article_type, views_all, last_viewed_at
  )
  values (p_article_id, p_article_type, 1, p_viewed_at)
  on conflict (article_id) do update
  set
    views_all = public.article_metrics_totals.views_all + 1,
    last_viewed_at = greatest(
      coalesce(public.article_metrics_totals.last_viewed_at, p_viewed_at),
      p_viewed_at
    ),
    updated_at = now();
end;
$$;

revoke all on function public.increment_article_view(text, text, timestamptz) from public;
grant execute on function public.increment_article_view(text, text, timestamptz) to service_role;

commit;
