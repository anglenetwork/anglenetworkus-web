import { describe, expect, it } from "vitest";
import {
  buildNavCategoryGrid,
  buildNavMenuCategories,
} from "@/app/lib/nav/menu-columns";

describe("buildNavMenuCategories", () => {
  const categories = [
    { slug: "us", name: "US" },
    { slug: "world", name: "World" },
    { slug: "politics", name: "Politics" },
    { slug: "business", name: "Business" },
    { slug: "tech", name: "Tech" },
    { slug: "entertainment", name: "Entertainment" },
    { slug: "science", name: "Science" },
    { slug: "lifestyle", name: "Lifestyle" },
  ];

  it("returns categories in navbar order with tags grouped by parent", () => {
    const menuCategories = buildNavMenuCategories(categories, [
      { slug: "congress", title: "Congress", categorySlug: "politics" },
      { slug: "markets", title: "Markets", categorySlug: "business" },
    ]);

    expect(menuCategories.map((category) => category.slug)).toEqual([
      "us",
      "world",
      "politics",
      "business",
      "tech",
      "entertainment",
      "science",
      "lifestyle",
    ]);

    const politics = menuCategories.find(
      (category) => category.slug === "politics",
    );
    expect(politics?.tags).toEqual([{ slug: "congress", title: "Congress" }]);
  });

  it("builds xl/footer grids in navbar reading order", () => {
    const menuCategories = buildNavMenuCategories(categories, []);
    const rows = buildNavCategoryGrid(menuCategories, 5, 2);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.map((category) => category?.slug)).toEqual([
      "us",
      "world",
      "politics",
      "business",
      "tech",
    ]);
    expect(rows[1]?.map((category) => category?.slug ?? null)).toEqual([
      "entertainment",
      "science",
      "lifestyle",
      null,
      null,
    ]);
  });
});
