import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  techExclusiveBadge,
  techFeaturedTitle,
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
    "lg:border-neutral-300 lg:border-l lg:border-dotted",
    "max-lg:border-neutral-300 max-lg:border-t max-lg:border-dotted",
    "max-lg:first:border-t-0",
    "lg:[&:nth-child(2n+1)]:border-l-0",
    "lg:[&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-dotted",
  );
}

function FeaturedArticleCard({ article }: { article: FourthSectionTechPost }) {
  if (!article.slug) return null;

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );

  return (
    <article className="py-6 first:pt-0 max-lg:last:pb-0 lg:px-6 lg:pt-0 lg:pb-6">
      {coverData?.src ? (
        <Link
          href={`/post/${article.slug}`}
          className="group block"
          aria-label={`Read article: ${article.title}`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-950">
            <ImageRenderer
              src={coverData.src}
              alt={coverData.alt}
              width={800}
              height={450}
              fill
              unoptimized={coverData.unoptimized}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </Link>
      ) : null}
      <Link href={`/post/${article.slug}`} className="group block">
        <h3 className={cn("mt-4", techFeaturedTitle)}>{article.title}</h3>
      </Link>
      <ReadTimeLabel minutes={article.readTime} />
    </article>
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
          <ReadTimeLabel minutes={article.readTime} />
        </div>
        {coverData?.src ? (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-neutral-950">
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
    <section aria-label={category.title} className="rounded-lg bg-background">
      <SectionHeader
        title={category.title}
        href={category.href}
        accentStyle="modern"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-dotted lg:divide-neutral-300">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 divide-y divide-dotted divide-neutral-300 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {featured.map((article) => (
              <FeaturedArticleCard key={article._id} article={article} />
            ))}
          </div>

          {secondary.length > 0 ? (
            <div className="grid grid-cols-1 border-neutral-300 border-t border-dotted lg:grid-cols-2">
              {secondary.map((article) => (
                <SecondaryArticleRow key={article._id} article={article} />
              ))}
            </div>
          ) : null}
        </div>

        {mostRead.length > 0 ? (
          <div className="border-neutral-300 border-t border-dotted py-6 lg:border-t-0 lg:px-6 lg:py-6">
            <MostReadFeed items={mostRead} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
