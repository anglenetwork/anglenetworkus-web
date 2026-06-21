import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListingPhotoCredit } from "@/app/helpers";
import ArticleFamilyCard from "./ArticleFamilyCard";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { AnalysisAuthorLine, AnalysisListSection } from "./AnalysisRowCard";
import AnalysisMoreSection from "./AnalysisMoreSection";
import {
  ANALYSIS_HERO_COUNT,
  ANALYSIS_MISSED_IT_COUNT,
  ANALYSIS_CONTENT_OFFSET,
  ANALYSIS_SIDEBAR_COUNT,
} from "./analysis-index-constants";
import {
  OPINION_HERO_COUNT,
  OPINION_SIDEBAR_COUNT,
} from "./opinion-index-constants";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { getCoverImage } from "@/sanity/lib/utils";
import {
  categoryFeaturedTitle,
  categorySecondaryRowTitle,
} from "@/app/lib/typography/second-section";
import { fifthSectionFeaturedOverlayTitle } from "@/app/lib/typography/fifth-section";
import {
  NewsCardRowSection,
  type NewsCardRowItem,
} from "@/app/components/ui/news-card-row-section";

const analysisLeadOverlayClassName =
  "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/65 to-transparent px-4 pt-16 pb-5 md:px-6 md:pt-20 md:pb-6";

const PAGE_SIZE = 10;

type ArticleFamilyIndexVariant = "analysis" | "opinion";

