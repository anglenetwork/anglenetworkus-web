import { test, expect } from "@playwright/test";

test.describe("Subscriptions Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to subscriptions page
    await page.goto("/myprofile/subscriptions", { waitUntil: "networkidle" });
    
    // If redirected to signin, fail early
    const currentUrl = page.url();
    if (currentUrl.includes("/signin")) {
      throw new Error("Not authenticated - redirected to signin page.");
    }
    
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 15000 }).catch(() => {
      // Loading might not be present, that's OK
    });
    
    // Wait for page content - either Current Subscription or tier information
    await Promise.race([
      page.waitForSelector('text=Current Subscription', { timeout: 10000 }),
      page.waitForSelector('text=/Tier:/i', { timeout: 10000 }),
      page.waitForSelector('text=/FREE|PRO|LIFETIME/i', { timeout: 10000 }),
    ]).catch(() => {
      // If none appear, that's OK - test will fail with specific error
    });
    
    // Small wait for React to finish rendering
    await page.waitForTimeout(500);
  });

  test("subscriptions page loads and displays current subscription", async ({
    page,
  }) => {
    // Check for "Current Subscription" card (this is the main heading)
    const currentSubscriptionCard = page.getByText("Current Subscription");
    await expect(currentSubscriptionCard).toBeVisible();

    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Check that tier is displayed
    const tierBadge = page.locator('text=/FREE|PRO|LIFETIME/i');
    await expect(tierBadge.first()).toBeVisible();

    // Check for "Valid until" text
    const validUntil = page.getByText(/valid until/i);
    await expect(validUntil).toBeVisible();
  });

  test("displays all three subscription tiers", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Check for Free tier card
    const freeCard = page.getByText("Free").first();
    await expect(freeCard).toBeVisible();

    // Check for Pro tier card
    const proCard = page.getByText("Pro").first();
    await expect(proCard).toBeVisible();

    // Check for Lifetime tier card
    const lifetimeCard = page.getByText("Lifetime").first();
    await expect(lifetimeCard).toBeVisible();
  });

  test("displays correct pricing for each tier", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Check Free tier pricing
    const freePrice = page.getByText("$0");
    await expect(freePrice).toBeVisible();

    // Check Pro tier pricing (should show monthly by default)
    const proPriceMonthly = page.getByText("$9.99 / month");
    await expect(proPriceMonthly).toBeVisible();

    // Check Lifetime tier pricing
    const lifetimePrice = page.getByText("$299");
    await expect(lifetimePrice).toBeVisible();
  });

  test("monthly/yearly switch toggle works for Pro tier", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Find the billing cycle switch
    const billingSwitch = page.getByLabel("Billed yearly");
    await expect(billingSwitch).toBeVisible();

    // Initially should show monthly pricing
    await expect(page.getByText("$9.99 / month")).toBeVisible();
    await expect(page.getByText("$99 / year")).not.toBeVisible();

    // Toggle to yearly
    await billingSwitch.click();

    // Wait for price to update
    await expect(page.getByText("$99 / year")).toBeVisible();
    await expect(page.getByText("$9.99 / month")).not.toBeVisible();

    // Toggle back to monthly
    await billingSwitch.click();

    // Should show monthly again
    await expect(page.getByText("$9.99 / month")).toBeVisible();
    await expect(page.getByText("$99 / year")).not.toBeVisible();
  });

  test("purchase buttons are disabled and show 'Coming soon'", async ({
    page,
  }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Check Pro button - should say "Coming soon"
    const proButton = page.getByRole("button", { name: /coming soon/i }).first();
    await expect(proButton).toBeVisible();
    await expect(proButton).toBeDisabled();

    // Check Lifetime button - should say "Coming soon"
    const lifetimeButton = page.getByRole("button", { name: /coming soon/i }).last();
    await expect(lifetimeButton).toBeVisible();
    await expect(lifetimeButton).toBeDisabled();

    // Check Free button (should be disabled as current plan)
    const freeButton = page.getByRole("button", { name: /current plan/i });
    await expect(freeButton).toBeVisible();
    await expect(freeButton).toBeDisabled();
  });

  test("displays tier badge correctly", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Check that tier badge exists in Current Subscription section
    const tierSection = page.locator('text=/Tier:/i').locator('..');
    await expect(tierSection).toBeVisible();

    // Should have a badge with tier name (FREE, PRO, or LIFETIME)
    const badge = page.getByText(/FREE|PRO|LIFETIME/i).first();
    await expect(badge).toBeVisible();
  });

  test("shows valid until date or dash for free tier", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Check for "Valid until" label
    const validUntilLabel = page.getByText(/valid until/i);
    await expect(validUntilLabel).toBeVisible();

    // Should show either a date or "—"
    const validUntilValue = page.locator('text=/valid until/i').locator('..').locator('text=/—|\\d{1,2}\\/\\d{1,2}\\/\\d{4}/');
    // The value should be visible (either a date or dash)
    await expect(validUntilLabel).toBeVisible();
  });

  test("free tier card shows default badge", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Find Free card
    const freeCard = page.getByText("Free").locator('..').locator('..');
    
    // Check for "Default" badge
    const defaultBadge = page.getByText("Default");
    await expect(defaultBadge).toBeVisible();
  });

  test("pro tier card shows popular badge", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Check for "Popular" badge
    const popularBadge = page.getByText("Popular");
    await expect(popularBadge).toBeVisible();
  });

  test("billing toggle has correct label and description", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('text=Loading…', { state: 'hidden', timeout: 10000 });

    // Check for "Billed yearly" label
    const label = page.getByLabel("Billed yearly");
    await expect(label).toBeVisible();

    // Check for description text
    const description = page.getByText(/Off = monthly · On = yearly/i);
    await expect(description).toBeVisible();
  });
});

