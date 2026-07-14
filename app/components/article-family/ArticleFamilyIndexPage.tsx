import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListingPhotoCredit } from "@/app/helpers";
import ArticleFamilyCard from "./ArticleFamilyCard";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { AnalysisAuthorLine, AnalysisListSection } from "./AnalysisRowCard";
import AnalysisMoreSection from "./AnalysisMoreSection";
import EditorialListMoreSection from "./EditorialListMoreSection";
import {
  ANALYSIS_HERO_COUNT,
  ANALYSIS_MISSED_IT_COUNT,
  ANALYSIS_CONTENT_OFFSET,
  ANALYSIS_SIDEBAR_COUNT,
} from "./analysis-index-constants";
import {
  EDITORIAL_LIST_CONTENT_OFFSET,
  EDITORIAL_LIST_SIDEBAR_COUNT,
} from "./editorial-list-index-constants";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { getCoverImage } from "@/sanity/lib/utils";
import { categoryFeaturedTitle } from "@/app/lib/typography/second-section";
import { fifthSectionFeaturedOverlayTitle } from "@/app/lib/typography/fifth-section";
import {
  NewsCardRowSection,
  type NewsCardRowItem,
} from "@/app/components/ui/news-card-row-section";

const analysisLeadOverlayClassName =
  "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/65 to-transparent px-4 pt-16 pb-5 md:px-6 md:pt-20 md:pb-6";

const PAGE_SIZE = 10;

type ArticleFamilyIndexVariant = "analysis" | "editorial-list";

type EditorialListIndexUiConfig = {
  sidebarTitle: string;
  featuredLabel: string;
  loadMoreApiPath: string;
};

type ArticleFamilyIndexPageProps = {
  title: string;
  description?: string;
  articles: CardModel[];
  page: number;
  total: number;
  basePath: string;
  variant?: ArticleFamilyIndexVariant;
  editorialList?: EditorialListIndexUiConfig;
};

function pageHref(basePath: string, pageNum: number): string {
  if (pageNum <= 1) return basePath;
  const q = new URLSearchParams({ page: String(pageNum) });
  return `${basePath}?${q.toString()}`;
}

function ArticleImage({
  article,
  className,
  sizes,
}: {
  article: CardModel;
  className: string;
  sizes: string;
}) {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );

  if (!coverData?.src) {
    return <div className={cn(className, "bg-news-secondary")} aria-hidden />;
  }

  return (
    <div className={cn(className, "bg-news-secondary")}>
      <ImageRenderer
        src={coverData.src}
        alt={coverData.alt}
        width={800}
        height={450}
        fill
        unoptimized={coverData.unoptimized}
        sizes={sizes}
        className="object-cover object-center"
      />
    </div>
  );
}

function AnalysisLeadCard({
  article,
  featuredLabel = "Featured analysis",
}: {
  article: CardModel;
  featuredLabel?: string;
}) {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || featuredLabel,
  );

  return (
    <article className="space-y-4">
      {coverData?.src ? (
        <Link
          href={article.href}
          className="group block"
          aria-label={`Read article: ${article.title || featuredLabel}`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary xl:aspect-[3/2]">
            <ImageRenderer
              src={coverData.src}
              alt={coverData.alt}
              width={800}
              height={450}
              fill
              unoptimized={coverData.unoptimized}
              sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 66vw, 75vw"
              className="absolute inset-0 z-0 object-cover object-center"
            />
            <div className={analysisLeadOverlayClassName}>
              <h3 className={fifthSectionFeaturedOverlayTitle}>
                {article.title || "Untitled"}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <AnalysisAuthorLine author={article.author} variant="overlay" />
                <ReadTimeLabel
                  minutes={article.readTime}
                  variant="hero"
                  className="mt-0"
                  as="span"
                />
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <Link
          href={article.href}
          className="group block"
          aria-label={`Read article: ${article.title || featuredLabel}`}
        >
          <ArticleImage
            article={article}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-sm xl:aspect-[3/2]"
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 66vw, 75vw"
          />
        </Link>
      )}
      <ListingPhotoCredit cover={article.cover} align="right" />
      {!coverData?.src ? (
        <>
          <Link href={article.href} className="group block">
            <h3 className={cn("mt-4", categoryFeaturedTitle.light)}>
              {article.title || "Untitled"}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <AnalysisAuthorLine author={article.author} />
            <ReadTimeLabel
              minutes={article.readTime}
              variant="default"
              className="mt-0"
              as="span"
            />
          </div>
        </>
      ) : null}
    </article>
  );
}

