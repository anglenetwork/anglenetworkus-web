import Link from "next/link";
import { NewsTickerScrollControls } from "./news-ticker-scroll-controls";
import { NewsTickerTrack } from "./news-ticker-track";

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
    <nav className="w-full min-w-0 max-w-full bg-white">
      <div className="relative w-full min-w-0 max-w-full">
        <NewsTickerTrack>
          {newsItems.map((item, index) => (
            <div
              key={item.slug || index}
              className="flex shrink-0 items-center"
            >
              <Link
                href={`/post/${item.slug}`}
                className="block whitespace-nowrap px-4 text-base font-normal tracking-normal font-sans hover:opacity-60"
              >
                {item.tickerTitle}
              </Link>
              {index < newsItems.length - 1 && (
                <span className="text-muted-foreground">|</span>
              )}
            </div>
          ))}
        </NewsTickerTrack>
        <NewsTickerScrollControls itemCount={newsItems.length} />
      </div>
    </nav>
  );
}
