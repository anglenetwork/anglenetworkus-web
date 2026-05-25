import { test, expect } from "@playwright/test";

async function waitForSearchApi(page: import("@playwright/test").Page) {
  await page.waitForResponse(
    (res) => res.url().includes("/api/search") && res.status() === 200,
    { timeout: 20000 },
  );
}

test.describe("Smoke: search", () => {
  test("search page shows empty state without query", async ({ page }) => {
    await page.goto("/search", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "Search", exact: true }),
    ).toBeVisible({
      timeout: 15000,
    });
    await expect(
      page.getByText("Enter a search term above to find articles."),
    ).toBeVisible();
    await expect(
      page
        .locator("main")
        .getByRole("search", { name: "Search editorial content" }),
    ).toBeVisible();
  });

  test("search API returns 200 for editorial and sponsored scopes", async ({
    request,
  }) => {
    for (const type of [
      "all",
      "post",
      "opinion",
      "analysis",
      "sponsored",
    ] as const) {
      const res = await request.get(
        `/api/search?q=news&sort=relevance&type=${type}`,
      );
      expect(res.status(), `type=${type}`).toBe(200);
      const body = await res.json();
      expect(body, `type=${type}`).not.toHaveProperty("error");
      expect(body).toMatchObject({
        query: "news",
        sort: "relevance",
        type,
        page: 1,
        pageSize: 10,
      });
      expect(Array.isArray(body.results)).toBe(true);
    }
  });

  test("search UI completes without server error", async ({ page }) => {
    await page.goto("/search?q=news&sort=relevance&type=all", {
      waitUntil: "domcontentloaded",
    });
    await waitForSearchApi(page);

    await expect(page.getByText("Search could not be completed.")).toHaveCount(
      0,
    );

    const statusLine = page.locator("main p").filter({
      hasText: /Displaying|No results for|Searching for/,
    });
    await expect(statusLine).toBeVisible({ timeout: 20000 });
  });

  test("mobile: type filter dialog and sort select update URL", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const main = page.locator("main");

    await page.goto("/search?q=news&sort=relevance&type=all", {
      waitUntil: "domcontentloaded",
    });
    await waitForSearchApi(page);

    await main.getByRole("button", { name: "Filter" }).click();
    await expect(
      page.getByRole("dialog", { name: "Filter by type" }),
    ).toBeVisible();

    await page.getByRole("radio", { name: "Sponsored" }).click();
    await Promise.all([
      page.waitForURL(/type=sponsored/, {
        timeout: 15000,
        waitUntil: "commit",
      }),
      page.getByRole("button", { name: "Apply" }).click(),
    ]);
    await waitForSearchApi(page);

    await main.getByRole("combobox", { name: /Sort/ }).click();
    await page.getByRole("option", { name: "Newest" }).click();
    await expect(page).toHaveURL(/sort=newest/, { timeout: 15000 });
    await waitForSearchApi(page);
    await expect(page.getByText("Search could not be completed.")).toHaveCount(
      0,
    );
  });

  test("type filters include Sponsored and sponsored scope loads", async ({
    page,
  }) => {
    const main = page.locator("main");

    await page.goto("/search?q=news&sort=relevance&type=all", {
      waitUntil: "domcontentloaded",
    });
    await waitForSearchApi(page);

    await expect(main.getByRole("button", { name: "All" })).toBeVisible();
    await expect(main.getByRole("button", { name: "News" })).toBeVisible();
    await expect(main.getByRole("button", { name: "Opinion" })).toBeVisible();
    await expect(main.getByRole("button", { name: "Analysis" })).toBeVisible();
    await expect(main.getByRole("button", { name: "Sponsored" })).toBeVisible();

    await Promise.all([
      page.waitForURL(/type=sponsored/, {
        timeout: 15000,
        waitUntil: "commit",
      }),
      main.getByRole("button", { name: "Sponsored" }).click(),
    ]);

    await waitForSearchApi(page);
    await expect(page.getByText("Search could not be completed.")).toHaveCount(
      0,
    );
  });

  test("search bar submit navigates with q param", async ({ page }) => {
    await page.goto("/search", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    const input = page
      .locator("main")
      .getByPlaceholder("Search news, opinion, and analysis");

    await Promise.all([
      page.waitForURL(/[?&]q=policy/, { timeout: 20000, waitUntil: "commit" }),
      (async () => {
        await input.fill("policy");
        await input.press("Enter");
      })(),
    ]);

    await waitForSearchApi(page);
    await expect(page.getByText("Search could not be completed.")).toHaveCount(
      0,
    );
  });
});
