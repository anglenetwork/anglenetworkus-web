import type { Page } from "@playwright/test";

/**
 * Navigate to subscriptions with resilient auth:
 * 1) Hit `/` and wait for `/api/auth/session` so the Supabase cookie is exercised before SSR routes.
 * 2) First `/myprofile/subscriptions` request sometimes renders the layout "Sign In" gate if SSR
 *    runs before cookies are fully applied — one reload usually fixes it.
 */
export async function gotoSubscriptionsShell(page: Page): Promise<void> {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page
    .waitForResponse(
      (r) => r.url().includes("/api/auth/session") && r.status() === 200,
      { timeout: 20000 },
    )
    .catch(() => {});

  await page.goto("/myprofile/subscriptions", { waitUntil: "networkidle" });

  await page
    .getByText("Loading subscription data…")
    .waitFor({ state: "hidden", timeout: 25000 })
    .catch(() => {});

  const currentPlan = page.getByText("Current Plan").first();
  if (!(await currentPlan.isVisible().catch(() => false))) {
    await page.reload({ waitUntil: "networkidle" });
    await page
      .getByText("Loading subscription data…")
      .waitFor({ state: "hidden", timeout: 25000 })
      .catch(() => {});
  }
}
