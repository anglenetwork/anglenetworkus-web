/**
 * Pure helpers for backfill (testable). Used by scripts/backfill-article-metrics.mjs.
 */

/**
 * Initial views_all for article_metrics_totals from a Sanity doc (posts may use legacy viewsAll).
 */
export function initialViewsAllFromDoc(doc) {
  if (!doc || doc._type !== "post") return 0;
  const v = doc.viewsAll;
  if (typeof v === "number" && !Number.isNaN(v)) {
    return Math.max(0, Math.floor(v));
  }
  return 0;
}
