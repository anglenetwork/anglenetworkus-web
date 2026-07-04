import type { ComponentProps } from "react";
import type {
  ArticleFamily,
  ArticleSidebarPost,
} from "@/app/lib/article-family/types";
import PostBody from "@/app/components/PostPage/PostBody";
import PostArticleHeader from "@/app/components/PostPage/StandardPost/PostArticleHeader";
import PostTagsRow from "@/app/components/PostPage/StandardPost/PostTagsRow";
import PostAuthorCard from "@/app/components/PostPage/StandardPost/PostAuthorCard";
import PostSidebar from "@/app/components/PostPage/StandardPost/PostSidebar";

type PostArticleLayoutProps = {
  article: ArticleFamily;
  postBodyProps: ComponentProps<typeof PostBody>;
  canonicalArticlePath: string;
  popularReads: ArticleSidebarPost[];
  newsForYou: ArticleSidebarPost[];
  tags: Array<{ name: string; slug: string }>;
};

/**
 * Editorial redesign — exclusive to the `post` document type. Kept separate from
 * `StandardArticleLayout` (still used by `sponsored`) so that layout is unaffected.
 */
export function PostArticleLayout({
  article,
  postBodyProps,
  canonicalArticlePath,
  popularReads,
  newsForYou,
  tags,
}: PostArticleLayoutProps) {
  return (
    <article className="mt-4 lg:mt-8">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12 lg:gap-16">
        <div className="col-span-1 lg:col-span-8">
          <PostArticleHeader
            category={
              article.category?.title && article.category?.slug
                ? {
                    title: article.category.title,
                    slug: article.category.slug,
                  }
                : undefined
            }
            title={article.title || "Untitled"}
            excerpt={article.excerpt || undefined}
            date={article.date}
            updatedAt={article.updatedAt || null}
            author={article.author ?? undefined}
            readTime={article.readTime}
            slug={article.slug || undefined}
            articleId={article._id}
            sharePath={canonicalArticlePath}
          />

          <PostBody {...postBodyProps} variant="post" />

          <PostTagsRow tags={tags} />
          <PostAuthorCard author={article.author} />
        </div>

        {(popularReads.length > 0 || newsForYou.length > 0) && (
          <div className="col-span-1 lg:col-span-4">
            <PostSidebar popularReads={popularReads} newsForYou={newsForYou} />
          </div>
        )}
      </div>
    </article>
  );
}
