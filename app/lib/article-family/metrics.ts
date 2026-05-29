import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { EDITORIAL_RANKING_TYPES } from "@/app/lib/article-family/ranking-policy";

export const ARTICLE_METRIC_TYPES = [
  "post",
  "opinion",
  "analysis",
  "sponsored",
] as const;

export type ArticleMetricType = (typeof ARTICLE_METRIC_TYPES)[number];

export type ArticleMetricsSnapshot = {
  viewsAll: number;
  views7d: number;
  views30d: number;
  lastViewedAt: string | null;
};

export type ArticleRankingRow = {
  articleId: string;
  articleType: ArticleMetricType;
  viewsAll: number;
  views7d: number;
  views30d: number;
  lastViewedAt: string | null;
};

function isArticleMetricType(t: string): t is ArticleMetricType {
  return (ARTICLE_METRIC_TYPES as readonly string[]).includes(t);
}

type RankingRowDb = {
  article_id: string;
  article_type: string;
  views_all: number | string | null;
  views_7d: number | string | null;
  views_30d: number | string | null;
  last_viewed_at: string | null;
};

function mapRankingRow(row: RankingRowDb): ArticleRankingRow {
  return {
    articleId: row.article_id,
    articleType: row.article_type as ArticleMetricType,
    viewsAll: Number(row.views_all ?? 0),
    views7d: Number(row.views_7d ?? 0),
    views30d: Number(row.views_30d ?? 0),
    lastViewedAt: row.last_viewed_at,
  };
}

export async function recordArticleView({
  articleId,
  articleType,
  viewedAt,
}: {
  articleId: string;
  articleType: ArticleMetricType;
  viewedAt?: Date;
}): Promise<void> {
  if (!isArticleMetricType(articleType)) {
    throw new Error("invalid articleType");
  }
  const { error } = await supabaseAdmin.rpc("increment_article_view", {
    p_article_id: articleId,
    p_article_type: articleType,
    p_viewed_at: (viewedAt ?? new Date()).toISOString(),
  });
  if (error) throw error;
}

export async function getArticleMetrics(
  articleId: string,
): Promise<ArticleMetricsSnapshot | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("article_metrics_rankings")
      .select("views_all, views_7d, views_30d, last_viewed_at")
      .eq("article_id", articleId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      viewsAll: Number(data.views_all ?? 0),
      views7d: Number(data.views_7d ?? 0),
      views30d: Number(data.views_30d ?? 0),
      lastViewedAt: data.last_viewed_at,
    };
  } catch {
    return null;
  }
}

export async function getMostReadEditorial({
  limit,
}: {
  limit: number;
}): Promise<ArticleRankingRow[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("article_metrics_rankings")
      .select(
        "article_id, article_type, views_all, views_7d, views_30d, last_viewed_at",
      )
      .in("article_type", [...EDITORIAL_RANKING_TYPES])
      .order("views_7d", { ascending: false })
      .order("last_viewed_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((row) => mapRankingRow(row as RankingRowDb));
  } catch {
    return [];
  }
}

export async function getMostReadPosts({
  limit,
}: {
  limit: number;
}): Promise<ArticleRankingRow[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("article_metrics_rankings")
      .select(
        "article_id, article_type, views_all, views_7d, views_30d, last_viewed_at",
      )
      .eq("article_type", "post")
      .order("views_7d", { ascending: false })
      .order("last_viewed_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((row) => mapRankingRow(row as RankingRowDb));
  } catch {
    return [];
  }
}

export async function getMostReadByType({
  type,
  limit,
}: {
  type: ArticleMetricType;
  limit: number;
}): Promise<ArticleRankingRow[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("article_metrics_rankings")
      .select(
        "article_id, article_type, views_all, views_7d, views_30d, last_viewed_at",
      )
      .eq("article_type", type)
      .order("views_7d", { ascending: false })
      .order("last_viewed_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((row) => mapRankingRow(row as RankingRowDb));
  } catch {
    return [];
  }
}

/** Batch metrics for membership-filtered ranking (category / tag). */
export async function fetchRankingRowsForArticleIds(
  articleIds: string[],
): Promise<Map<string, ArticleRankingRow>> {
  if (articleIds.length === 0) return new Map();

  try {
    const { data, error } = await supabaseAdmin
      .from("article_metrics_rankings")
      .select(
        "article_id, article_type, views_all, views_7d, views_30d, last_viewed_at",
      )
      .in("article_id", articleIds);

    if (error) throw error;

    const map = new Map<string, ArticleRankingRow>();
    for (const row of data ?? []) {
      const r = mapRankingRow(row as RankingRowDb);
      map.set(r.articleId, r);
    }
    return map;
  } catch {
    return new Map();
  }
}

export function orderDocumentsByIds<T extends { _id: string }>(
  docs: T[],
  ids: string[],
): T[] {
  const byId = new Map(docs.map((d) => [d._id, d]));
  return ids.map((id) => byId.get(id)).filter((d): d is T => d != null);
}

export function sortIdsByRankingThenPublishedAt<
  T extends { _id: string; publishedAt?: string | null },
>(items: T[], metrics: Map<string, ArticleRankingRow>): T[] {
  return items.toSorted((a, b) => {
    const ma = metrics.get(a._id);
    const mb = metrics.get(b._id);
    const va = ma?.views7d ?? 0;
    const vb = mb?.views7d ?? 0;
    if (va !== vb) return vb - va;
    const la = ma?.lastViewedAt ? Date.parse(ma.lastViewedAt) : 0;
    const lb = mb?.lastViewedAt ? Date.parse(mb.lastViewedAt) : 0;
    if (la !== lb) return lb - la;
    const pa = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const pb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return pb - pa;
  });
}

export function isArticleMetricTypeString(s: string): s is ArticleMetricType {
  return isArticleMetricType(s);
}
