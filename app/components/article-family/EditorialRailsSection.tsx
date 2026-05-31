import Link from "next/link";
import { cn } from "@/lib/utils";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { opinionListQuery } from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { articleTitleLink } from "@/app/lib/typography/article-links";
import { formatReadTimeLabel } from "@/app/lib/typography/tag-page";

function OpinionColumnCard({ article }: { article: ArticleFamilyCard }) {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );
  const categoryLabel =
    article.category?.title?.toUpperCase() ?? "OPINION";
  const authorName = article.author?.name?.trim();
  const readTimeLabel = formatReadTimeLabel(null);
  const byline = [authorName, readTimeLabel].filter(Boolean).join(" · ");

  return (
    <article className="py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="font-sans font-semibold text-neutral-900 text-xs uppercase tracking-wide">
            {categoryLabel}
          </p>
          <h3
            className={cn(
              "font-sans font-semibold text-base text-neutral-900 leading-snug tracking-normal md:text-base",
              articleTitleLink,
            )}
          >
            <Link href={article.href}>{article.title}</Link>
          </h3>
          {byline ? (
            <p className="font-sans text-neutral-500 text-xs">{byline}</p>
          ) : null}
        </div>
        {coverData?.src ? (
          <Link
            href={article.href}
            className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-neutral-950"
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
      <SectionHeader title="Opinion" accentStyle="modern" href="/opinion" />

      <div className="rounded-lg bg-neutral-100 px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 divide-y divide-dotted divide-neutral-300 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {articles.map((article) => (
            <OpinionColumnCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
