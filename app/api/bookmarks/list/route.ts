import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsByIdsQuery } from "@/sanity/lib/queries";
import { getCoverImage } from "@/sanity/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, article_id, article_slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message, bookmarks: [] },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ bookmarks: [] }, { status: 200 });
  }

  // Extract article IDs from bookmarks
  const articleIds = data.map((bookmark) => bookmark.article_id);

  // Fetch article data from Sanity
  let articlesData: Record<string, any> = {};
  try {
    const articles = await sanityFetch({
      query: postsByIdsQuery,
      params: { ids: articleIds },
    });

    // Create a map of article_id -> article data for quick lookup
    if (Array.isArray(articles)) {
      articles.forEach((article: any) => {
        if (article?._id) {
          articlesData[article._id] = article;
        }
      });
    }
  } catch (sanityError) {
    console.error("Error fetching articles from Sanity:", sanityError);
    // Continue with empty articlesData - bookmarks will show without article data
  }

  // Combine bookmark data with article data
  const bookmarksWithArticles = data.map((bookmark) => {
    const article = articlesData[bookmark.article_id];
    const coverImage = article?.cover
      ? getCoverImage(article.cover, article.title || "Article")
      : null;

    return {
      id: bookmark.id,
      article_id: bookmark.article_id,
      article_slug: bookmark.article_slug,
      created_at: bookmark.created_at,
      // Article data from Sanity
      article_title: article?.title || null,
      article_date: article?.date || null,
      article_cover: coverImage
        ? {
            src: coverImage.src,
            alt: coverImage.alt,
          }
        : null,
    };
  });

  return NextResponse.json(
    { bookmarks: bookmarksWithArticles },
    { status: 200 }
  );
}

