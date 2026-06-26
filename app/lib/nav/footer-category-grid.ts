import type { NavMenuCategory, NavMenuColumn } from "./menu-columns";

export const FOOTER_CATEGORY_GRID_COLUMNS = 5;
export const FOOTER_CATEGORY_GRID_ROWS = 2;

function flattenMenuCategories(
  menuColumns: NavMenuColumn[],
): NavMenuCategory[] {
  return menuColumns.flatMap((column) => column.categories);
}

/** Two rows of five category columns for the footer sitemap. */
export function buildFooterCategoryGrid(
  menuColumns: NavMenuColumn[],
): (NavMenuCategory | null)[][] {
  const categories = flattenMenuCategories(menuColumns);
  const slotCount = FOOTER_CATEGORY_GRID_COLUMNS * FOOTER_CATEGORY_GRID_ROWS;
  const slots = Array.from(
    { length: slotCount },
    (_, index) => categories[index] ?? null,
  );

  return [
    slots.slice(0, FOOTER_CATEGORY_GRID_COLUMNS),
    slots.slice(FOOTER_CATEGORY_GRID_COLUMNS, slotCount),
  ];
}
