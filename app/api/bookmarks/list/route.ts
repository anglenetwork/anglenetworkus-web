import { NextResponse } from "next/server";
import { listUserBookmarks } from "@/app/lib/bookmarks/list-user-bookmarks";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookmarks = await listUserBookmarks();
    return NextResponse.json({ bookmarks }, { status: 200 });
  } catch (error) {
    console.error("Error listing bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to list bookmarks", bookmarks: [] },
      { status: 500 },
    );
  }
}
