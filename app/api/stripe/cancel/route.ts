import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the user's Stripe subscription
  const { data: subscription, error: subError } = await supabaseAdmin
    .from("stripe_subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subError) {
    return NextResponse.json(
      { error: `Failed to load subscription: ${subError.message}` },
      { status: 500 }
    );
  }

  if (!subscription?.stripe_subscription_id) {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 }
    );
  }

  try {
    // Cancel the subscription at period end
    const canceledSub = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    );

    // Update our database
    await supabaseAdmin
      .from("stripe_subscriptions")
      .update({
        cancel_at_period_end: true,
        status: canceledSub.status,
      })
      .eq("stripe_subscription_id", subscription.stripe_subscription_id);

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
    });
  } catch (err: any) {
    console.error("[stripe-cancel] Error canceling subscription:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
