import Link from "next/link";
import { NewsTickerTrack } from "./news-ticker-track";
import { NewsTickerShell } from "./news-ticker-shell";
import { newsTickerItemLink } from "@/app/lib/typography/news-ticker";

interface NewsTickerPost {
  tickerTitle: string;
  slug: string;
}

interface NewsTickerProps {
  posts: NewsTickerPost[];
}

export function NewsTicker({ posts }: NewsTickerProps) {
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
