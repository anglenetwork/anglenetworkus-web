import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const articleId = url.searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userErr || !user) {
    // Not logged in is NOT an error for status checks
    return NextResponse.json(
      { bookmarked: false, authenticated: false },
      { status: 200 },
    );
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message, bookmarked: false, authenticated: true },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { bookmarked: !!data, authenticated: true },
    { status: 200 },
  );
}
