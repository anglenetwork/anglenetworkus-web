import type { ComponentProps, ReactNode } from "react";
import type { ArticleFamily } from "@/app/lib/article-family/types";
import PostHeader from "@/app/components/PostPage/PostHeader";
import PostBody from "@/app/components/PostPage/PostBody";
import PostSelectedNews from "@/app/components/PostPage/PostSelectedNews";
import {
  nonRegularPostAnalysisFocus,
  nonRegularPostDisclosure,
  nonRegularPostPresenterName,
  nonRegularPostTypeBadge,
} from "@/app/lib/typography/posts";
import { cn } from "@/lib/utils";
import { ArticleTransparencySection } from "./article-transparency-section";

function TypeBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "mb-2 inline-block rounded-sm border border-news-border bg-news-surface px-2 py-0.5 text-news-text",
        nonRegularPostTypeBadge,
      )}
    >
      {children}
    </span>
  );
}

type StandardArticleLayoutProps = {
  article: ArticleFamily;
  postBodyProps: ComponentProps<typeof PostBody>;
  canonicalArticlePath: string;
  popularReads: ComponentProps<typeof PostSelectedNews>["latestNews"];
  newsForYou: ComponentProps<typeof PostSelectedNews>["latestNews"];
};

export function StandardArticleLayout({
  article,
  postBodyProps,
  canonicalArticlePath,
  popularReads,
  newsForYou,
}: StandardArticleLayoutProps) {
  const showOpinionChrome = article._type === "opinion";
  const showAnalysisChrome = article._type === "analysis";
  const showSponsoredChrome = article._type === "sponsored";

  return (
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

            {showSponsoredChrome && article.sponsorAttribution?.disclosure && (
              <div className="rounded-md border border-news-border bg-news-surface p-4 text-news-text text-sm leading-relaxed">
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
                  "mt-3 border-news-border border-l-4 pl-3",
                  nonRegularPostAnalysisFocus,
                )}
              >
                {article.analysisFocus}
              </p>
            )}

            {showOpinionChrome && article.disclosure && (
              <aside className="rounded-md bg-news-surface px-4 py-3">
                <p className={nonRegularPostDisclosure}>{article.disclosure}</p>
              </aside>
            )}
          </header>

          <PostBody
            {...postBodyProps}
            mediaPresentation={
              showSponsoredChrome ? "nonRegularCover" : "default"
            }
          />

          {showAnalysisChrome && (
            <ArticleTransparencySection
              methodologyNote={article.methodologyNote}
              sourcesNote={article.sourcesNote}
            />
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
              <PostSelectedNews latestNews={newsForYou} title="News for You" />
            )}
          </div>
        )}
      </div>
    </article>
  );
}
