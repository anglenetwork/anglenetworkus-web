import Link from "next/link";
import { cn } from "@/lib/utils";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { opinionListQuery } from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";
import {
  formatReadTimeLabel,
  readTimeLabelClassName,
} from "@/app/lib/typography/read-time";

function OpinionColumnCard({ article }: { article: ArticleFamilyCard }) {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );
  const categoryLabel = article.category?.title?.toUpperCase() ?? "OPINION";
  const authorName = article.author?.name?.trim();
  const readTimeLabel = formatReadTimeLabel(article.readTime);

  return (
    <article className="py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="font-sans font-semibold text-news-primary text-xs uppercase tracking-wide">
            {categoryLabel}
          </p>
          <h3 className={categorySecondaryRowTitle.light}>
            <Link href={article.href}>{article.title}</Link>
          </h3>
          {authorName || readTimeLabel ? (
            <p className={cn(readTimeLabelClassName("inline"), "text-black")}>
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
    params: { limit: 3 },
  });

  const articles = (opinionRaw as unknown[])
    .map((r) => normalizeArticleFamilyCard(r))
    .filter((x): x is NonNullable<typeof x> => x != null)
    .slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section>
      <SectionHeader
        title="Opinion"
        accentStyle="minimal"
        href="/opinion"
        variant="news"
      />

      <div className="rounded-lg bg-news-background px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 divide-y divide-dotted divide-news-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {articles.map((article) => (
            <OpinionColumnCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
