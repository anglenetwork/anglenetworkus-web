import { test, expect } from "@playwright/test";

const menuSearchInput = (page: import("@playwright/test").Page) =>
  page.locator("#menu-search-input");

test.describe("Smoke: nav menu search focus", () => {
  test("mobile: search button focuses menu search input", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Open search menu" }).click();

    await expect(
      page.getByRole("dialog", { name: "Navigation menu" }),
    ).toBeVisible({ timeout: 10000 });
    await expect(menuSearchInput(page)).toBeFocused({ timeout: 5000 });
  });

  test("mobile: hamburger does not focus menu search input", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Open menu" }).click();

    await expect(
      page.getByRole("dialog", { name: "Navigation menu" }),
    ).toBeVisible({ timeout: 10000 });
    await expect(menuSearchInput(page)).not.toBeFocused({ timeout: 5000 });
  });

  test("desktop: search button focuses menu search input", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Open search menu" }).click();

    await expect(
      page.getByRole("dialog", { name: "Navigation menu" }),
    ).toBeVisible({ timeout: 10000 });
    await expect(menuSearchInput(page)).toBeFocused({ timeout: 5000 });
  });

  test("desktop: hamburger does not focus menu search input", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Open menu" }).click();

    await expect(
      page.getByRole("dialog", { name: "Navigation menu" }),
    ).toBeVisible({ timeout: 10000 });
    await expect(menuSearchInput(page)).not.toBeFocused({ timeout: 5000 });
  });
});
