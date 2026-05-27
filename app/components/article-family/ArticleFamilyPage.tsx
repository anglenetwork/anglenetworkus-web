import type { ComponentProps, ReactNode } from "react";
import type { ArticleFamily } from "@/app/lib/article-family/types";
import {
  buildArticlePageJsonLd,
  jsonLdScriptContent,
} from "@/app/lib/article-family/structured-data";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import PostHeader from "@/app/components/PostPage/PostHeader";
import PostBody from "@/app/components/PostPage/PostBody";
import PostSelectedNews from "@/app/components/PostPage/PostSelectedNews";
import { ArticleCoverPreload } from "@/app/components/PostPage/ArticleCoverPreload";
import { getCoverImage } from "@/sanity/lib/utils";
import ArticleViewTracker from "@/app/components/article-family/ArticleViewTracker";
import CategoryViewTracker from "@/app/post/[slug]/CategoryViewTracker";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { articleFamilyCanonicalHref } from "@/app/lib/article-family/routes";
import { loadArticlePageSidebars } from "@/app/lib/article-family/sidebars";
import { NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS } from "@/app/components/PostPage/PostBody/constants";
import {
  nonRegularPostAnalysisFocus,
  nonRegularPostDisclosure,
  nonRegularPostExcerpt,
  nonRegularPostPresenterName,
  nonRegularPostTitle,
  nonRegularPostTransparencyBody,
  nonRegularPostTransparencyHeading,
  nonRegularPostTransparencySubheading,
  nonRegularPostTypeBadge,
  nonRegularPostTypeLabel,
} from "@/app/lib/typography/posts";
import { cn } from "@/lib/utils";

type ArticleFamilySidebarData = Awaited<
  ReturnType<typeof loadArticlePageSidebars>
>;

type ArticleFamilyFooter =
  | ReactNode
  | ((sidebarData: ArticleFamilySidebarData) => ReactNode);

function TypeBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "mb-2 inline-block rounded-sm border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-neutral-800",
        nonRegularPostTypeBadge,
      )}
    >
      {children}
    </span>
  );
}

