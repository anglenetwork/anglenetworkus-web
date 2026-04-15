import { NextRequest, NextResponse } from "next/server";
import { checkArticleMetricsReadiness } from "@/app/lib/article-family/metrics-readiness";
import { supabaseAdmin } from "@/lib/supabase/admin";

const INTERNAL_HEADER = "x-internal-article-metrics-secret";

function isAuthorized(req: NextRequest): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const secret = process.env.INTERNAL_ARTICLE_METRICS_SECRET;
  if (!secret) return false;
  return req.headers.get(INTERNAL_HEADER) === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const readiness = await checkArticleMetricsReadiness();

  let totalsRowCount: number | null = null;
  let dailyRowCount: number | null = null;
  let rankingsQueryable = false;

  if (readiness.hasTotalsTable) {
    const { count, error } = await supabaseAdmin
      .from("article_metrics_totals")
      .select("*", { count: "exact", head: true });
    if (!error) totalsRowCount = count ?? 0;
  }

  if (readiness.hasDailyTable) {
    const { count, error } = await supabaseAdmin
      .from("article_metrics_daily")
      .select("*", { count: "exact", head: true });
    if (!error) dailyRowCount = count ?? 0;
  }

  if (readiness.hasRankingsView) {
    const { error } = await supabaseAdmin
      .from("article_metrics_rankings")
      .select("article_id")
      .limit(1);
    rankingsQueryable = !error;
  }

  return NextResponse.json({
    readiness,
    totalsRowCount,
    dailyRowCount,
    rankingsQueryable,
    environment: process.env.NODE_ENV,
  });
}