function EditorialTwoColumnHero({
  leadArticle,
  sidebarArticles,
  sidebarTitle,
  featuredLabel,
}: {
  leadArticle?: CardModel;
  sidebarArticles: CardModel[];
  sidebarTitle: string;
  featuredLabel: string;
}) {
  const hasSidebar = sidebarArticles.length > 0;
  const leadColumnClass = "py-6 lg:pr-6";
  const sidebarColumnClass = "py-6 lg:pl-6";

  if (!leadArticle && sidebarArticles.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-background">
      <div className="grid grid-cols-1 items-start divide-y divide-dotted divide-neutral-300 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        {leadArticle ? (
          <div
            className={cn(
              leadColumnClass,
              hasSidebar ? "lg:col-span-8" : "lg:col-span-12",
            )}
          >
            <AnalysisLeadCard
              article={leadArticle}
              featuredLabel={featuredLabel}
            />
          </div>
        ) : null}
        {hasSidebar ? (
          <div
            className={cn(
              sidebarColumnClass,
              "rounded-lg bg-news-surface lg:col-span-4",
            )}
          >
            <h2 className="mb-6 font-bold font-display text-lg text-news-text md:mb-8 md:text-xl">
              {sidebarTitle}
            </h2>
            <AnalysisListSection articles={sidebarArticles} variant="sidebar" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function articleToNewsCardRowItem(article: CardModel): NewsCardRowItem {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );

  return {
    id: article._id,
    title: article.title || "Untitled",
    href: article.href,
    image: coverData?.src ?? "",
    imageAlt: coverData?.alt,
    imageUnoptimized: coverData?.unoptimized,
    readTimeMinutes: article.readTime,
  };
}

function AnalysisIndexModule({
  articles,
  total,
}: {
  articles: CardModel[];
  total: number;
}) {
  const leadArticle = articles[0];
  const sidebarArticles = articles.slice(1, 1 + ANALYSIS_SIDEBAR_COUNT);
  const missedItArticles = articles.slice(
    ANALYSIS_HERO_COUNT,
    ANALYSIS_HERO_COUNT + ANALYSIS_MISSED_IT_COUNT,
  );
  const initialMoreArticles = articles.slice(ANALYSIS_CONTENT_OFFSET);
  const showMoreSection =
    initialMoreArticles.length > 0 || total > ANALYSIS_CONTENT_OFFSET;

  return (
    <main className="space-y-8">
      <EditorialTwoColumnHero
        leadArticle={leadArticle}
        sidebarArticles={sidebarArticles}
        sidebarTitle="Latest Analysis"
        featuredLabel="Featured analysis"
      />
      {missedItArticles.length > 0 ? (
        <NewsCardRowSection
          title="In case you missed it"
          items={missedItArticles.map(articleToNewsCardRowItem)}
          columns={4}
          minItems={1}
        />
      ) : null}
      {showMoreSection ? (
        <section className="rounded-lg bg-background">
          <h2 className="mb-4 font-bold font-display text-lg text-news-text md:text-xl">
            More Analysis
          </h2>
          <AnalysisMoreSection
            initialArticles={initialMoreArticles}
            total={total}
          />
        </section>
      ) : null}
    </main>
  );
}

function EditorialListIndexContent({
  articles,
  total,
  sidebarTitle,
  featuredLabel,
  loadMoreApiPath,
}: {
  articles: CardModel[];
  total: number;
  sidebarTitle: string;
  featuredLabel: string;
  loadMoreApiPath: string;
}) {
  const initialMoreArticles = articles.slice(EDITORIAL_LIST_CONTENT_OFFSET);
  const showMoreSection =
    initialMoreArticles.length > 0 || total > EDITORIAL_LIST_CONTENT_OFFSET;

  return (
    <div className="mt-8 space-y-8">
      <EditorialTwoColumnHero
        leadArticle={articles[0]}
        sidebarArticles={articles.slice(1, 1 + EDITORIAL_LIST_SIDEBAR_COUNT)}
        sidebarTitle={sidebarTitle}
        featuredLabel={featuredLabel}
      />
      {showMoreSection ? (
        <EditorialListMoreSection
          initialArticles={initialMoreArticles}
          total={total}
          apiPath={loadMoreApiPath}
        />
      ) : null}
    </div>
  );
}

export default function ArticleFamilyIndexPage({
  title,
  description,
  articles,
  page,
  total,
  basePath,
  variant,
  editorialList,
}: ArticleFamilyIndexPageProps) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startItem = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(safePage * PAGE_SIZE, total);

  if (!variant) {
    return (
      <SitePageWidth className="py-10 md:py-14">
        <header className="mb-10 border-news-border border-b pb-6">
          <h1 className="font-bold font-display text-3xl text-news-text md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 font-sans text-news-muted text-sm md:text-base">
              {description}
            </p>
          ) : null}
          {total > 0 ? (
            <p className="mt-3 font-sans text-news-muted text-xs">
              Showing {startItem}–{endItem} of {total}
            </p>
          ) : null}
        </header>

        {articles.length === 0 ? (
          <p className="py-12 text-center font-sans text-news-muted">
            No articles yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article, i) => (
              <ArticleFamilyCard
                key={article._id}
                article={article}
                layout={i === 0 && safePage === 1 ? "large" : "compact"}
              />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
            aria-label="Pagination"
          >
            <Link
              href={pageHref(basePath, safePage - 1)}
              className={`rounded-lg border border-news-border px-4 py-2 font-sans text-sm ${
                safePage <= 1
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-news-surface"
              }`}
              aria-disabled={safePage <= 1}
            >
              Previous
            </Link>
            <span className="font-sans text-news-muted text-sm">
              Page {safePage} of {totalPages}
            </span>
            <Link
              href={pageHref(basePath, safePage + 1)}
              className={`rounded-lg border border-news-border px-4 py-2 font-sans text-sm ${
                safePage >= totalPages
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-news-surface"
              }`}
              aria-disabled={safePage >= totalPages}
            >
              Next
            </Link>
          </nav>
        ) : null}
      </SitePageWidth>
    );
  }

  return (
    <SitePageWidth className="py-10 md:py-14">
      <section>
        <SectionHeader
          title={title}
          accentStyle="modern"
          size={
            variant === "analysis" || variant === "editorial-list"
              ? "large"
              : "regular"
          }
        />
        {description &&
        variant !== "analysis" &&
        variant !== "editorial-list" ? (
          <p className="-mt-5 max-w-2xl font-sans text-news-muted text-sm md:text-base">
            {description}
          </p>
        ) : null}
      </section>

      {articles.length === 0 ? (
        <p className="py-12 text-center font-sans text-news-muted">
          No articles yet.
        </p>
      ) : variant === "editorial-list" && editorialList ? (
        <EditorialListIndexContent
          articles={articles}
          total={total}
          sidebarTitle={editorialList.sidebarTitle}
          featuredLabel={editorialList.featuredLabel}
          loadMoreApiPath={editorialList.loadMoreApiPath}
        />
      ) : (
        <div className="mt-8">
          <AnalysisIndexModule articles={articles} total={total} />
        </div>
      )}
    </SitePageWidth>
  );
}

export { PAGE_SIZE as articleFamilyIndexPageSize };
