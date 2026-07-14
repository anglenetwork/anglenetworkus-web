import Link from "next/link";
import { cn } from "@/lib/utils";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { opinionListQuery } from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import { enrichCoverMediaInTree } from "@/lib/editorial-image/enrich-cover-media";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { formatReadTimeLabel } from "@/app/lib/typography/read-time";
import {
  editorialFeaturedByline,
  editorialFeaturedExcerpt,
  editorialFeaturedHeadline,
  editorialFeaturedKicker,
  editorialFeaturedQuote,
  editorialRailByline,
  editorialRailKicker,
  editorialRailTitle,
} from "@/app/lib/typography/editorial-rails";

function OpinionFeaturedLead({ article }: { article: ArticleFamilyCard }) {
  const coverData = getHomepageCoverImage(
    "sectionFeatured",
    article.cover as Parameters<typeof getHomepageCoverImage>[1],
    article.title || "Article image",
  );
  const authorName = article.author?.name?.trim();
  const authorTitle = article.author?.title?.trim();
  const readTimeLabel = formatReadTimeLabel(article.readTime);
  const bylineSecondary = authorTitle || readTimeLabel;
  const bylineParts = [authorName, bylineSecondary].filter(Boolean);

  return (
    <article className="pb-8 md:pb-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.85fr_1fr] lg:items-center lg:gap-10">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2.5 md:mb-5">
            <span className={editorialFeaturedQuote} aria-hidden="true">
              “
            </span>
            <p className={editorialFeaturedKicker}>Opinion</p>
          </div>

          <h2 className={cn(editorialFeaturedHeadline, "mb-4 md:mb-5")}>
            <Link href={article.href}>{article.title}</Link>
          </h2>

          {article.excerpt ? (
            <p className={cn(editorialFeaturedExcerpt, "mb-5 md:mb-6")}>
              {article.excerpt}
            </p>
          ) : null}

          {bylineParts.length > 0 ? (
            <p className={editorialFeaturedByline}>
              By {bylineParts.join(" · ")}
            </p>
          ) : null}
        </div>

        {coverData?.src ? (
          <Link
            href={article.href}
            className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-sm bg-news-secondary lg:ml-auto lg:aspect-[5/4] lg:max-w-none"
            aria-label={`Read article: ${article.title}`}
          >
            <ImageRenderer
              src={coverData.src}
              alt={coverData.alt}
              fill
              unoptimized={coverData.unoptimized}
              sizes="(max-width: 1024px) 70vw, 28vw"
              className="object-cover object-center"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function OpinionColumnCard({ article }: { article: ArticleFamilyCard }) {
  const coverData = getHomepageCoverImage(
    "sectionThumb",
    article.cover as Parameters<typeof getHomepageCoverImage>[1],
    article.title || "Article image",
  );
  const categoryLabel = article.category?.title?.toUpperCase() ?? "OPINION";
  const authorName = article.author?.name?.trim();
  const readTimeLabel = formatReadTimeLabel(article.readTime);

  return (
    <article className="py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className={editorialRailKicker}>{categoryLabel}</p>
          <h3 className={editorialRailTitle}>
            <Link href={article.href}>{article.title}</Link>
          </h3>
          {authorName || readTimeLabel ? (
            <p className={editorialRailByline}>
              By {[authorName, readTimeLabel].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
        {coverData?.src ? (
          <Link
            href={article.href}
            className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-news-secondary"
            aria-label={`Read article: ${article.title}`}
          >
            <ImageRenderer
              src={coverData.src}
              alt={coverData.alt}
              width={112}
              height={80}
              fill
              unoptimized={coverData.unoptimized}
              sizes="112px"
              className="object-cover object-center"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default async function EditorialRailsSection() {
  const opinionRaw = await sanityFetchStatic({
    query: opinionListQuery,
    params: { limit: 4 },
  });

  const articles = (await enrichCoverMediaInTree(
    (opinionRaw as unknown[])
      .map((r) => normalizeArticleFamilyCard(r))
      .filter((x): x is NonNullable<typeof x> => x != null)
      .slice(0, 4),
  )) as ArticleFamilyCard[];

  if (articles.length === 0) return null;

  const featured = articles[0];
  const rail = articles.slice(1, 4);

  return (
    <section>
      <div className="rounded-lg bg-news-surface px-4 py-6 md:px-6 md:py-8">
        <OpinionFeaturedLead article={featured} />

        {rail.length > 0 ? (
          <div className="border-t border-news-text/50 pt-6 md:pt-8">
            <div className="grid grid-cols-1 divide-y divide-news-text/50 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
              {rail.map((article) => (
                <OpinionColumnCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
