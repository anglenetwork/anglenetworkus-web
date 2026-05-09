import { test, expect } from "@playwright/test";

/**
 * Fifth Section: DOM must expose category slugs (see data-fifth-column / data-article-category-slug).
 * Mirrors what you would check in Chrome DevTools → Elements on each <a href^="/post/">.
 */
test.describe("Homepage Fifth Section category DOM", () => {
  test("left column article links carry world; right column carries politics", async ({
    page,
  }) => {
    await page.goto("/");

    const left = page.locator('[data-fifth-column="left"]');
    const right = page.locator('[data-fifth-column="right"]');

    await expect(left).toHaveAttribute("data-expected-category-slug", "world");
    await expect(right).toHaveAttribute(
      "data-expected-category-slug",
      "politics",
    );

    const leftPostLinks = left.locator('a[href^="/post/"]');
    const rightPostLinks = right.locator('a[href^="/post/"]');

    const leftCount = await leftPostLinks.count();
    const rightCount = await rightPostLinks.count();

    expect(leftCount, "left column should render at least one post link").toBeGreaterThan(0);
    expect(rightCount, "right column should render at least one post link").toBeGreaterThan(0);

    for (let i = 0; i < leftCount; i++) {
      const slug = await leftPostLinks.nth(i).getAttribute("data-article-category-slug");
      expect(slug, `left post link ${i} data-article-category-slug`).toBe("world");
    }

    for (let i = 0; i < rightCount; i++) {
      const slug = await rightPostLinks.nth(i).getAttribute("data-article-category-slug");
      expect(slug, `right post link ${i} data-article-category-slug`).toBe("politics");
    }
  });
});
