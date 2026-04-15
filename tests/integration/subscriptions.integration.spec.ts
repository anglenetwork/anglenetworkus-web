import { test, expect } from "@playwright/test";

import { gotoSubscriptionsShell } from "../helpers/subscriptions-shell";

test.describe("Integration: subscriptions details", () => {
  test.beforeEach(async ({ page }) => {
    await gotoSubscriptionsShell(page);

    if (page.url().includes("/signin")) {
      throw new Error("Not authenticated - redirected to signin page.");
    }

    await expect(page.getByText("Current Plan").first()).toBeVisible({
      timeout: 20000,
    });
  });

  test("upgrade card shows monthly Pro pricing for Starter users", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", { name: /^pro$/i }).first()).toBeVisible();
    await expect(page.getByText("$9.99").first()).toBeVisible();
    await expect(page.getByText("/month").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /upgrade now/i }).first()
    ).toBeVisible();
  });
});

