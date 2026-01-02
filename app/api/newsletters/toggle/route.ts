import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AVAILABLE_NEWSLETTERS } from "@/lib/constants/newsletters";

// Server-side allowlist
const ALLOWED_KEYS = new Set(
  AVAILABLE_NEWSLETTERS.map((newsletter) => newsletter.key)
);

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const newsletterKey = String(body?.newsletterKey ?? "");
  const enabled = Boolean(body?.enabled);

  if (!newsletterKey) {
    return NextResponse.json(
      { error: "Missing newsletterKey" },
      { status: 400 }
    );
  }

  if (!ALLOWED_KEYS.has(newsletterKey)) {
    return NextResponse.json(
      { error: "Invalid newsletter key" },
      { status: 400 }
    );
  }

  // Check if preference exists
  const { data: existing, error: existErr } = await supabase
    .from("newsletter_preferences")
    .select("id")
    .eq("user_id", user.id)
    .eq("newsletter_key", newsletterKey)
    .maybeSingle();

  if (existErr) {
    return NextResponse.json({ error: existErr.message }, { status: 500 });
  }

  if (existing?.id) {
    // Update existing preference
    const { error: updateError } = await supabase
      .from("newsletter_preferences")
      .update({
        enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Insert new preference
  const { error: insertError } = await supabase
    .from("newsletter_preferences")
    .insert({
      user_id: user.id,
      newsletter_key: newsletterKey,
      enabled,
      updated_at: new Date().toISOString(),
    });

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}


