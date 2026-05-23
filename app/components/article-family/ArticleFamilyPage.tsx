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
import { cn } from "@/lib/utils";

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
  const showEditorialChrome = showOpinionChrome || showAnalysisChrome;
  const canonicalArticlePath = articleFamilyCanonicalHref(
    article._type,
    article.slug
  );
  const postBodyProps: ComponentProps<typeof PostBody> = {
    sharePath: canonicalArticlePath,
    body: article.body,
    cover: article.cover as ComponentProps<typeof PostBody>["cover"],
    imageGallery:
      article.imageGallery as ComponentProps<typeof PostBody>["imageGallery"],
    title: article.title || "Untitled",
    author: article.author ?? undefined,
    date: article.date,
    updatedAt: article.updatedAt || null,
    slug: article.slug || undefined,
    articleId: article._id,
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

      {coverImageUrl && <PreloadCoverImage imageUrl={coverImageUrl} />}

      <ArticleViewTracker articleId={article._id} articleType={article._type} />

      {article.category?.slug && (
        <CategoryViewTracker categorySlug={article.category.slug} />
      )}

      <SitePageWidth className="py-4">
        {showEditorialChrome ? (
          <article className="mt-4 lg:mt-8">
            <header className="mx-auto mb-8 max-w-[860px] not-prose">
              <div>
                <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                  {showOpinionChrome ? "Opinion" : "Analysis"}
                  {showOpinionChrome && article.opinionFormat
                    ? ` / ${article.opinionFormat.replace(/-/g, " ")}`
                    : ""}
                </p>
                <h1
                  className={cn(
                    "font-sans font-bold tracking-tight text-neutral-950 sm:text-[48px] lg:text-[56px]",
                    showOpinionChrome
                      ? "text-[42px] leading-[1.22] sm:leading-[1.1] lg:leading-[1.05]"
                      : "text-[36px] leading-[1.05]",
                  )}
                >
                  {article.title || "Untitled"}
                </h1>
                {article.excerpt && (
                  <p className="mt-4 max-w-3xl font-sans text-base font-light leading-relaxed text-neutral-600 md:text-lg">
                    {article.excerpt}
                  </p>
                )}
              </div>

              {showAnalysisChrome && article.analysisFocus && (
                <p className="mt-5 max-w-3xl border-l-4 border-neutral-300 pl-4 font-sans text-sm font-medium text-neutral-700">
                  {article.analysisFocus}
                </p>
              )}

              {showOpinionChrome && article.disclosure && (
                <aside className="mt-5 max-w-3xl rounded-md bg-neutral-100 px-4 py-3 font-sans text-sm text-neutral-800">
                  {article.disclosure}
                </aside>
              )}
            </header>

            <PostBody {...postBodyProps} variant="editorial" />

            {showAnalysisChrome &&
              (article.methodologyNote || article.sourcesNote) && (
                <section
                  className="mx-auto mt-10 max-w-[860px] border-t border-neutral-200 pt-8 not-prose"
                  aria-labelledby="transparency-heading"
                >
                  <h2
                    id="transparency-heading"
                    className="mb-4 font-sans text-lg font-bold text-neutral-900"
                  >
                    Context and transparency
                  </h2>
                  {article.methodologyNote && (
                    <div className="mb-4">
                      <h3 className="mb-1 font-sans text-sm font-semibold text-neutral-800">
                        Methodology
                      </h3>
                      <p className="whitespace-pre-wrap font-sans text-sm text-neutral-700">
                        {article.methodologyNote}
                      </p>
                    </div>
                  )}
                  {article.sourcesNote && (
                    <div>
                      <h3 className="mb-1 font-sans text-sm font-semibold text-neutral-800">
                        Sources
                      </h3>
                      <p className="whitespace-pre-wrap font-sans text-sm text-neutral-700">
                        {article.sourcesNote}
                      </p>
                    </div>
                  )}
                </section>
              )}
          </article>
        ) : (
          <article className="mt-4 lg:mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16">
              <div className="col-span-1 lg:col-span-8">
                <header className="mb-6 not-prose space-y-3">
                {showSponsoredChrome && (
                  <TypeBadge>Sponsored</TypeBadge>
                )}

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
                  updatedAt={article.updatedAt || null}
                  author={article.author ?? undefined}
                  slug={article.slug || undefined}
                  articleId={article._id}
                  sharePath={canonicalArticlePath}
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

                <PostBody {...postBodyProps} />

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
        )}

        {footer}
      </SitePageWidth>
    </div>
  );
}
