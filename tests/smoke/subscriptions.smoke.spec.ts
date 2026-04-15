import { test, expect } from "@playwright/test";

import { gotoSubscriptionsShell } from "../helpers/subscriptions-shell";

test.describe("Smoke: subscriptions page shell", () => {
  test("subscriptions page loads and shows tiers", async ({ page }) => {
    await gotoSubscriptionsShell(page);

    if (page.url().includes("/signin")) {
      throw new Error("Not authenticated - redirected to signin page.");
    }

    // Avoid networkidle (varies by engine); assert stable UI markers instead.
    await expect(page.getByText("Current Plan").first()).toBeVisible({
      timeout: 20000,
    });
    await expect(
      page.getByRole("heading", { name: /you're on the starter plan/i })
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: /^pro$/i }).first()).toBeVisible();
  });
});

