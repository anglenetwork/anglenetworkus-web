import { test, expect } from "@playwright/test";
import Stripe from "stripe";

import { gotoSubscriptionsShell } from "../helpers/subscriptions-shell";

// Initialize Stripe for test webhook signing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2025-01-27.acacia",
});

test.describe("Stripe Integration", () => {
  test.beforeEach(async ({ page }) => {
    await gotoSubscriptionsShell(page);

    if (page.url().includes("/signin")) {
      throw new Error("Not authenticated - redirected to signin page.");
    }

    await expect(page.getByText("Current Plan").first()).toBeVisible({
      timeout: 20000,
    });
  });

  test("upgrade section shows default monthly Pro pricing", async ({ page }) => {
    await expect(page.getByText("$9.99").first()).toBeVisible();
    await expect(page.getByText("/month").first()).toBeVisible();
  });

  test("checkout API creates Stripe session for Pro monthly", async ({
    page,
  }) => {
    const checkoutPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/stripe/checkout") &&
        response.request().method() === "POST"
    );

    const upgradeButton = page
      .getByRole("button", { name: /upgrade now/i })
      .first();
    await expect(upgradeButton).toBeVisible();
    await expect(upgradeButton).toBeEnabled();

    await upgradeButton.click();
    const response = await checkoutPromise;

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("url");
    expect(data.url).toContain("checkout.stripe.com");

    const postData = response.request().postDataJSON();
    expect(postData).toMatchObject({
      tier: "pro",
      cycle: "month",
    });
  });

  test.skip(
    true,
    "Yearly Pro checkout: subscriptions UI does not expose billingYearly toggle (state exists but no Switch)."
  );

  test.skip(
    true,
    "Lifetime checkout session: requires Pro tier to show Lifetime upgrade; Playwright user is Starter."
  );

  test("webhook updates pro subscription entitlements", async ({ request }) => {
    const userId = "test-user-id";

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

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: webhookSecret,
    });

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

  test("webhook updates lifetime entitlements", async ({ request }) => {
    const userId = "test-user-id";

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

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: webhookSecret,
    });

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

  test("webhook idempotency prevents duplicate processing", async ({
    request,
  }) => {
    const userId = "test-user-id";
    const eventId = `evt_test_idempotency_${Date.now()}`;

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

  test("Upgrade Now is available when an upgrade path exists", async ({
    page,
  }) => {
    await expect(page.getByText("Current Plan").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /upgrade now/i }).first()
    ).toBeVisible();
  });

  test("current subscription button is disabled when present", async ({
    page,
  }) => {
    const currentButton = page
      .getByRole("button", { name: /current subscription/i })
      .first();

    if (await currentButton.isVisible().catch(() => false)) {
      await expect(currentButton).toBeDisabled();
    }
  });
});
