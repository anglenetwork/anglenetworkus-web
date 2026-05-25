// One-shot: seed article_metrics_totals from published Sanity article-family docs (no daily history, no Sanity writes).
import { createClient as createSanityClient } from "@sanity/client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkArticleMetricsReadiness } from "./lib/article-metrics-readiness.mjs";
import { initialViewsAllFromDoc } from "./lib/backfill-article-metrics-logic.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env.local") });

function requireEnv() {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET)
    missing.push("NEXT_PUBLIC_SANITY_DATASET");
  if (!process.env.SANITY_API_READ_TOKEN) missing.push("SANITY_API_READ_TOKEN");
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  if (!supabaseUrl)
    missing.push(
      "NEXT_PUBLIC_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_PROJECT_URL)",
    );
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

const ARTICLE_TYPES = ["post", "opinion", "analysis", "sponsored"];

const fetchPublishedArticles = `
*[
  _type in ["post", "opinion", "analysis", "sponsored"] &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now()
]{
  _id,
  _type,
  viewsAll
}
`;

async function main() {
  requireEnv();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;

  const sanity = createSanityClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
  });

  const supabase = createSupabaseClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const readiness = await checkArticleMetricsReadiness(supabase);
  if (!readiness.ready) {
    console.error("");
    console.error(
      "Article metrics are not ready yet. Apply the Supabase migration first:",
    );
    console.error("  supabase-migrations/20260327_article_metrics.sql");
    console.error("Then run: npm run backfill:article-metrics");
    if (readiness.issues.length) {
      console.error("");
      console.error("Details:", readiness.issues.join("; "));
    }
    process.exit(1);
  }

  const docs = await sanity.fetch(fetchPublishedArticles);

  const byType = { post: 0, opinion: 0, analysis: 0, sponsored: 0 };
  for (const d of docs || []) {
    if (d._type && byType[d._type] !== undefined) byType[d._type] += 1;
  }

  let inserted = 0;
  let skipped = 0;
  let postsFromLegacyViews = 0;

  for (const doc of docs || []) {
    const id = doc._id;
    const type = doc._type;
    if (!ARTICLE_TYPES.includes(type)) continue;

    const { data: existing, error: selErr } = await supabase
      .from("article_metrics_totals")
      .select("article_id")
      .eq("article_id", id)
      .maybeSingle();

    if (selErr) throw selErr;
    if (existing) {
      skipped += 1;
      continue;
    }

    const viewsAll = initialViewsAllFromDoc(doc);
    if (type === "post" && viewsAll > 0) postsFromLegacyViews += 1;

    const { error: insErr } = await supabase
      .from("article_metrics_totals")
      .insert({
        article_id: id,
        article_type: type,
        views_all: viewsAll,
      });

    if (insErr) throw insErr;
    inserted += 1;
  }

  console.log("--- backfill:article-metrics summary ---");
  console.log("Published articles by type:", byType);
  console.log("Totals rows inserted:", inserted);
  console.log("Totals rows skipped (already present):", skipped);
  console.log(
    "Posts initialized with non-zero legacy viewsAll:",
    postsFromLegacyViews,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
