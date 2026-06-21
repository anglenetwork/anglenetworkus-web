-- Rolling 10-day view window for category most-read (UTC calendar days).
create or replace view public.article_metrics_rankings_10d as
select
  article_id,
  article_type,
  sum(views)::bigint as views_10d,
  max(last_viewed_at) as last_viewed_at
from public.article_metrics_daily
where view_date >= ((timezone('UTC', now()))::date - interval '9 days')
group by article_id, article_type;
