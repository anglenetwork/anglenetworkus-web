import { describe, expect, it } from "vitest";
import {
  buildNavMenuColumns,
  buildXlMenuGrid,
} from "@/app/lib/nav/menu-columns";

describe("buildNavMenuColumns", () => {
  const categories = [
    { slug: "us", name: "US" },
    { slug: "world", name: "World" },
    { slug: "politics", name: "Politics" },
    { slug: "business", name: "Business" },
    { slug: "science", name: "Science" },
    { slug: "entertainment", name: "Entertainment" },
    { slug: "tech", name: "Tech" },
    { slug: "lifestyle", name: "Lifestyle" },
  ];

  it("creates five columns with eight categories distributed 2+2+2+1+1", () => {
    const columns = buildNavMenuColumns(categories, []);

    expect(columns).toHaveLength(5);
    expect(columns.map((column) => column.categories.length)).toEqual([
      2, 2, 2, 1, 1,
    ]);
    expect(columns[0]?.categories.map((category) => category.slug)).toEqual([
      "us",
      "world",
    ]);
    expect(columns[4]?.categories[0]?.slug).toBe("lifestyle");
  });

  it("groups sanity tags under their parent category", () => {
    const columns = buildNavMenuColumns(categories, [
      { slug: "congress", title: "Congress", categorySlug: "politics" },
      { slug: "markets", title: "Markets", categorySlug: "business" },
    ]);

    const politics = columns
      .flatMap((column) => column.categories)
      .find((category) => category.slug === "politics");

    expect(politics?.tags).toEqual([{ slug: "congress", title: "Congress" }]);
  });

  it("builds xl grid rows so second categories share a horizontal row", () => {
    const columns = buildNavMenuColumns(categories, []);
    const rows = buildXlMenuGrid(columns);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.map((category) => category?.slug)).toEqual([
      "us",
      "politics",
      "science",
      "tech",
      "lifestyle",
    ]);
    expect(rows[1]?.map((category) => category?.slug ?? null)).toEqual([
      "world",
      "business",
      "entertainment",
      null,
      null,
    ]);
  });
});
