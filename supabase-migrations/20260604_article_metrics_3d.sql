-- Rolling 3-day view window for homepage most-read surfaces (UTC calendar days).
create or replace view public.article_metrics_rankings_3d as
select
  article_id,
  article_type,
  sum(views)::bigint as views_3d,
  max(last_viewed_at) as last_viewed_at
from public.article_metrics_daily
where view_date >= ((timezone('UTC', now()))::date - interval '2 days')
group by article_id, article_type;
