import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  when: "period_end" | "now";
};

function toIsoFromUnixSeconds(sec: number) {
  return new Date(sec * 1000).toISOString();
}

async function must<T>(
  promise: Promise<{ data: T; error: any }>,
  label: string
): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    console.error(`[cancel-subscription] Supabase error at ${label}:`, error);
    throw error;
  }
  return data;
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    if (body.when !== "period_end" && body.when !== "now") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Find the latest subscription for this user
    const rows = await must(
      supabaseAdmin
        .from("stripe_subscriptions")
        .select("stripe_subscription_id,status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1) as unknown as Promise<{ data: any[]; error: any }>,
      "load stripe_subscriptions"
    );

    const subRow = (rows as any[])[0];
    if (!subRow?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "No Stripe subscription found for this user" },
        { status: 400 }
      );
    }

    const subId = subRow.stripe_subscription_id as string;

    // Call Stripe
    let updatedSub;
    if (body.when === "period_end") {
      updatedSub = await stripe.subscriptions.update(subId, {
        cancel_at_period_end: true,
      });
    } else {
      // immediate cancellation
      updatedSub = await stripe.subscriptions.cancel(subId);
    }

    // Update local stripe_subscriptions row for instant UI (webhook will also update)
    const currentPeriodEndIso = toIsoFromUnixSeconds(updatedSub.current_period_end);

    await must(
      supabaseAdmin
        .from("stripe_subscriptions")
        .upsert(
          {
            user_id: user.id,
            stripe_subscription_id: updatedSub.id,
            status: updatedSub.status,
            price_id: updatedSub.items.data?.[0]?.price?.id ?? null,
            current_period_end: currentPeriodEndIso,
            cancel_at_period_end: updatedSub.cancel_at_period_end,
          },
          { onConflict: "stripe_subscription_id" }
        ) as unknown as Promise<{ data: unknown; error: any }>,
      "upsert stripe_subscriptions"
    );

    // Optional: update your public.subscriptions table immediately.
    // Recommended behavior:
    // - If cancel_at_period_end: keep tier=pro, but status="canceling" and valid_until=period_end
    // - If canceled now: downgrade to free immediately
    if (body.when === "period_end") {
      await must(
        supabaseAdmin
          .from("subscriptions")
          .upsert(
            {
              user_id: user.id,
              tier: "pro",
              status: "canceling",
              valid_until: currentPeriodEndIso,
              source: "stripe",
            } as any,
            { onConflict: "user_id" }
          ) as unknown as Promise<{ data: unknown; error: any }>,
        "update subscriptions canceling"
      );
    } else {
      await must(
        supabaseAdmin
          .from("subscriptions")
          .upsert(
            {
              user_id: user.id,
              tier: "free",
              status: "active",
              billing_cycle: null,
              valid_until: null,
              source: "stripe",
            } as any,
            { onConflict: "user_id" }
          ) as unknown as Promise<{ data: unknown; error: any }>,
        "downgrade subscriptions to free"
      );
    }

    return NextResponse.json({
      ok: true,
      stripe_subscription_id: updatedSub.id,
      cancel_at_period_end: updatedSub.cancel_at_period_end,
      current_period_end: currentPeriodEndIso,
      status: updatedSub.status,
    });
  } catch (err: any) {
    console.error("[cancel-subscription] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Cancel subscription failed" },
      { status: 500 }
    );
  }
}
