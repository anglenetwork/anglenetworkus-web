// Read-only verification of article metrics tables, views, and RPC after migration/backfill.
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkArticleMetricsReadiness } from "./lib/article-metrics-readiness.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env.local") });

function requireEnv() {
  const missing = [];
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) {
    console.error(
      "Missing required environment variables:",
      missing.join(", "),
    );
    process.exit(1);
  }
  return { supabaseUrl };
}

async function main() {
  requireEnv();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;

  const supabase = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const readiness = await checkArticleMetricsReadiness(supabase);

  console.log("--- article-metrics readiness ---");
  console.log(JSON.stringify(readiness, null, 2));

  if (!readiness.ready) {
    console.error("\nMetrics infrastructure is not ready. Next steps:");
    console.error(
      "1. Apply supabase-migrations/20260327_article_metrics.sql to your Supabase project.",
    );
    console.error("2. Run: npm run backfill:article-metrics");
    console.error("3. Re-run: npm run verify:article-metrics");
    console.error("4. Load article pages in the browser to record views.");
    process.exit(1);
  }

  const { count: totalsCount } = await supabase
    .from("article_metrics_totals")
    .select("*", { count: "exact", head: true });

  const { count: dailyCount } = await supabase
    .from("article_metrics_daily")
    .select("*", { count: "exact", head: true });

  const { error: rankErr } = await supabase
    .from("article_metrics_rankings")
    .select("article_id")
    .limit(1);

  console.log("\n--- row counts ---");
  console.log("article_metrics_totals:", totalsCount ?? 0);
  console.log("article_metrics_daily:", dailyCount ?? 0);
  console.log("article_metrics_rankings query ok:", !rankErr);

  const { data: byType } = await supabase
    .from("article_metrics_totals")
    .select("article_type");

  const typeCounts = {};
  for (const row of byType ?? []) {
    const t = row.article_type ?? "unknown";
    typeCounts[t] = (typeCounts[t] ?? 0) + 1;
  }
  console.log("\n--- counts by article_type (totals) ---");
  console.log(JSON.stringify(typeCounts, null, 2));

  const { data: topAll } = await supabase
    .from("article_metrics_rankings")
    .select("article_id, article_type, views_all")
    .order("views_all", { ascending: false })
    .limit(5);

  const { data: top7d } = await supabase
    .from("article_metrics_rankings")
    .select("article_id, article_type, views_7d")
    .order("views_7d", { ascending: false })
    .limit(5);

  console.log("\n--- top 5 by views_all ---");
  console.log(JSON.stringify(topAll ?? [], null, 2));
  console.log("\n--- top 5 by views_7d ---");
  console.log(JSON.stringify(top7d ?? [], null, 2));

  console.log("\n--- ok ---");
  console.log(
    "If counts are zero, run backfill and/or open articles in the browser.",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
