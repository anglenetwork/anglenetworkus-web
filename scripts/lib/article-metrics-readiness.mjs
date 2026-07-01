/**
 * Shared article-metrics readiness checks for Node scripts (verify + backfill).
 * Keep in sync with app/lib/article-family/metrics-readiness.ts
 */

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export async function checkArticleMetricsReadiness(supabase) {
  const issues = [];

  async function probeRelation(name, label) {
    const { error } = await supabase.from(name).select("article_id").limit(1);
    if (!error) return true;
    const text = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
    if (
      text.includes("does not exist") ||
      text.includes("not found") ||
      error.code === "42P01" ||
      error.code === "PGRST205"
    ) {
      issues.push(`${label} (${name}) is not available`);
      return false;
    }
    issues.push(`${label} (${name}): ${error.message ?? "unknown error"}`);
    return false;
  }

  async function probeIncrementFunction() {
    const { error } = await supabase.rpc("increment_article_view", {
      p_article_id: "",
      p_article_type: "post",
      p_viewed_at: new Date().toISOString(),
    });

    if (!error) {
      issues.push(
        "increment_article_view: expected validation error for empty article_id, got success",
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
      issues.push("increment_article_view RPC is missing or not exposed");
      return false;
    }

    issues.push(
      `increment_article_view: unexpected error (${code ?? "unknown"}): ${error.message}`,
    );
    return false;
  }

  const [hasDailyTable, hasTotalsTable, hasRankingsView, hasIncrementFunction] =
    await Promise.all([
      probeRelation("article_metrics_daily", "Daily metrics table"),
      probeRelation("article_metrics_totals", "Totals table"),
      probeRelation("article_metrics_rankings", "Rankings view"),
      probeIncrementFunction(),
    ]);

  const ready =
    hasDailyTable && hasTotalsTable && hasRankingsView && hasIncrementFunction;

  return {
    ready,
    hasDailyTable,
    hasTotalsTable,
    hasRankingsView,
    hasIncrementFunction,
    issues,
  };
}
