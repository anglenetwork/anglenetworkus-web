import { test, expect } from "@playwright/test";

const menuSearchInput = (page: import("@playwright/test").Page) =>
  page.locator("#menu-search-input");

const navigationMenu = (page: import("@playwright/test").Page) =>
  page.locator('[role="dialog"][aria-label="Navigation menu"]');

const headerButton = (page: import("@playwright/test").Page, name: string) =>
  page.locator("header").getByRole("button", { name });

async function openMenuFromHeader(
  page: import("@playwright/test").Page,
  buttonName: string,
) {
  const button = headerButton(page, buttonName);
  await expect(button).toBeVisible();
  await button.click();
  await expect(navigationMenu(page)).toHaveAttribute("data-state", "open", {
    timeout: 10000,
  });
  await expect(navigationMenu(page)).toBeVisible({ timeout: 10000 });
}

test.describe("Smoke: nav menu search focus", () => {
  test("mobile: search button focuses menu search input", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load" });

    await openMenuFromHeader(page, "Open search menu");
    await expect(menuSearchInput(page)).toBeFocused({ timeout: 5000 });
  });

  test("mobile: hamburger does not focus menu search input", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load" });

    await openMenuFromHeader(page, "Open menu");
    await expect(menuSearchInput(page)).not.toBeFocused({ timeout: 5000 });
  });

  test("desktop: search button focuses menu search input", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "load" });

    await openMenuFromHeader(page, "Open search menu");
    await expect(menuSearchInput(page)).toBeFocused({ timeout: 5000 });
  });

  test("desktop: hamburger does not focus menu search input", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "load" });

    await openMenuFromHeader(page, "Open menu");
    await expect(menuSearchInput(page)).not.toBeFocused({ timeout: 5000 });
  });
});
