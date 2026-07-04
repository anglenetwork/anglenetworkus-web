import type { ComponentProps, ReactNode } from "react";
import { after } from "next/server";
import type { ArticleFamily } from "@/app/lib/article-family/types";
import { buildArticlePageJsonLd } from "@/app/lib/article-family/structured-data";
import { JsonLdScript } from "@/app/components/seo/json-ld-script";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import PostBody from "@/app/components/PostPage/PostBody";
import { ArticleCoverPreload } from "@/app/components/PostPage/ArticleCoverPreload";
import { getCoverImage } from "@/sanity/lib/utils";
import ArticleViewTracker from "@/app/components/article-family/ArticleViewTracker";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { articleFamilyCanonicalHref } from "@/app/lib/article-family/routes";
import { loadArticlePageSidebars } from "@/app/lib/article-family/sidebars";
import { trackCategoryView } from "@/app/lib/analytics/track-category-view";
import { EditorialArticleLayout } from "./article-family-editorial-layout";
import { StandardArticleLayout } from "./article-family-standard-layout";
import { PostArticleLayout } from "./article-family-post-layout";

type ArticleFamilySidebarData = Awaited<
  ReturnType<typeof loadArticlePageSidebars>
>;

type ArticleFamilyFooter =
  | ReactNode
  | ((sidebarData: ArticleFamilySidebarData) => ReactNode);

export default async function ArticleFamilyPage({
  article,
  footer,
  tags = [],
}: {
  article: ArticleFamily;
  /** Suggested tags + bottom module */
  footer?: ArticleFamilyFooter;
  /** `post` type only — rendered inside the main column via PostArticleLayout */
  tags?: Array<{ name: string; slug: string }>;
}) {
  const [settings, sidebarData] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
      stega: false,
    }),
    loadArticlePageSidebars(article),
  ]);
  const { article: articleLd, breadcrumb: breadcrumbLd } =
    buildArticlePageJsonLd({
      article,
      settings,
      demoTitle: demo.title,
    });
  const { newsForYou, popularReads } = sidebarData;
  const footerContent =
    typeof footer === "function" ? footer(sidebarData) : footer;

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article",
  );
  const coverImageUrl = coverData?.src || null;

  const showEditorialChrome =
    article._type === "opinion" || article._type === "analysis";
  const isStandardPost = article._type === "post";
  const canonicalArticlePath = articleFamilyCanonicalHref(
    article._type,
    article.slug,
  );
  const postBodyProps: ComponentProps<typeof PostBody> = {
    sharePath: canonicalArticlePath,
    body: article.body,
    cover: article.cover as ComponentProps<typeof PostBody>["cover"],
    imageGallery: article.imageGallery as ComponentProps<
      typeof PostBody
    >["imageGallery"],
    title: article.title || "Untitled",
    author: article.author ?? undefined,
    date: article.date,
    updatedAt: article.updatedAt || null,
    slug: article.slug || undefined,
    articleId: article._id,
    insetPopularReads: popularReads,
  };

  if (article.category?.slug) {
    after(() => trackCategoryView(article.category!.slug!));
  }

  return (
    <div className="min-h-screen">
      <JsonLdScript data={articleLd} />
      <JsonLdScript data={breadcrumbLd} />

      {coverImageUrl && <ArticleCoverPreload src={coverImageUrl} />}

      <ArticleViewTracker articleId={article._id} articleType={article._type} />

      <SitePageWidth className="py-4">
        {showEditorialChrome ? (
          <EditorialArticleLayout
            article={article}
            postBodyProps={postBodyProps}
          />
        ) : isStandardPost ? (
          <PostArticleLayout
            article={article}
            postBodyProps={postBodyProps}
            canonicalArticlePath={canonicalArticlePath}
            popularReads={popularReads}
            newsForYou={newsForYou}
            tags={tags}
          />
        ) : (
          <StandardArticleLayout
            article={article}
            postBodyProps={postBodyProps}
            canonicalArticlePath={canonicalArticlePath}
            popularReads={popularReads}
            newsForYou={newsForYou}
          />
        )}

        {footerContent}
      </SitePageWidth>
    </div>
  );
}
