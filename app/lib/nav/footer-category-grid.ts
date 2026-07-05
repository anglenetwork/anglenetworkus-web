import { buildNavCategoryGrid, type NavMenuCategory } from "./menu-columns";

export const FOOTER_CATEGORY_GRID_COLUMNS = 5;
export const FOOTER_CATEGORY_GRID_ROWS = 2;

/** Two rows of five category columns for the footer sitemap, in navbar order. */
export function buildFooterCategoryGrid(
  categories: NavMenuCategory[],
): (NavMenuCategory | null)[][] {
  return buildNavCategoryGrid(
    categories,
    FOOTER_CATEGORY_GRID_COLUMNS,
    FOOTER_CATEGORY_GRID_ROWS,
  );
}
