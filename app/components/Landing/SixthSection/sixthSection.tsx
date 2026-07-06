"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatImageCredit } from "@/sanity/lib/utils";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import {
  sectionGridCellClassName,
  sectionGridClassName,
  sectionLeadImageClassName,
} from "@/app/lib/homepage/section-grid-cells";
import {
  categoryFeaturedTitle,
  secCategoryLabel,
  secMainHeadline,
  secPhotoCredit,
} from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { ImageRenderer } from "@/app/components/ui/image-renderer";

interface SixthSectionArticle {
  title: string;
  slug: string;
  href?: string;
  readTime?: number | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: unknown;
    alt?: string | null;
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface SixthSectionProps {
  leftArticle: SixthSectionArticle;
  centerArticle: SixthSectionArticle;
  rightArticle: SixthSectionArticle;
  variant?: "news" | "dark";
}

function SixthSectionLeadStory({
  article,
  variant,
}: {
  article: SixthSectionArticle;
  variant: "news" | "dark";
}) {
  const coverData = getHomepageCoverImage(
    "sectionFeatured",
    article.cover as Parameters<typeof getHomepageCoverImage>[1],
    article.title || "Featured article",
  );
  const articleHref = article.href ?? `/post/${article.slug}`;
  if (!coverData?.src || !article.slug) return null;

  const credit = formatImageCredit(article.cover);

  if (variant === "dark") {
    return (
      <div>
        <Link
          href={articleHref}
          className="group block"
          aria-label={`Read article: ${article.title}`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary">
            <ImageRenderer
              src={coverData.src}
              alt={coverData.alt}
              width={800}
              height={450}
              fill
              unoptimized={coverData.unoptimized}
              sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
              className="object-cover object-center"
            />
          </div>
        </Link>
        <Link href={articleHref} className="group block">
          <h3 className={cn("mt-4", categoryFeaturedTitle.dark)}>
            {article.title}
          </h3>
        </Link>
        <ReadTimeLabel minutes={article.readTime} variant="dark" />
      </div>
    );
  }

  return (
    <Link
      href={articleHref}
      className="group block"
      aria-label={`Read article: ${article.title}`}
    >
      <div className={sectionLeadImageClassName("4/3")}>
        <ImageRenderer
          src={coverData.src}
          alt={coverData.alt}
          width={700}
          height={525}
          fill
          unoptimized={coverData.unoptimized}
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
          className="object-cover object-center"
        />
      </div>
      {credit ? <p className={secPhotoCredit}>{credit}</p> : null}
      <h3 className={secMainHeadline}>{article.title}</h3>
      <ReadTimeLabel minutes={article.readTime} variant="angle" />
    </Link>
  );
}

function SixthSectionColumn({
  article,
  variant,
}: {
  article: SixthSectionArticle;
  variant: "news" | "dark";
}) {
  const categoryTitle = article.category?.title || "More Top Headlines";
  const categoryHref = article.category?.slug
    ? `/category/${article.category.slug}`
    : undefined;

  if (variant === "dark") {
    return (
      <>
        {categoryHref ? (
          <Link
            href={categoryHref}
            className="font-bold font-sans text-base text-white uppercase tracking-normal"
          >
            {categoryTitle}
          </Link>
        ) : (
          <h2 className="font-bold font-sans text-base text-white uppercase tracking-normal">
            {categoryTitle}
          </h2>
        )}
        <SixthSectionLeadStory article={article} variant="dark" />
      </>
    );
  }

  return (
    <>
      {categoryHref ? (
        <Link href={categoryHref} className={secCategoryLabel}>
          {categoryTitle}
        </Link>
      ) : (
        <div className={secCategoryLabel}>{categoryTitle}</div>
      )}
      <SixthSectionLeadStory article={article} variant="news" />
    </>
  );
}

export default function SixthSection({
  leftArticle,
  centerArticle,
  rightArticle,
  variant = "news",
}: SixthSectionProps) {
  const articles = [leftArticle, centerArticle, rightArticle].filter(
    (article) => article.slug,
  );

  if (articles.length === 0) {
    return null;
  }

  if (variant === "dark") {
    return (
      <main className="rounded-lg bg-news-secondary">
        <div className="grid grid-cols-1 divide-y divide-dotted divide-white/30 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="space-y-4 py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0"
            >
              <SixthSectionColumn article={article} variant="dark" />
            </article>
          ))}
        </div>
      </main>
    );
  }

  return (
    <section aria-label="Featured category stories">
      <div className={sectionGridClassName()}>
        {articles.map((article) => (
          <article key={article.slug} className={sectionGridCellClassName()}>
            <SixthSectionColumn article={article} variant="news" />
          </article>
        ))}
      </div>
    </section>
  );
}
