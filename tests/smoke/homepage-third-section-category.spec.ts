import { test, expect } from "@playwright/test";

/**
 * Third section: DOM must expose category slugs (data-third-column / data-article-category-slug).
 */
test.describe("Homepage third section category DOM", () => {
  test("left column article links carry world; right column carries politics", async ({
    page,
  }) => {
    await page.goto("/");

    const left = page.locator('[data-third-column="left"]');
    const right = page.locator('[data-third-column="right"]');

    await expect(left).toHaveAttribute("data-expected-category-slug", "world");
    await expect(right).toHaveAttribute(
      "data-expected-category-slug",
      "politics",
    );

    const leftPostLinks = left.locator('a[href^="/post/"]');
    const rightPostLinks = right.locator('a[href^="/post/"]');

    const leftCount = await leftPostLinks.count();
    const rightCount = await rightPostLinks.count();

    expect(
      leftCount,
      "left column should render at least one post link",
    ).toBeGreaterThan(0);
    expect(
      rightCount,
      "right column should render at least one post link",
    ).toBeGreaterThan(0);

    for (let i = 0; i < leftCount; i++) {
      const slug = await leftPostLinks
        .nth(i)
        .getAttribute("data-article-category-slug");
      expect(slug, `left post link ${i}`).toBe("world");
    }

    for (let i = 0; i < rightCount; i++) {
      const slug = await rightPostLinks
        .nth(i)
        .getAttribute("data-article-category-slug");
      expect(slug, `right post link ${i}`).toBe("politics");
    }
  });
});
