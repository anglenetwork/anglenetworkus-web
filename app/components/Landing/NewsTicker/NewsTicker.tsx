import Link from "next/link";
import { NewsTickerTrack } from "./news-ticker-track";
import { NewsTickerShell } from "./news-ticker-shell";
import {
  newsTickerItemLink,
  newsTickerLiveUpdatesLabel,
} from "@/app/lib/typography/news-ticker";

interface NewsTickerPost {
  tickerTitle: string;
  slug: string;
}

interface NewsTickerProps {
  posts: NewsTickerPost[];
  /** Landing homepage only — prepends a muted "Live Updates" label. */
  showLiveUpdatesLabel?: boolean;
}

export function NewsTicker({
  posts,
  showLiveUpdatesLabel = false,
}: NewsTickerProps) {
  // Filter out posts without tickerTitle
  const newsItems = posts
    .filter((post) => post.tickerTitle && post.slug)
    .slice(0, 4);

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <nav className="w-full min-w-0 max-w-full bg-news-surface">
      <NewsTickerShell itemCount={newsItems.length}>
        <NewsTickerTrack>
          {showLiveUpdatesLabel ? (
            <div className="flex shrink-0 items-center">
              <span className={newsTickerLiveUpdatesLabel}>Live Updates</span>
              {newsItems.length > 0 ? (
                <span className="text-news-muted">|</span>
              ) : null}
            </div>
          ) : null}
          {newsItems.map((item, index) => (
            <div
              key={item.slug || index}
              className="flex shrink-0 items-center"
            >
              <Link href={`/post/${item.slug}`} className={newsTickerItemLink}>
                {item.tickerTitle}
              </Link>
              {index < newsItems.length - 1 && (
                <span className="text-news-muted">|</span>
              )}
            </div>
          ))}
        </NewsTickerTrack>
      </NewsTickerShell>
    </nav>
  );
}