type ArticleFamilyIndexPageProps = {
  title: string;
  description?: string;
  articles: CardModel[];
  page: number;
  total: number;
  basePath: string;
  variant?: ArticleFamilyIndexVariant;
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
    return <div className={cn(className, "bg-neutral-950")} aria-hidden />;
  }

  return (
    <div className={cn(className, "bg-neutral-950")}>
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
  family = "analysis",
}: {
  article: CardModel;
  family?: "analysis" | "opinion";
}) {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || `Featured ${family}`,
  );
  const featuredLabel =
    family === "opinion" ? "Featured opinion" : "Featured analysis";

  return (
    <article className="space-y-4">
      {coverData?.src ? (
        <Link
          href={article.href}
          className="group block"
          aria-label={`Read article: ${article.title || featuredLabel}`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-950 xl:aspect-[3/2]">
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

function OpinionColumnCard({
  article,
  padded = true,
  layout = "row",
}: {
  article: CardModel;
  padded?: boolean;
  layout?: "featured" | "row";
}) {
  const isFeatured = layout === "featured";

  return (
    <article
      className={cn("py-6 first:pt-0 last:pb-0", padded && "lg:px-6 lg:py-0")}
    >
      <Link
        href={article.href}
        className={cn(
          "group flex items-start gap-3",
          isFeatured && "flex-col gap-4",
        )}
        aria-label={`Read article: ${article.title || "Opinion article"}`}
      >
        <ArticleImage
          article={article}
          className={cn(
            "relative shrink-0 overflow-hidden rounded-sm bg-neutral-950",
            isFeatured ? "aspect-[16/9] w-full" : "h-20 w-28",
          )}
          sizes={isFeatured ? "(max-width: 1024px) 100vw, 33vw" : "112px"}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className={categorySecondaryRowTitle.light}>
            {article.title || "Untitled"}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <AnalysisAuthorLine author={article.author} />
            <ReadTimeLabel
              minutes={article.readTime}
              variant="default"
              className="mt-0"
              as="span"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

function EditorialTwoColumnHero({
  leadArticle,
  sidebarArticles,
  sidebarTitle,
  family,
}: {
  leadArticle?: CardModel;
  sidebarArticles: CardModel[];
  sidebarTitle: string;
  family: "analysis" | "opinion";
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
            <AnalysisLeadCard article={leadArticle} family={family} />
          </div>
        ) : null}
        {hasSidebar ? (
          <div
            className={cn(
              sidebarColumnClass,
              "rounded-lg bg-news-surface lg:col-span-4",
            )}
          >
            <h2 className="mb-6 font-bold font-sans text-lg text-neutral-900 md:mb-8 md:text-xl">
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
        family="analysis"
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
          <h2 className="mb-4 font-bold font-sans text-lg text-neutral-900 md:text-xl">
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

function OpinionPageContent({
  articles,
  safePage,
}: {
  articles: CardModel[];
  safePage: number;
}) {
  const gridArticles =
    safePage === 1 ? articles.slice(OPINION_HERO_COUNT) : articles;

  return (
    <div className="mt-8 space-y-8">
      {safePage === 1 ? (
        <EditorialTwoColumnHero
          leadArticle={articles[0]}
          sidebarArticles={articles.slice(1, 1 + OPINION_SIDEBAR_COUNT)}
          sidebarTitle="Latest Opinion"
          family="opinion"
        />
      ) : null}
      {gridArticles.length > 0 ? (
        <OpinionIndexModule articles={gridArticles} />
      ) : null}
    </div>
  );
}

function OpinionIndexModule({ articles }: { articles: CardModel[] }) {
  const topArticles = articles.slice(0, 3);
  const remainingArticles = articles.slice(3);

  return (
    <div className="rounded-lg bg-neutral-100 px-4 py-6 md:px-6 md:py-8">
      <div className="grid grid-cols-1 divide-y divide-dotted divide-neutral-500 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {topArticles.map((article) => (
          <OpinionColumnCard
            key={article._id}
            article={article}
            layout="featured"
          />
        ))}
      </div>
      {remainingArticles.length > 0 ? (
        <div className="mt-6 border-neutral-500 border-t border-dotted pt-6">
          <div className="flex flex-col divide-y divide-dotted divide-neutral-500">
            {remainingArticles.map((article) => (
              <OpinionColumnCard
                key={article._id}
                article={article}
                padded={false}
              />
            ))}
          </div>
        </div>
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
}: ArticleFamilyIndexPageProps) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startItem = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(safePage * PAGE_SIZE, total);

  if (!variant) {
    return (
      <SitePageWidth variant="narrow" className="py-10 md:py-14">
        <header className="mb-10 border-neutral-200 border-b pb-6">
          <h1 className="font-bold font-sans text-3xl text-neutral-900 md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 font-sans text-neutral-600 text-sm md:text-base">
              {description}
            </p>
          ) : null}
          {total > 0 ? (
            <p className="mt-3 font-sans text-neutral-500 text-xs">
              Showing {startItem}–{endItem} of {total}
            </p>
          ) : null}
        </header>

        {articles.length === 0 ? (
          <p className="py-12 text-center font-sans text-neutral-600">
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
              className={`rounded-lg border border-neutral-300 px-4 py-2 font-sans text-sm ${
                safePage <= 1
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-neutral-50"
              }`}
              aria-disabled={safePage <= 1}
            >
              Previous
            </Link>
            <span className="font-sans text-neutral-600 text-sm">
              Page {safePage} of {totalPages}
            </span>
            <Link
              href={pageHref(basePath, safePage + 1)}
              className={`rounded-lg border border-neutral-300 px-4 py-2 font-sans text-sm ${
                safePage >= totalPages
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-neutral-50"
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
            variant === "analysis" || variant === "opinion"
              ? "large"
              : "regular"
          }
        />
        {description && variant !== "analysis" && variant !== "opinion" ? (
          <p className="-mt-5 max-w-2xl font-sans text-neutral-600 text-sm md:text-base">
            {description}
          </p>
        ) : null}
      </section>

      {articles.length === 0 ? (
        <p className="py-12 text-center font-sans text-neutral-600">
          No articles yet.
        </p>
      ) : variant === "opinion" ? (
        <OpinionPageContent articles={articles} safePage={safePage} />
      ) : (
        <div className="mt-8">
          <AnalysisIndexModule articles={articles} total={total} />
        </div>
      )}

      {variant === "opinion" && totalPages > 1 ? (
        <nav
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          aria-label="Pagination"
        >
          <Link
            href={pageHref(basePath, safePage - 1)}
            className={`rounded-lg border border-neutral-300 px-4 py-2 font-sans text-sm ${
              safePage <= 1
                ? "pointer-events-none opacity-40"
                : "hover:bg-neutral-50"
            }`}
            aria-disabled={safePage <= 1}
          >
            Previous
          </Link>
          <span className="font-sans text-neutral-600 text-sm">
            Page {safePage} of {totalPages}
          </span>
          <Link
            href={pageHref(basePath, safePage + 1)}
            className={`rounded-lg border border-neutral-300 px-4 py-2 font-sans text-sm ${
              safePage >= totalPages
                ? "pointer-events-none opacity-40"
                : "hover:bg-neutral-50"
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

export { PAGE_SIZE as articleFamilyIndexPageSize };
