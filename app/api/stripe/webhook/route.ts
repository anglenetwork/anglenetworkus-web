import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toIsoFromUnixSeconds(sec: number) {
  return new Date(sec * 1000).toISOString();
}

// Throw on any Supabase error so we don't silently return 200 while doing nothing.
async function must<T>(
  promise: Promise<{ data: T; error: any }>,
  label: string,
): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    console.error(`[stripe-webhook] Supabase error at ${label}:`, error);
    throw error;
  }
  return data;
}

async function markEventProcessed(eventId: string): Promise<boolean> {
  // returns true if inserted; false if already processed
  const { error } = await supabaseAdmin
    .from("stripe_webhook_events")
    .insert({ event_id: eventId });

  if (!error) return true;

  // 23505 = unique_violation (duplicate primary key)
  if ((error as any).code === "23505") return false;

  console.error("[stripe-webhook] stripe_webhook_events insert failed:", error);
  throw error;
}

async function upsertSubscription(params: {
  userId: string;
  tier: "free" | "pro" | "lifetime";
  validUntilIso: string | null;
  billingCycle: "month" | "year" | null;
  status: string;
  source: string;
}) {
  await must(
    supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: params.userId,
        tier: params.tier,
        valid_until: params.validUntilIso,
        billing_cycle: params.billingCycle,
        status: params.status,
        source: params.source,
      },
      { onConflict: "user_id" },
    ) as unknown as Promise<{ data: unknown; error: any }>,
    `subscriptions upsert ${params.tier}`,
  );
}

