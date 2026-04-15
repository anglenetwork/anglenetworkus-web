import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

export type ArticleMetricsReadiness = {
  ready: boolean;
  hasDailyTable: boolean;
  hasTotalsTable: boolean;
  hasRankingsView: boolean;
  hasIncrementFunction: boolean;
  issues: string[];
};

function pushIssue(issues: string[], msg: string) {
  issues.push(msg);
}

/**
 * Probe increment_article_view with an empty id: the RPC validates and raises
 * before any insert, so this does not mutate metrics data.
 */
async function probeIncrementFunction(issues: string[]): Promise<boolean> {
  const { error } = await supabaseAdmin.rpc("increment_article_view", {
    p_article_id: "",
    p_article_type: "post",
    p_viewed_at: new Date().toISOString(),
  });

  if (!error) {
    pushIssue(
      issues,
      "increment_article_view: expected validation error for empty article_id, got success"
    );
    return false;
  }

  const msg = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  const code = error.code;

  if (
    msg.includes("article_id") ||
    msg.includes("required") ||
    code === "P0001"
  ) {
    return true;
  }

  if (
    msg.includes("could not find") ||
    (msg.includes("function") && msg.includes("increment_article_view")) ||
    code === "42883" ||
    code === "PGRST202"
  ) {
    pushIssue(issues, "increment_article_view RPC is missing or not exposed");
    return false;
  }

  pushIssue(
    issues,
    `increment_article_view: unexpected error (${code ?? "unknown"}): ${error.message}`
  );
  return false;
}

async function probeRelation(
  name: "article_metrics_daily" | "article_metrics_totals" | "article_metrics_rankings",
  issues: string[],
  label: string
): Promise<boolean> {
  const { error } = await supabaseAdmin.from(name).select("article_id").limit(1);
  if (!error) return true;

  const text = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  if (
    text.includes("does not exist") ||
    text.includes("not found") ||
    error.code === "42P01" ||
    error.code === "PGRST205"
  ) {
    pushIssue(issues, `${label} (${name}) is not available`);
    return false;
  }

  pushIssue(
    issues,
    `${label} (${name}): ${error.message ?? "unknown error"}`
  );
  return false;
}

export async function checkArticleMetricsReadiness(): Promise<ArticleMetricsReadiness> {
  const issues: string[] = [];

  const hasDailyTable = await probeRelation(
    "article_metrics_daily",
    issues,
    "Daily metrics table"
  );
  const hasTotalsTable = await probeRelation(
    "article_metrics_totals",
    issues,
    "Totals table"
  );
  const hasRankingsView = await probeRelation(
    "article_metrics_rankings",
    issues,
    "Rankings view"
  );
  const hasIncrementFunction = await probeIncrementFunction(issues);

  const ready =
    hasDailyTable &&
    hasTotalsTable &&
    hasRankingsView &&
    hasIncrementFunction;

  return {
    ready,
    hasDailyTable,
    hasTotalsTable,
    hasRankingsView,
    hasIncrementFunction,
    issues,
  };
}

export async function assertArticleMetricsReady(): Promise<void> {
  const r = await checkArticleMetricsReadiness();
  if (!r.ready) {
    throw new Error(
      "Article metrics infrastructure is not ready. Apply the SQL migration " +
        "`supabase-migrations/20260327_article_metrics.sql` to your Supabase project, " +
        "then run `npm run backfill:article-metrics`, then `npm run verify:article-metrics`. " +
        `Issues: ${r.issues.join("; ") || "see checkArticleMetricsReadiness"}`
    );
  }
}
