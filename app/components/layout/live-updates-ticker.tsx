import Link from "next/link";
import { SITE_PAGE_WIDTH_HUB_CLASS } from "@/app/components/layout/site-page-width";
import type { TickerPost } from "./site-shell/types";

interface LiveUpdatesTickerProps {
  posts: TickerPost[];
}

export function LiveUpdatesTicker({ posts }: LiveUpdatesTickerProps) {
  const newsItems = posts
    .filter((post) => post.tickerTitle && post.slug)
    .slice(0, 5);

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Live"
      className="w-full border-news-border border-b bg-news-background"
    >
      <div className={SITE_PAGE_WIDTH_HUB_CLASS}>
        <div className="scrollbar-hide flex items-center overflow-x-auto py-[9px]">
          <div className="flex shrink-0 items-center gap-2 border-news-border border-r pr-5">
            <span
              className="size-[7px] shrink-0 animate-ticker-pulse rounded-full bg-news-primary"
              aria-hidden
            />
            <span className="whitespace-nowrap font-bold font-sans text-[11px] text-news-primary uppercase tracking-[0.1em]">
              Live
            </span>
          </div>

          <div className="flex items-center whitespace-nowrap">
            {newsItems.map((item) => (
              <Link
                key={item.slug}
                href={`/post/${item.slug}`}
                className="whitespace-nowrap border-news-border border-r px-5 font-medium font-sans text-[13px] text-news-text leading-none no-underline transition-colors duration-150 hover:text-news-primary"
              >
                {item.tickerTitle}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
