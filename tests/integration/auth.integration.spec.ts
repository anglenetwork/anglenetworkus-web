import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Integration: auth provider flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signin", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /sign in to continue/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test("Google OAuth button click initiates redirect", async ({ page }) => {
    const googleButton = page
      .getByRole("button", { name: /continue with google/i })
      .or(page.getByRole("link", { name: /continue with google/i }));
    await expect(googleButton).toBeVisible();

    // This flow can navigate to external providers; keep it in Chromium-only integration.
    await Promise.allSettled([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("supabase") ||
          resp.url().includes("google") ||
          resp.status() === 200,
        { timeout: 15000 }
      ),
      googleButton.click(),
    ]);

    const currentUrl = page.url();
    expect(
      currentUrl.includes("google") ||
        currentUrl.includes("supabase") ||
        currentUrl.includes("accounts.google.com")
    ).toBeTruthy();
  });
});

