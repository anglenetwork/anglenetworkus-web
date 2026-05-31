import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getBookmarkStatus(
  articleId: string,
): Promise<{ bookmarked: boolean; authenticated: boolean }> {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userErr || !user) {
    return { bookmarked: false, authenticated: false };
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .maybeSingle();

  if (error) {
    return { bookmarked: false, authenticated: true };
  }

  return { bookmarked: Boolean(data), authenticated: true };
}
