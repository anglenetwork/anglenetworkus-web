/**
 * Verifies homepage FifthSection GROQ: each row's category.slug matches $categorySlug.
 * Run: node scripts/verify-fifth-section-category-alignment.mjs
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
  "title": coalesce(title, "Untitled"),
  "categorySlug": category->slug.current,
  "categoryTitle": category->name
}`;

function analyze(label, expectedSlug, rows) {
  const list = Array.isArray(rows) ? rows : [];
  const mismatches = list
    .map((r, i) =>
      r.categorySlug === expectedSlug
        ? null
        : {
            i,
            _id: r._id,
            expectedSlug,
            got: r.categorySlug,
            title: r.title,
            categoryTitle: r.categoryTitle,
          },
    )
    .filter(Boolean);
  const ids = list.slice(0, 8).map((r) => r._id);
  return { label, expectedSlug, total: list.length, mismatches, idsTop8: ids };
}

const leftSlug = "world";
const rightSlug = "politics";

const [left, right] = await Promise.all([
  client.fetch(query, { categorySlug: leftSlug }),
  client.fetch(query, { categorySlug: rightSlug }),
]);

const L = analyze("left", leftSlug, left);
const R = analyze("right", rightSlug, right);

const sameHead3 =
  L.idsTop8.length >= 3 &&
  R.idsTop8.length >= 3 &&
  L.idsTop8[0] === R.idsTop8[0] &&
  L.idsTop8[1] === R.idsTop8[1] &&
  L.idsTop8[2] === R.idsTop8[2];

console.log(
  JSON.stringify(
    {
      left: L,
      right: R,
      suspiciousIdenticalTop3: sameHead3,
      conclusion:
        L.mismatches.length === 0 && R.mismatches.length === 0
          ? "Every fetched row has category.slug matching the requested column slug."
          : "MISMATCH: some rows do not match — inspect mismatches[]",
    },
    null,
    2,
  ),
);

if (sameHead3) {
  console.warn(
    "WARNING: left and right queries returned the same first 3 _id — possible wrong params or CDN issue.",
  );
}
