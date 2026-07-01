import type { CategoriesByViewsQueryResult } from "@/sanity.types";

/**
 * Slugs that should appear first in the main nav, in the order listed.
 * Categories not in this list fall back to the Sanity `order` field, then alpha.
 */
const CATEGORY_NAV_ORDER = [
  "us",
  "world",
  "politics",
  "business",
  "tech",
  "entertainment",
  "science",
  "lifestyle",
] as const;

const CATEGORY_NAV_ORDER_INDEX: Map<string, number> = new Map(
  CATEGORY_NAV_ORDER.map((slug, index) => [slug, index]),
);

const DEFAULT_ORDER = 999;

export interface NavCategory {
  slug: string;
  name: string;
  views?: number;
}

/**
 * Normalize Sanity category rows into the shape the site shell consumes,
 * dropping incomplete rows and applying the preferred-slug ordering on top
 * of the GROQ-level sort.
 */
export function buildNavCategories(
  rows: CategoriesByViewsQueryResult,
): NavCategory[] {
  return rows
    .filter(
      (cat): cat is typeof cat & { slug: string; name: string } =>
        cat.slug !== null && cat.name !== null,
    )
    .map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      views: cat.views ?? undefined,
      order: cat.order ?? DEFAULT_ORDER,
    }))
    .sort((a, b) => {
      const preferredA =
        CATEGORY_NAV_ORDER_INDEX.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const preferredB =
        CATEGORY_NAV_ORDER_INDEX.get(b.slug) ?? Number.MAX_SAFE_INTEGER;

      if (preferredA !== preferredB) return preferredA - preferredB;
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name);
    })
    .map(({ slug, name, views }) => ({ slug, name, views }));
}
