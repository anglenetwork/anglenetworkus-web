import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HomepageThirdSectionArticle } from "@/app/lib/homepage-third-section";
import { HOMEPAGE_SECTION_PAIR_GAP } from "@/app/components/Landing/homepage-below-fold-spacing";
import {
  sectionGridCellClassName,
  sectionGridClassName,
} from "@/app/lib/homepage/section-grid-cells";
import {
  trendEyebrow,
  trendHeadline,
} from "@/app/lib/typography/third-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface ThirdSectionProps {
  articles: HomepageThirdSectionArticle[];
}

export default function ThirdSection({ articles }: ThirdSectionProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Trending headlines"
      className={cn(
        HOMEPAGE_SECTION_PAIR_GAP,
        "bg-angle-paper px-6 py-10 max-[1000px]:px-6 lg:px-12",
      )}
    >
      <div className={sectionGridClassName({ withTopBorder: false })}>
        {articles.map((article) => (
          <Link
            key={article.tagSlug}
            href={article.href}
            className={sectionGridCellClassName(
              "block py-0 pr-8 pl-8 first:pl-0 last:pr-0 max-[1000px]:px-0",
            )}
            aria-label={`Read article: ${article.title}`}
          >
            <div className={trendEyebrow}>{article.tagTitle}</div>
            <h3 className={trendHeadline}>{article.title}</h3>
            <ReadTimeLabel
              minutes={article.readTime}
              variant="angle"
              className="mt-0"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
