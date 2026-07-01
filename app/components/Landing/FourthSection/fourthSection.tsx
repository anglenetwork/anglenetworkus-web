import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  NewsCardRowCard,
  type NewsCardRowItem,
} from "../../ui/news-card-row-section";
import {
  techExclusiveBadge,
  techSecondaryTitle,
} from "@/app/lib/typography/fourth-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import type {
  FourthSectionTechPost,
  HomepageFourthSectionData,
} from "@/app/lib/homepage-fourth-section";
import { MostReadFeed } from "./most-read-feed";

function isExclusivePost(labels: string[] | null | undefined): boolean {
  return (
    labels?.some((label) => label.trim().toLowerCase() === "exclusive") ?? false
  );
}

function secondaryArticleCellClassName() {
  return cn(
    "py-6 lg:px-6",
    "lg:border-news-border lg:border-l lg:border-dotted",
    "max-lg:border-news-border max-lg:border-t max-lg:border-dotted",
    "max-lg:first:border-t-0",
    "lg:[&:nth-child(2n+1)]:border-l-0",
    "lg:[&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-dotted",
  );
}

function featuredPostToCardItem(
  article: FourthSectionTechPost,
): NewsCardRowItem | null {
  if (!article.slug) return null;

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );

  return {
    id: article._id,
    title: article.title,
    href: `/post/${article.slug}`,
    image: coverData?.src ?? "",
    imageAlt: coverData?.alt,
    imageUnoptimized: coverData?.unoptimized,
    readTimeMinutes: article.readTime,
  };
}

function FeaturedArticleCard({ article }: { article: FourthSectionTechPost }) {
  const item = featuredPostToCardItem(article);
  if (!item) return null;

  return (
    <NewsCardRowCard
      item={item}
      variant="news"
      imageSizes="(max-width: 1024px) 100vw, 50vw"
      className="py-6 first:pt-0 max-lg:last:pb-0 lg:px-6 lg:pt-0 lg:pb-6"
    />
  );
}

function SecondaryArticleRow({ article }: { article: FourthSectionTechPost }) {
  if (!article.slug) return null;

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );

  return (
    <article className={secondaryArticleCellClassName()}>
      <Link
        href={`/post/${article.slug}`}
        className="group flex items-start gap-3"
        aria-label={`Read article: ${article.title}`}
      >
        <div className="min-w-0 flex-1 space-y-2">
          {isExclusivePost(article.labels) ? (
            <span className={techExclusiveBadge}>Exclusive</span>
          ) : null}
          <h3 className={techSecondaryTitle}>{article.title}</h3>
          <ReadTimeLabel minutes={article.readTime} variant="news" />
        </div>
        {coverData?.src ? (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-news-secondary">
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
          </div>
        ) : null}
      </Link>
    </article>
  );
}

export type FourthSectionProps = HomepageFourthSectionData;

export default function FourthSection({
  category,
  featured,
  secondary,
  mostRead,
}: FourthSectionProps) {
  if (featured.length < 2) {
    return null;
  }

  return (
    <section aria-label={category.title} className="rounded-lg bg-news-surface">
      <SectionHeader
        title={category.title}
        href={category.href}
        variant="news"
        accentStyle="minimal"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 divide-y divide-dotted divide-news-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {featured.map((article) => (
              <FeaturedArticleCard key={article._id} article={article} />
            ))}
          </div>

          {secondary.length > 0 ? (
            <div className="grid grid-cols-1 border-news-border border-t border-dotted lg:grid-cols-2">
              {secondary.map((article) => (
                <SecondaryArticleRow key={article._id} article={article} />
              ))}
            </div>
          ) : null}
        </div>

        {mostRead.length > 0 ? (
          <div className="bg-black py-6 text-white max-lg:border-white/15 max-lg:border-t lg:px-6 lg:py-6">
            <MostReadFeed items={mostRead} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
