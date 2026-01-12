import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  tier: "pro" | "lifetime";
  cycle?: "month" | "year"; // required when tier=pro
};

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Body;

  if (body.tier === "pro" && body.cycle !== "month" && body.cycle !== "year") {
    return NextResponse.json({ error: "Invalid cycle" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // 1) Ensure Stripe customer exists
  const { data: existingCustomer, error: existingCustomerError } =
    await supabaseAdmin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

  if (existingCustomerError) {
    return NextResponse.json(
      { error: `Failed to load stripe customer: ${existingCustomerError.message}` },
      { status: 500 }
    );
  }

  let stripeCustomerId = existingCustomer?.stripe_customer_id ?? null;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });

    stripeCustomerId = customer.id;

    const { error: insertCustomerError } = await supabaseAdmin
      .from("stripe_customers")
      .insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
      });

    if (insertCustomerError) {
      return NextResponse.json(
        { error: `Failed to persist stripe customer: ${insertCustomerError.message}` },
        { status: 500 }
      );
    }
  }

  // 2) Pick price + mode
  let mode: "subscription" | "payment";
  let priceId: string;

  if (body.tier === "pro") {
    mode = "subscription";
    priceId =
      body.cycle === "month"
        ? process.env.STRIPE_PRICE_PRO_MONTHLY!
        : process.env.STRIPE_PRICE_PRO_YEARLY!;
  } else {
    mode = "payment";
    priceId = process.env.STRIPE_PRICE_LIFETIME!;
  }

  // 3) Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode,
    customer: stripeCustomerId,
    client_reference_id: user.id,
    metadata: {
      supabase_user_id: user.id,
      tier: body.tier,
      cycle: body.cycle ?? "",
    },
    ...(mode === "subscription"
      ? {
          // IMPORTANT: puts user id on the Subscription object for later invoice/subscription events
          subscription_data: {
            metadata: {
              supabase_user_id: user.id,
            },
          },
        }
      : {}),
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/myprofile/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/myprofile/subscriptions?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
