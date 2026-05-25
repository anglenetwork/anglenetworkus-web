/**
 * One-off: same GROQ filter/order as homepage FifthSection (posts only).
 * Run: node scripts/verify-fifth-section-fetch.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-28";

if (!projectId || !dataset) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, useCdn: true });

const query = `*[
  _type == "post" &&
  category->slug.current == $categorySlug &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now() &&
  defined(slug.current)
] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, "Untitled"),
  "categorySlug": category->slug.current
}`;

const leadingAnalysis = (title) => /^\s*Analysis\b/i.test(String(title || ""));

function summarize(slug, rows) {
  const list = Array.isArray(rows) ? rows : [];
  const typeCounts = list.reduce((acc, r) => {
    const t = r._type ?? "(missing)";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const analysisOnly =
    list.length > 0 && list.every((r) => r._type === "analysis");
  const allTitlesLeadAnalysis =
    list.length > 0 && list.every((r) => leadingAnalysis(r.title));
  const leadAnalysisCount = list.filter((r) => leadingAnalysis(r.title)).length;

  return {
    slug,
    total: list.length,
    typeCounts,
    everyDocumentIsAnalysisType: analysisOnly,
    everyTitleStartsWithAnalysisWord: allTitlesLeadAnalysis,
    titlesLeadingAnalysisWord: `${leadAnalysisCount}/${list.length}`,
    first21: list.slice(0, 21).map((r, i) => ({
      i,
      _id: r._id,
      _type: r._type,
      categorySlug: r.categorySlug,
      title: r.title,
      titleLeadingAnalysisWord: leadingAnalysis(r.title),
    })),
  };
}

const leftSlug = "world";
const rightSlug = "politics";

const [left, right] = await Promise.all([
  client.fetch(query, { categorySlug: leftSlug }),
  client.fetch(query, { categorySlug: rightSlug }),
]);

console.log(
  JSON.stringify(
    { left: summarize(leftSlug, left), right: summarize(rightSlug, right) },
    null,
    2,
  ),
);
