import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HomepageThirdSectionArticle } from "@/app/lib/homepage-third-section";
import {
  HOMEPAGE_LANDING_INSET_X,
  HOMEPAGE_SECTION_PAIR_GAP,
} from "@/app/components/Landing/homepage-below-fold-spacing";
import {
  sectionGridClassName,
  sectionTrendingCellClassName,
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
        "bg-angle-paper max-lg:py-6 lg:px-12 lg:py-10",
        HOMEPAGE_LANDING_INSET_X,
      )}
    >
      <div className={sectionGridClassName({ withTopBorder: false })}>
        {articles.map((article) => (
          <Link
            key={article.tagSlug}
            href={article.href}
            className={sectionTrendingCellClassName()}
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
