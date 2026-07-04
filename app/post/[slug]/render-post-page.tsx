import { notFound } from "next/navigation";
import ArticleFamilyPage from "@/app/components/article-family/ArticleFamilyPage";
import BottomArticleModule, {
  RELATED_MODULE_MODERN_TOTAL,
} from "@/app/components/PostPage/BottomArticleModule";
import { fetchArticleFamilyPage } from "@/app/lib/article-family/fetch";
import { loadLatestInCategory } from "@/app/lib/article-family/sidebars";

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
    article.tags?.reduce<Array<{ name: string; slug: string }>>((acc, tag) => {
      if (tag.title && tag.slug) {
        acc.push({ name: tag.title, slug: tag.slug });
      }
      return acc;
    }, []) ?? [];

  const categoryName = article.category?.title || undefined;
  const categoryHref = article.category?.slug
    ? `/category/${article.category.slug}`
    : undefined;

  return (
    <ArticleFamilyPage
      article={article}
      tags={tagsForSuggested}
      footer={({ relatedArticles }) => {
        const bottomSlice = (
          categoryLatest.length > 0 ? categoryLatest : relatedArticles
        ).slice(0, RELATED_MODULE_MODERN_TOTAL);

        return (
          bottomSlice.length > 0 && (
            <BottomArticleModule
              posts={bottomSlice}
              variant="modern"
              categoryName={categoryName}
              categoryHref={categoryHref}
            />
          )
        );
      }}
    />
  );
}
