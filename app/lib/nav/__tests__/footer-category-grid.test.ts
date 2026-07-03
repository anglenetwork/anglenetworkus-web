import { describe, expect, it } from "vitest";
import {
  buildFooterCategoryGrid,
  FOOTER_CATEGORY_GRID_COLUMNS,
  FOOTER_CATEGORY_GRID_ROWS,
} from "../footer-category-grid";

function category(slug: string, name: string) {
  return {
    slug,
    name,
    tags: [{ slug: `${slug}-tag`, title: `${name} Tag` }],
  };
}

describe("buildFooterCategoryGrid", () => {
  it("lays out categories into two rows of five columns in navbar order", () => {
    const menuCategories = Array.from({ length: 8 }, (_, index) =>
      category(`cat-${index}`, `Category ${index}`),
    );

    const rows = buildFooterCategoryGrid(menuCategories);

    expect(rows).toHaveLength(FOOTER_CATEGORY_GRID_ROWS);
    expect(rows[0]).toHaveLength(FOOTER_CATEGORY_GRID_COLUMNS);
    expect(rows[1]).toHaveLength(FOOTER_CATEGORY_GRID_COLUMNS);
    expect(rows[0][0]?.slug).toBe("cat-0");
    expect(rows[0][4]?.slug).toBe("cat-4");
    expect(rows[1][0]?.slug).toBe("cat-5");
    expect(rows[1][2]?.slug).toBe("cat-7");
    expect(rows[1][3]).toBeNull();
  });
});
