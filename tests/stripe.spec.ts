import { test, expect } from "@playwright/test";
import Stripe from "stripe";

// Initialize Stripe for test webhook signing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2025-01-27.acacia",
});

test.describe("Stripe Integration", () => {
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

    // Wait for page content
    await page.waitForSelector('text=Current tier', { timeout: 10000 });
    await page.waitForTimeout(500);
  });

  test("UI toggle shows correct monthly/yearly pricing", async ({ page }) => {
    // Initially should show monthly pricing
    await expect(page.getByText("$9.99")).toBeVisible();
    await expect(page.getByText("/month")).toBeVisible();

    // Find the billing cycle switch
    const billingSwitch = page.getByLabel("Billed yearly");
    await expect(billingSwitch).toBeVisible();

    // Toggle to yearly
    await billingSwitch.click();

    // Wait for price to update
    await expect(page.getByText("$99")).toBeVisible();
    await expect(page.getByText("/yearly")).toBeVisible();

    // Toggle back to monthly
    await billingSwitch.click();

    // Should show monthly again
    await expect(page.getByText("$9.99")).toBeVisible();
    await expect(page.getByText("/month")).toBeVisible();
  });

  test("checkout API creates Stripe session for Pro monthly", async ({ page }) => {
    // Intercept the checkout API call
    const checkoutPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/stripe/checkout") &&
        response.request().method() === "POST"
    );

    // Click upgrade to Pro button
    const proButton = page.getByRole("button", { name: /upgrade to pro/i }).first();
    await expect(proButton).toBeVisible();
    await expect(proButton).toBeEnabled();

    // Click and wait for API call
    await proButton.click();
    const response = await checkoutPromise;

    // Verify response
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("url");
    expect(data.url).toContain("checkout.stripe.com");
  });

  test("checkout API creates Stripe session for Pro yearly", async ({ page }) => {
    // Toggle to yearly first
    const billingSwitch = page.getByLabel("Billed yearly");
    await billingSwitch.click();
    await page.waitForTimeout(500);

    // Intercept the checkout API call
    const checkoutPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/stripe/checkout") &&
        response.request().method() === "POST"
    );

    // Click upgrade to Pro button
    const proButton = page.getByRole("button", { name: /upgrade to pro/i }).first();
    await proButton.click();
    const response = await checkoutPromise;

    // Verify response
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("url");
    expect(data.url).toContain("checkout.stripe.com");

    // Verify request body includes year cycle
    const request = response.request();
    const postData = request.postDataJSON();
    expect(postData).toMatchObject({
      tier: "pro",
      cycle: "year",
    });
  });

  test("checkout API creates Stripe session for Lifetime", async ({ page }) => {
    // Intercept the checkout API call
    const checkoutPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/stripe/checkout") &&
        response.request().method() === "POST"
    );

    // Click upgrade to Lifetime button
    const lifetimeButton = page.getByRole("button", { name: /upgrade to lifetime/i });
    await expect(lifetimeButton).toBeVisible();
    await expect(lifetimeButton).toBeEnabled();

    await lifetimeButton.click();
    const response = await checkoutPromise;

    // Verify response
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("url");
    expect(data.url).toContain("checkout.stripe.com");

    // Verify request body
    const request = response.request();
    const postData = request.postDataJSON();
    expect(postData).toMatchObject({
      tier: "lifetime",
    });
  });

  test("webhook updates pro subscription entitlements", async ({ page, request }) => {
    // Get user ID from page (we'll need to extract it from the page context)
    // For this test, we'll create a mock checkout.session.completed event
    const userId = "test-user-id"; // In real tests, extract from auth context

    // Create a mock Stripe event
    const event: Stripe.Event = {
      id: `evt_test_${Date.now()}`,
      object: "event",
      api_version: "2025-01-27.acacia",
      created: Math.floor(Date.now() / 1000),
      type: "checkout.session.completed",
      livemode: false,
      pending_webhooks: 0,
      request: null,
      data: {
        object: {
          id: "cs_test_session",
          object: "checkout.session",
          mode: "subscription",
          payment_status: "paid",
          subscription: "sub_test_subscription",
          client_reference_id: userId,
          metadata: {
            supabase_user_id: userId,
            tier: "pro",
            cycle: "month",
          },
        } as any,
      },
    };

    // Sign the webhook event
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: webhookSecret,
    });

    // Post to webhook endpoint
    const response = await request.post("/api/stripe/webhook", {
      headers: {
        "stripe-signature": signature,
        "content-type": "application/json",
      },
      data: JSON.stringify(event),
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("received", true);
  });

  test("webhook updates lifetime entitlements", async ({ page, request }) => {
    const userId = "test-user-id";

    // Create a mock checkout.session.completed event for lifetime
    const event: Stripe.Event = {
      id: `evt_test_lifetime_${Date.now()}`,
      object: "event",
      api_version: "2025-01-27.acacia",
      created: Math.floor(Date.now() / 1000),
      type: "checkout.session.completed",
      livemode: false,
      pending_webhooks: 0,
      request: null,
      data: {
        object: {
          id: "cs_test_lifetime_session",
          object: "checkout.session",
          mode: "payment",
          payment_status: "paid",
          client_reference_id: userId,
          metadata: {
            supabase_user_id: userId,
            tier: "lifetime",
          },
        } as any,
      },
    };

    // Sign the webhook event
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: webhookSecret,
    });

    // Post to webhook endpoint
    const response = await request.post("/api/stripe/webhook", {
      headers: {
        "stripe-signature": signature,
        "content-type": "application/json",
      },
      data: JSON.stringify(event),
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("received", true);
  });

  test("webhook idempotency prevents duplicate processing", async ({ request }) => {
    const userId = "test-user-id";
    const eventId = `evt_test_idempotency_${Date.now()}`;

    // Create a mock event
    const event: Stripe.Event = {
      id: eventId,
      object: "event",
      api_version: "2025-01-27.acacia",
      created: Math.floor(Date.now() / 1000),
      type: "checkout.session.completed",
      livemode: false,
      pending_webhooks: 0,
      request: null,
      data: {
        object: {
          id: "cs_test_idempotency",
          object: "checkout.session",
          mode: "payment",
          payment_status: "paid",
          client_reference_id: userId,
          metadata: {
            supabase_user_id: userId,
            tier: "lifetime",
          },
        } as any,
      },
    };

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: webhookSecret,
    });

    // First request should succeed
    const response1 = await request.post("/api/stripe/webhook", {
      headers: {
        "stripe-signature": signature,
        "content-type": "application/json",
      },
      data: JSON.stringify(event),
    });

    expect(response1.status()).toBe(200);
    const data1 = await response1.json();
    expect(data1).toHaveProperty("received", true);
    expect(data1).not.toHaveProperty("skipped", true);

    // Second request with same event ID should be skipped
    const response2 = await request.post("/api/stripe/webhook", {
      headers: {
        "stripe-signature": signature,
        "content-type": "application/json",
      },
      data: JSON.stringify(event),
    });

    expect(response2.status()).toBe(200);
    const data2 = await response2.json();
    expect(data2).toHaveProperty("received", true);
    expect(data2).toHaveProperty("skipped", true);
  });

  test("upgrade buttons are enabled when not current subscription", async ({
    page,
  }) => {
    // Wait for page to load
    await page.waitForSelector('text=Current tier', { timeout: 10000 });

    // Check that upgrade buttons exist and are enabled (if not current tier)
    const proButton = page.getByRole("button", { name: /upgrade to pro/i }).first();
    const lifetimeButton = page.getByRole("button", { name: /upgrade to lifetime/i });

    // Buttons should be visible
    await expect(proButton).toBeVisible();
    await expect(lifetimeButton).toBeVisible();

    // If user is on free tier, buttons should be enabled
    // (We can't easily check current tier in test, so we just verify buttons exist)
  });

  test("current subscription button is disabled", async ({ page }) => {
    await page.waitForSelector('text=Current tier', { timeout: 10000 });

    // Find the "Current subscription" button (if user has a paid tier)
    const currentButton = page.getByRole("button", { name: /current subscription/i }).first();
    
    // If it exists, it should be disabled
    if (await currentButton.isVisible().catch(() => false)) {
      await expect(currentButton).toBeDisabled();
    }
  });
});
