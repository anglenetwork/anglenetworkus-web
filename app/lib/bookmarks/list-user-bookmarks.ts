import { articleFamilyCanonicalHref } from "@/app/lib/article-family/routes";
import { isArticleFamilyDocType } from "@/app/lib/article-family/normalize";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCoverImage } from "@/sanity/lib/utils";
import { hydrateBookmarkArticles } from "./hydrate-bookmark-articles";
import {
  publishedSanityDocumentId,
  resolveBookmarkArticleTitle,
} from "./bookmark-article-helpers";

export type UserBookmark = {
  id: number;
  article_id: string;
  article_slug: string | null;
  created_at: string;
  article_title: string | null;
  article_type: string | null;
  article_href: string | null;
  article_date: string | null;
  article_cover: {
    src: string;
    alt: string;
  } | null;
};

export async function listUserBookmarks(): Promise<UserBookmark[]> {
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  const user = userData?.user;

  if (userErr || !user) return [];

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, article_id, article_slug, article_title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return [];

  const articlesByPublishedId = await hydrateBookmarkArticles(data);

  return data.map((bookmark) => {
    const article =
      articlesByPublishedId[publishedSanityDocumentId(bookmark.article_id)];
    const coverImage = article?.cover
      ? getCoverImage(article.cover, article.title || "Article")
      : null;

    const articleType =
      typeof article?._type === "string" &&
      isArticleFamilyDocType(article._type)
        ? article._type
        : null;
    const slug =
      typeof article?.slug === "string" ? article.slug : bookmark.article_slug;
    const articleHref =
      articleType && slug
        ? articleFamilyCanonicalHref(articleType, slug)
        : slug
          ? `/post/${slug}`
          : null;

    return {
      id: bookmark.id,
      article_id: bookmark.article_id,
      article_slug: bookmark.article_slug,
      created_at: bookmark.created_at,
      article_title: resolveBookmarkArticleTitle(
        article?.title,
        bookmark.article_title,
      ),
      article_type: articleType,
      article_href: articleHref,
      article_date: article?.date ?? null,
      article_cover: coverImage
        ? { src: coverImage.src, alt: coverImage.alt }
        : null,
    };
  });
}
