import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleFamilyPage from "@/app/components/article-family/ArticleFamilyPage";
import BottomArticleModule, {
  RELATED_MODULE_MODERN_TOTAL,
} from "@/app/components/PostPage/BottomArticleModule";
import { SuggestedTags } from "@/app/components/SuggestedTags";
import { fetchArticleFamilyPage } from "@/app/lib/article-family/fetch";
import { buildArticleFamilyMetadata } from "@/app/lib/article-family/metadata";
import { loadLatestInCategory } from "@/app/lib/article-family/sidebars";

export async function buildPostPageMetadata(
  slug: string,
  id?: string,
): Promise<Metadata> {
  const article = await fetchArticleFamilyPage({ type: "post", slug, id });
  if (!article) {
    return { title: "Post Not Found" };
  }
  return buildArticleFamilyMetadata(article);
}

export async function RenderPostPage({
  slug,
  id,
}: {
  slug: string;
  id?: string;
}) {
  const article = await fetchArticleFamilyPage({ type: "post", slug, id });
  if (!article) {
    notFound();
  }

  const categoryLatest = await loadLatestInCategory(
    article,
    RELATED_MODULE_MODERN_TOTAL,
  );

  const tagsForSuggested =
    article.tags
      ?.filter((tag) => tag.title && tag.slug)
      .map((tag) => ({
        name: tag.title as string,
        slug: tag.slug as string,
      })) ?? [];

  const categoryName = article.category?.title || undefined;
  const categoryHref = article.category?.slug
    ? `/category/${article.category.slug}`
    : undefined;

  return (
    <ArticleFamilyPage
      article={article}
      footer={({ relatedArticles }) => {
        const bottomSlice = (
          categoryLatest.length > 0 ? categoryLatest : relatedArticles
        ).slice(0, RELATED_MODULE_MODERN_TOTAL);

        return (
          <>
            <SuggestedTags tags={tagsForSuggested} />
            {bottomSlice.length > 0 && (
              <BottomArticleModule
                posts={bottomSlice}
                variant="modern"
                categoryName={categoryName}
                categoryHref={categoryHref}
              />
            )}
          </>
        );
      }}
    />
  );
}
