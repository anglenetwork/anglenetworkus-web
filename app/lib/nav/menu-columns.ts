import type { NavCategory } from "@/app/lib/nav/category-order";
import {
  CANONICAL_NAV_CATEGORIES,
  CANONICAL_NAV_CATEGORY_TAGS,
} from "@/app/lib/nav/canonical-fallbacks";

export type NavMenuTag = {
  slug: string;
  title: string;
};

export type NavMenuCategory = {
  slug: string;
  name: string;
  tags: NavMenuTag[];
};

/** @deprecated Column grouping is no longer used for display; kept for type compatibility. */
export type NavMenuColumn = {
  categories: NavMenuCategory[];
};

export type NavTagWithCategory = NavMenuTag & {
  categorySlug: string;
};

function resolveCategories(categories: NavCategory[]): NavCategory[] {
  if (categories.length > 0) return categories;
  return CANONICAL_NAV_CATEGORIES.map((category) => ({
    slug: category.slug,
    name: category.name,
  }));
}

function tagsForCategory(
  categorySlug: string,
  tagsByCategory: Map<string, NavMenuTag[]>,
  useCanonicalFallback: boolean,
): NavMenuTag[] {
  if (useCanonicalFallback) {
    return CANONICAL_NAV_CATEGORY_TAGS[categorySlug] ?? [];
  }
  return tagsByCategory.get(categorySlug) ?? [];
}

/**
 * Categories with tags in navbar order — single source for menu and footer display.
 */
export function buildNavMenuCategories(
  categories: NavCategory[],
  tagRows: NavTagWithCategory[],
): NavMenuCategory[] {
  const tagsByCategory = new Map<string, NavMenuTag[]>();
  for (const row of tagRows) {
    const list = tagsByCategory.get(row.categorySlug) ?? [];
    list.push({ slug: row.slug, title: row.title });
    tagsByCategory.set(row.categorySlug, list);
  }

  const useCanonicalFallback = tagRows.length === 0;
  const resolvedCategories = resolveCategories(categories);

  return resolvedCategories.map((category) => ({
    slug: category.slug,
    name: category.name,
    tags: tagsForCategory(
      category.slug,
      tagsByCategory,
      useCanonicalFallback,
    ),
  }));
}

/** Row-major grid filled in navbar order (left-to-right, top-to-bottom). */
export function buildNavCategoryGrid(
  categories: NavMenuCategory[],
  columns: number,
  rows: number,
): (NavMenuCategory | null)[][] {
  const slotCount = columns * rows;
  const slots = Array.from(
    { length: slotCount },
    (_, index) => categories[index] ?? null,
  );

  return Array.from({ length: rows }, (_, rowIndex) =>
    slots.slice(rowIndex * columns, rowIndex * columns + columns),
  );
}
