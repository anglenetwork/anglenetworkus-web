import { NextResponse } from "next/server";
import { getSubscriptionStatus } from "@/app/lib/subscriptions/get-subscription-status";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getSubscriptionStatus(supabase);

    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load subscription status";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