export default async function ArticleFamilyPage({
  article,
  footer,
}: {
  article: ArticleFamily;
  /** Suggested tags + bottom module */
  footer?: ArticleFamilyFooter;
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

  const showOpinionChrome = article._type === "opinion";
  const showAnalysisChrome = article._type === "analysis";
  const showSponsoredChrome = article._type === "sponsored";
  const showEditorialChrome = showOpinionChrome || showAnalysisChrome;
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

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScriptContent(articleLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScriptContent(breadcrumbLd),
        }}
      />

      {coverImageUrl && <ArticleCoverPreload src={coverImageUrl} />}

      <ArticleViewTracker articleId={article._id} articleType={article._type} />

      {article.category?.slug && (
        <CategoryViewTracker categorySlug={article.category.slug} />
      )}

      <SitePageWidth className="py-4">
        {showEditorialChrome ? (
          <article className="mt-4 lg:mt-8">
            <header
              className={cn(
                "not-prose mb-2",
                NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS,
              )}
            >
              <div>
                <p className={cn("mb-2", nonRegularPostTypeLabel)}>
                  {showOpinionChrome ? "Opinion" : "Analysis"}
                </p>
                <h1 className={nonRegularPostTitle}>
                  {article.title || "Untitled"}
                </h1>
                {article.excerpt && (
                  <p className={cn("mt-4 max-w-3xl", nonRegularPostExcerpt)}>
                    {article.excerpt}
                  </p>
                )}
              </div>

              {showAnalysisChrome && article.analysisFocus && (
                <p
                  className={cn(
                    "mt-3 max-w-3xl border-neutral-300 border-l-4 bg-neutral-100 py-2 pl-4",
                    nonRegularPostAnalysisFocus,
                  )}
                >
                  {article.analysisFocus}
                </p>
              )}

              {showOpinionChrome && article.disclosure && (
                <aside
                  className={cn(
                    "mt-3 max-w-3xl border-neutral-300 border-l-4 bg-neutral-100 py-2 pl-4",
                    nonRegularPostDisclosure,
                  )}
                >
                  {article.disclosure}
                </aside>
              )}
            </header>

            <PostBody {...postBodyProps} variant="editorial" />

            {showAnalysisChrome &&
              (article.methodologyNote || article.sourcesNote) && (
                <section
                  className={cn(
                    "not-prose mt-10 border-neutral-200 border-t pt-8",
                    NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS,
                  )}
                  aria-labelledby="transparency-heading"
                >
                  <h2
                    id="transparency-heading"
                    className={cn("mb-4", nonRegularPostTransparencyHeading)}
                  >
                    Context and transparency
                  </h2>
                  {article.methodologyNote && (
                    <div className="mb-4">
                      <h3
                        className={cn(
                          "mb-1",
                          nonRegularPostTransparencySubheading,
                        )}
                      >
                        Methodology
                      </h3>
                      <p
                        className={cn(
                          "whitespace-pre-wrap",
                          nonRegularPostTransparencyBody,
                        )}
                      >
                        {article.methodologyNote}
                      </p>
                    </div>
                  )}
                  {article.sourcesNote && (
                    <div>
                      <h3
                        className={cn(
                          "mb-1",
                          nonRegularPostTransparencySubheading,
                        )}
                      >
                        Sources
                      </h3>
                      <p
                        className={cn(
                          "whitespace-pre-wrap",
                          nonRegularPostTransparencyBody,
                        )}
                      >
                        {article.sourcesNote}
                      </p>
                    </div>
                  )}
                </section>
              )}
          </article>
        ) : (
          <article className="mt-4 lg:mt-8">
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-12 lg:gap-16">
              <div className="col-span-1 lg:col-span-8">
                <header className="not-prose mb-6 space-y-3">
                  {showSponsoredChrome && <TypeBadge>Sponsored</TypeBadge>}

                  {showSponsoredChrome && article.sponsorAttribution && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 text-sm">
                      <p className={nonRegularPostPresenterName}>
                        Presented by {article.sponsorAttribution.sponsorName}
                      </p>
                      {article.sponsorAttribution.sponsorUrl && (
                        <a
                          href={article.sponsorAttribution.sponsorUrl}
                          className="text-amber-900 underline underline-offset-2"
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                        >
                          Learn more about this partner
                        </a>
                      )}
                    </div>
                  )}

                  {showSponsoredChrome &&
                    article.sponsorAttribution?.disclosure && (
                      <div className="rounded-md border border-neutral-300 bg-neutral-50 p-4 text-neutral-800 text-sm leading-relaxed">
                        {article.sponsorAttribution.disclosure}
                      </div>
                    )}

                  <PostHeader
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
                    slug={article.slug || undefined}
                    articleId={article._id}
                    sharePath={canonicalArticlePath}
                  />

                  {showAnalysisChrome && article.analysisFocus && (
                    <p
                      className={cn(
                        "mt-3 border-neutral-400 border-l-4 pl-3",
                        nonRegularPostAnalysisFocus,
                      )}
                    >
                      {article.analysisFocus}
                    </p>
                  )}

                  {showOpinionChrome && article.disclosure && (
                    <aside className="rounded-md bg-neutral-100 px-4 py-3">
                      <p className={nonRegularPostDisclosure}>
                        {article.disclosure}
                      </p>
                    </aside>
                  )}
                </header>

                <PostBody
                  {...postBodyProps}
                  mediaPresentation={
                    showSponsoredChrome ? "nonRegularCover" : "default"
                  }
                />

                {showAnalysisChrome &&
                  (article.methodologyNote || article.sourcesNote) && (
                    <section
                      className="not-prose mt-10 border-neutral-200 border-t pt-8"
                      aria-labelledby="transparency-heading"
                    >
                      <h2
                        id="transparency-heading"
                        className={cn(
                          "mb-4",
                          nonRegularPostTransparencyHeading,
                        )}
                      >
                        Context and transparency
                      </h2>
                      {article.methodologyNote && (
                        <div className="mb-4">
                          <h3
                            className={cn(
                              "mb-1",
                              nonRegularPostTransparencySubheading,
                            )}
                          >
                            Methodology
                          </h3>
                          <p
                            className={cn(
                              "whitespace-pre-wrap",
                              nonRegularPostTransparencyBody,
                            )}
                          >
                            {article.methodologyNote}
                          </p>
                        </div>
                      )}
                      {article.sourcesNote && (
                        <div>
                          <h3
                            className={cn(
                              "mb-1",
                              nonRegularPostTransparencySubheading,
                            )}
                          >
                            Sources
                          </h3>
                          <p
                            className={cn(
                              "whitespace-pre-wrap",
                              nonRegularPostTransparencyBody,
                            )}
                          >
                            {article.sourcesNote}
                          </p>
                        </div>
                      )}
                    </section>
                  )}
              </div>

              {(popularReads.length > 0 || newsForYou.length > 0) && (
                <div className="col-span-1 flex flex-col gap-8 lg:col-span-4">
                  {popularReads.length > 0 && (
                    <div
                      className="hidden lg:block"
                      data-testid="sidebar-popular-reads"
                    >
                      <PostSelectedNews
                        latestNews={popularReads}
                        title="Popular Reads"
                      />
                    </div>
                  )}
                  {newsForYou.length > 0 && (
                    <PostSelectedNews
                      latestNews={newsForYou}
                      title="News for You"
                    />
                  )}
                </div>
              )}
            </div>
          </article>
        )}

        {footerContent}
      </SitePageWidth>
    </div>
  );
}