async function upsertStripeSubscriptionRow(params: {
  userId: string;
  subscriptionId: string;
  status?: string | null;
  priceId?: string | null;
  currentPeriodEndIso?: string | null;
  cancelAtPeriodEnd?: boolean | null;
}) {
  await must(
    supabaseAdmin.from("stripe_subscriptions").upsert(
      {
        user_id: params.userId,
        stripe_subscription_id: params.subscriptionId,
        status: params.status ?? null,
        price_id: params.priceId ?? null,
        current_period_end: params.currentPeriodEndIso ?? null,
        cancel_at_period_end: params.cancelAtPeriodEnd ?? null,
      },
      { onConflict: "stripe_subscription_id" },
    ) as unknown as Promise<{ data: unknown; error: any }>,
    "stripe_subscriptions upsert",
  );
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe-Signature" },
      { status: 400 },
    );
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error("[stripe-webhook] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Server misconfigured (missing webhook secret)" },
      { status: 500 },
    );
  }

  // IMPORTANT: raw body required for signature verification
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error(
      "[stripe-webhook] Signature verification failed:",
      err?.message,
    );
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 },
    );
  }

  console.log("[stripe-webhook] received", event.type, event.id);

  // idempotency
  const inserted = await markEventProcessed(event.id);
  if (!inserted) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId =
          (session.metadata?.supabase_user_id as string | undefined) ??
          (session.client_reference_id as string | undefined);

        console.log(
          "[stripe-webhook] checkout.session.completed userId:",
          userId,
        );
        console.log("[stripe-webhook] session.mode:", session.mode);
        console.log(
          "[stripe-webhook] session.payment_status:",
          session.payment_status,
        );
        console.log(
          "[stripe-webhook] session.subscription:",
          session.subscription,
        );

        if (!userId) break;

        // One-time lifetime
        if (session.mode === "payment" && session.payment_status === "paid") {
          const validUntilIso = new Date(
            Date.now() + 99 * 365 * 24 * 60 * 60 * 1000,
          ).toISOString();

          await upsertSubscription({
            userId,
            tier: "lifetime",
            validUntilIso,
            billingCycle: null,
            status: "active",
            source: "stripe",
          });
          break;
        }

        // Subscription (Pro)
        if (session.mode === "subscription" && session.subscription) {
          const subId = String(session.subscription);

          const sub = await stripe.subscriptions.retrieve(subId);

          // Ensure subscription has metadata (safety measure)
          if (!sub.metadata?.supabase_user_id && userId) {
            await stripe.subscriptions.update(subId, {
              metadata: {
                ...sub.metadata,
                supabase_user_id: userId,
              },
            });
          }

          const currentPeriodEndIso = toIsoFromUnixSeconds(
            sub.current_period_end,
          );
          const priceId = sub.items.data?.[0]?.price?.id ?? null;

          // Derive billing cycle from price ID
          const billingCycle =
            priceId === process.env.STRIPE_PRICE_PRO_YEARLY
              ? "year"
              : priceId === process.env.STRIPE_PRICE_PRO_MONTHLY
                ? "month"
                : null;

          await upsertStripeSubscriptionRow({
            userId,
            subscriptionId: sub.id,
            status: sub.status,
            priceId,
            currentPeriodEndIso,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          });

          await upsertSubscription({
            userId,
            tier: "pro",
            validUntilIso: currentPeriodEndIso,
            billingCycle,
            status: sub.status,
            source: "stripe",
          });
        }

        break;
      }

      case "invoice.payment_succeeded": {
        // Renewals (and often initial invoice)
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription
          ? String(invoice.subscription)
          : null;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        let userId = sub.metadata?.supabase_user_id as string | undefined;

        // Fallback: look up customer if metadata missing
        if (!userId && sub.customer) {
          const customerId =
            typeof sub.customer === "string" ? sub.customer : sub.customer.id;
          const customer = await stripe.customers.retrieve(customerId);
          if (typeof customer !== "string" && !customer.deleted) {
            userId = customer.metadata?.supabase_user_id as string | undefined;
          }
        }

        console.log(
          "[stripe-webhook] invoice.payment_succeeded userId:",
          userId,
        );

        if (!userId) break;

        const currentPeriodEndIso = toIsoFromUnixSeconds(
          sub.current_period_end,
        );
        const priceId = sub.items.data?.[0]?.price?.id ?? null;

        // Derive billing cycle from price ID
        const billingCycle =
          priceId === process.env.STRIPE_PRICE_PRO_YEARLY
            ? "year"
            : priceId === process.env.STRIPE_PRICE_PRO_MONTHLY
              ? "month"
              : null;

        await upsertStripeSubscriptionRow({
          userId,
          subscriptionId: sub.id,
          status: sub.status,
          priceId,
          currentPeriodEndIso,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });

        await upsertSubscription({
          userId,
          tier: "pro",
          validUntilIso: currentPeriodEndIso,
          billingCycle,
          status: sub.status,
          source: "stripe",
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription
          ? String(invoice.subscription)
          : null;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        let userId = sub.metadata?.supabase_user_id as string | undefined;

        // Fallback: look up customer if metadata missing
        if (!userId && sub.customer) {
          const customerId =
            typeof sub.customer === "string" ? sub.customer : sub.customer.id;
          const customer = await stripe.customers.retrieve(customerId);
          if (typeof customer !== "string" && !customer.deleted) {
            userId = customer.metadata?.supabase_user_id as string | undefined;
          }
        }

        console.log("[stripe-webhook] invoice.payment_failed userId:", userId);

        if (!userId) break;

        const currentPeriodEndIso = toIsoFromUnixSeconds(
          sub.current_period_end,
        );

        await upsertStripeSubscriptionRow({
          userId,
          subscriptionId: sub.id,
          status: sub.status,
          priceId: sub.items.data?.[0]?.price?.id ?? null,
          currentPeriodEndIso,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });

        // Access remains until valid_until; do not revoke immediately.
        // Update subscription status but keep valid_until as the last known period end
        await must(
          supabaseAdmin
            .from("subscriptions")
            .update({ status: sub.status })
            .eq("user_id", userId) as unknown as Promise<{
            data: unknown;
            error: any;
          }>,
          "subscriptions update status (payment failed)",
        );

        break;
      }

      case "customer.subscription.updated": {
        // Handle subscription updates (e.g., when cancel_at_period_end changes)
        const sub = event.data.object as Stripe.Subscription;
        let userId = sub.metadata?.supabase_user_id as string | undefined;

        // Fallback: look up customer if metadata missing
        if (!userId && sub.customer) {
          const customerId =
            typeof sub.customer === "string" ? sub.customer : sub.customer.id;
          const customer = await stripe.customers.retrieve(customerId);
          if (typeof customer !== "string" && !customer.deleted) {
            userId = customer.metadata?.supabase_user_id as string | undefined;
          }
        }

        if (!userId) break;

        const currentPeriodEndIso = toIsoFromUnixSeconds(
          sub.current_period_end,
        );
        const priceId = sub.items.data?.[0]?.price?.id ?? null;

        // Derive billing cycle from price ID
        const billingCycle =
          priceId === process.env.STRIPE_PRICE_PRO_YEARLY
            ? "year"
            : priceId === process.env.STRIPE_PRICE_PRO_MONTHLY
              ? "month"
              : null;

        await upsertStripeSubscriptionRow({
          userId,
          subscriptionId: sub.id,
          status: sub.status,
          priceId,
          currentPeriodEndIso,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });

        // Update subscription status
        // If cancel_at_period_end is true, set status to "canceling" and keep tier=pro
        // Otherwise, use the subscription status from Stripe
        const subscriptionStatus = sub.cancel_at_period_end
          ? "canceling"
          : sub.status === "canceled" || sub.status === "unpaid"
            ? "canceled"
            : "active";

        await must(
          supabaseAdmin
            .from("subscriptions")
            .update({
              status: subscriptionStatus,
              valid_until: currentPeriodEndIso,
              tier: "pro",
              billing_cycle: billingCycle,
            })
            .eq("user_id", userId) as unknown as Promise<{
            data: unknown;
            error: any;
          }>,
          "subscriptions update (subscription updated)",
        );

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        let userId = sub.metadata?.supabase_user_id as string | undefined;

        // Fallback: look up customer if metadata missing
        if (!userId && sub.customer) {
          const customerId =
            typeof sub.customer === "string" ? sub.customer : sub.customer.id;
          const customer = await stripe.customers.retrieve(customerId);
          if (typeof customer !== "string" && !customer.deleted) {
            userId = customer.metadata?.supabase_user_id as string | undefined;
          }
        }

        console.log(
          "[stripe-webhook] customer.subscription.deleted userId:",
          userId,
        );

        if (!userId) break;

        const currentPeriodEndIso = toIsoFromUnixSeconds(
          sub.current_period_end,
        );

        await upsertStripeSubscriptionRow({
          userId,
          subscriptionId: sub.id,
          status: sub.status,
          priceId: sub.items.data?.[0]?.price?.id ?? null,
          currentPeriodEndIso,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });

        // Set status to 'canceled' but keep valid_until as the last known period end
        // (so access can continue until it expires)
        await must(
          supabaseAdmin
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("user_id", userId) as unknown as Promise<{
            data: unknown;
            error: any;
          }>,
          "subscriptions set canceled (subscription deleted)",
        );

        break;
      }

      default:
        // ignore other events for now
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    // Return 500 so Stripe retries if something failed.
    console.error("[stripe-webhook] handler error:", err);
    return NextResponse.json(
      { error: err.message ?? "Webhook handler error" },
      { status: 500 },
    );
  }
}
