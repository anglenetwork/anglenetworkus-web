import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const articleId = body?.articleId as string | undefined;
  const articleSlug = (body?.articleSlug as string | null | undefined) ?? null;

  if (!articleId) {
    return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
  }

  // Check if bookmark exists
  const { data: existing, error: existErr } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .maybeSingle();

  if (existErr) {
    return NextResponse.json({ error: existErr.message }, { status: 500 });
  }

  if (existing?.id) {
    // Delete
    const { error: delErr } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", existing.id);

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ bookmarked: false }, { status: 200 });
  }

  // Insert (idempotent with unique constraint)
  const { error: insErr } = await supabase.from("bookmarks").insert({
    user_id: user.id,
    article_id: articleId,
    article_slug: articleSlug,
  });

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ bookmarked: true }, { status: 200 });
}
