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
import { PreloadCoverImage } from "@/app/components/PostPage/PreloadCoverImage";
import { getCoverImage } from "@/sanity/lib/utils";
import ArticleViewTracker from "@/app/components/article-family/ArticleViewTracker";
import CategoryViewTracker from "@/app/post/[slug]/CategoryViewTracker";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { articleFamilyCanonicalHref } from "@/app/lib/article-family/routes";

function TypeBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block mb-2 rounded-sm border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-neutral-800">
      {children}
    </span>
  );
}

export default async function ArticleFamilyPage({
  article,
  sidebar,
  footer,
}: {
  article: ArticleFamily;
  sidebar?: ReactNode;
  /** Suggested tags + bottom module */
  footer?: ReactNode;
}) {
  const settings = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });
  const { article: articleLd, breadcrumb: breadcrumbLd } =
    buildArticlePageJsonLd({
      article,
      settings,
      demoTitle: demo.title,
    });

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article"
  );
  const coverImageUrl = coverData?.src || null;

  const showOpinionChrome = article._type === "opinion";
  const showAnalysisChrome = article._type === "analysis";
  const showSponsoredChrome = article._type === "sponsored";
  const canonicalArticlePath = articleFamilyCanonicalHref(
    article._type,
    article.slug
  );

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

      {coverImageUrl && <PreloadCoverImage imageUrl={coverImageUrl} />}

      <ArticleViewTracker articleId={article._id} articleType={article._type} />

      {article.category?.slug && (
        <CategoryViewTracker categorySlug={article.category.slug} />
      )}

      <SitePageWidth className="py-4">
        <article className="mt-4 lg:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16">
            <div className="col-span-1 lg:col-span-8">
              <header className="mb-6 not-prose space-y-3">
                {showSponsoredChrome && (
                  <TypeBadge>Sponsored</TypeBadge>
                )}
                {showOpinionChrome && <TypeBadge>Opinion</TypeBadge>}
                {showAnalysisChrome && <TypeBadge>Analysis</TypeBadge>}

                {showSponsoredChrome && article.sponsorAttribution && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                    <p className="font-semibold">
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

                {showSponsoredChrome && article.sponsorAttribution?.disclosure && (
                  <div className="rounded-md border border-neutral-300 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800">
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
                  author={article.author ?? undefined}
                  slug={article.slug || undefined}
                />

                {showOpinionChrome && article.opinionFormat && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    {article.opinionFormat.replace(/-/g, " ")}
                  </p>
                )}

                {showAnalysisChrome && article.analysisFocus && (
                  <p className="text-sm font-medium text-neutral-700 border-l-4 border-neutral-400 pl-3">
                    {article.analysisFocus}
                  </p>
                )}

                {showOpinionChrome && article.disclosure && (
                  <aside className="rounded-md bg-neutral-100 px-4 py-3 text-sm text-neutral-800">
                    {article.disclosure}
                  </aside>
                )}
              </header>

              <PostBody
                sharePath={canonicalArticlePath}
                body={article.body}
                cover={article.cover as ComponentProps<typeof PostBody>["cover"]}
                imageGallery={
                  article.imageGallery as ComponentProps<
                    typeof PostBody
                  >["imageGallery"]
                }
                title={article.title || "Untitled"}
                author={article.author ?? undefined}
                date={article.date}
                updatedAt={article.updatedAt || null}
                slug={article.slug || undefined}
                articleId={article._id}
              />

              {showAnalysisChrome &&
                (article.methodologyNote || article.sourcesNote) && (
                  <section
                    className="mt-10 border-t border-neutral-200 pt-8 not-prose"
                    aria-labelledby="transparency-heading"
                  >
                    <h2
                      id="transparency-heading"
                      className="text-lg font-bold text-neutral-900 mb-4"
                    >
                      Context and transparency
                    </h2>
                    {article.methodologyNote && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-neutral-800 mb-1">
                          Methodology
                        </h3>
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                          {article.methodologyNote}
                        </p>
                      </div>
                    )}
                    {article.sourcesNote && (
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-800 mb-1">
                          Sources
                        </h3>
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                          {article.sourcesNote}
                        </p>
                      </div>
                    )}
                  </section>
                )}
            </div>

            {sidebar && (
              <div className="flex flex-col col-span-1 lg:col-span-4 gap-8">
                {sidebar}
              </div>
            )}
          </div>
        </article>

        {footer}
      </SitePageWidth>
    </div>
  );
}
