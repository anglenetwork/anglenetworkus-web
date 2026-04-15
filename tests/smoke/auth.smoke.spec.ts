import { test, expect } from "@playwright/test";

// Smoke auth checks intentionally run unauthenticated even though the suite
// defaults to a pre-authenticated storageState from global setup.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Smoke: auth shells & redirects", () => {
  test("signin page renders core UI", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "domcontentloaded" });

    // Sign-in page returns null until session check finishes; wait for shell first.
    await expect(
      page.getByRole("heading", { name: /sign in to continue/i })
    ).toBeVisible({ timeout: 15000 });

    // Some browsers may expose this CTA as a link instead of a button.
    const googleCta = page
      .getByRole("button", { name: /continue with google/i })
      .or(page.getByRole("link", { name: /continue with google/i }))
      .or(page.getByText(/continue with google/i));
    await expect(googleCta).toBeVisible();

    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();

    const emailButton = page
      .getByRole("button", { name: /send sign-in link/i })
      .or(page.getByRole("button", { name: /send magic link/i }));
    await expect(emailButton).toBeVisible();
  });

  test("protected routes redirect to signin when not authenticated", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    // `/myprofile` client-redirects to profile-details; use the leaf route so the gate is deterministic.
    await page.goto("/myprofile/profile-details", { waitUntil: "domcontentloaded" });

    // Unauthenticated users see either the dedicated /signin page or the myprofile layout gate.
    // CardTitle is a div (not a heading), so match copy instead of role=heading.
    const embeddedGate = page.getByText("Sign In", { exact: true });
    const signinPageHeading = page.getByRole("heading", {
      name: /sign in to continue/i,
    });
    await expect(embeddedGate.or(signinPageHeading)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(
      page
        .getByRole("button", { name: /send magic link|send sign-in link/i })
    ).toBeVisible();
  });
});

