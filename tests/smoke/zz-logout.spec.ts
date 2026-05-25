import { test, expect } from "@playwright/test";

/**
 * Runs last (`zz-*`) so Supabase signOut does not invalidate the shared test user session
 * before other smoke/integration tests in the same run (see `playwright/.auth/state.json`).
 */
test.describe("Smoke: logout (runs last)", () => {
  test("logout works and session is cleared", async ({ page }) => {
    test.skip(!process.env.PLAYWRIGHT_TEST_EMAIL, "Test email not provided");

    await page.goto("/myprofile");
    await page.waitForLoadState("networkidle");

    const userMenuButton = page.getByRole("button", {
      name: /user menu/i,
    });

    if (await userMenuButton.isVisible()) {
      await userMenuButton.click();
      await page.waitForSelector('[role="menuitem"]', { timeout: 2000 });

      const signOutButton = page.getByRole("menuitem", {
        name: /sign out/i,
      });
      await expect(signOutButton).toBeVisible();
      await signOutButton.click();

      await page.waitForURL(/\/signin/, { timeout: 10000 }).catch(() => {});
      const onDedicatedSignIn = page.url().includes("/signin");
      if (onDedicatedSignIn) {
        await expect(
          page.getByRole("heading", { name: /sign in to continue/i }),
        ).toBeVisible({ timeout: 15000 });
      } else {
        await expect(
          page.getByText("Sign In", { exact: true }).first(),
        ).toBeVisible({ timeout: 15000 });
      }

      await page.goto("/myprofile/profile-details", {
        waitUntil: "domcontentloaded",
      });
      await expect(
        page.getByText("Sign In", { exact: true }).first(),
      ).toBeVisible({ timeout: 15000 });
      await expect(page.getByLabel(/email/i)).toBeVisible();
    }
  });
});
