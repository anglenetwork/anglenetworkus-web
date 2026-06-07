import Link from "next/link";
import { cn } from "@/lib/utils";
import { articleTitleLink } from "@/app/lib/typography/article-links";
import type { HomepageThirdSectionArticle } from "@/app/lib/homepage-third-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface ThirdSectionProps {
  articles: HomepageThirdSectionArticle[];
}

const GRID_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export default function ThirdSection({ articles }: ThirdSectionProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Top tag headlines"
      className="rounded-lg bg-neutral-100 px-4 py-6 md:px-6 md:py-8"
    >
      <div
        className={cn(
          "grid grid-cols-1 divide-y divide-dotted divide-neutral-300 lg:divide-x lg:divide-y-0",
          GRID_COLS[articles.length] ?? "lg:grid-cols-4",
        )}
      >
        {articles.map((article) => (
          <article
            key={article.tagSlug}
            className="flex flex-col gap-2 py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0"
          >
            <Link
              href={`/tag/${article.tagSlug}`}
              className="group/tag w-fit font-sans font-semibold text-neutral-900 text-xs uppercase tracking-wide hover:opacity-70"
            >
              {article.tagTitle}
            </Link>
            <Link
              href={`/post/${article.slug}`}
              className="group block"
              aria-label={`Read article: ${article.title}`}
            >
              <h3
                className={cn(
                  "font-sans font-semibold text-base text-neutral-900 leading-snug tracking-normal md:text-base",
                  articleTitleLink,
                )}
              >
                {article.title}
              </h3>
            </Link>
            <ReadTimeLabel minutes={article.readTime} />
          </article>
        ))}
      </div>
    </section>
  );
}
