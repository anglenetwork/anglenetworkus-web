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

export type NavMenuColumn = {
  categories: NavMenuCategory[];
};

export type NavTagWithCategory = NavMenuTag & {
  categorySlug: string;
};

const MENU_COLUMN_SIZES = [2, 2, 2, 1, 1] as const;

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

/** Groups category-scoped tags into five menu columns for xl (2+2+2+1+1 categories). */
export function buildNavMenuColumns(
  categories: NavCategory[],
  tagRows: NavTagWithCategory[],
): NavMenuColumn[] {
  const tagsByCategory = new Map<string, NavMenuTag[]>();
  for (const row of tagRows) {
    const list = tagsByCategory.get(row.categorySlug) ?? [];
    list.push({ slug: row.slug, title: row.title });
    tagsByCategory.set(row.categorySlug, list);
  }

  const useCanonicalFallback = tagRows.length === 0;
  const resolvedCategories = resolveCategories(categories);
  const categoriesWithTags: NavMenuCategory[] = resolvedCategories.map(
    (category) => ({
      slug: category.slug,
      name: category.name,
      tags: tagsForCategory(
        category.slug,
        tagsByCategory,
        useCanonicalFallback,
      ),
    }),
  );

  const columns: NavMenuColumn[] = [];
  let index = 0;
  for (const size of MENU_COLUMN_SIZES) {
    const slice = categoriesWithTags.slice(index, index + size);
    if (slice.length === 0) break;
    columns.push({ categories: slice });
    index += size;
  }

  return columns;
}

/** xl layout: one grid row per category index so row baselines align across columns. */
export function buildXlMenuGrid(
  menuColumns: NavMenuColumn[],
): (NavMenuCategory | null)[][] {
  if (menuColumns.length === 0) return [];

  const rowCount = Math.max(
    ...menuColumns.map((column) => column.categories.length),
  );
  const rows: (NavMenuCategory | null)[][] = Array.from(
    { length: rowCount },
    () => Array.from({ length: menuColumns.length }, () => null),
  );

  menuColumns.forEach((column, columnIndex) => {
    column.categories.forEach((category, rowIndex) => {
      rows[rowIndex][columnIndex] = category;
    });
  });

  return rows;
}
