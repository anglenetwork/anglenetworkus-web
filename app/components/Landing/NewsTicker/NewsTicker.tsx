import Link from "next/link";
import { NewsTickerScrollControls } from "./news-ticker-scroll-controls";

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
    .slice(0, 5);

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <nav className="w-full bg-white">
      <div className="relative">
        <div
          id="news-ticker-scroll"
          className="mx-auto flex items-center justify-start overflow-x-auto py-4 scrollbar-hide md:justify-center md:overflow-x-visible"
        >
          {newsItems.map((item, index) => (
            <div key={item.slug || index} className="flex items-center">
              <Link
                href={`/post/${item.slug}`}
                className="whitespace-nowrap px-4 text-base font-light tracking-normal font-sans hover:underline"
              >
                {item.tickerTitle}
              </Link>
              {index < newsItems.length - 1 && (
                <span className="text-muted-foreground">|</span>
              )}
            </div>
          ))}
        </div>
        <NewsTickerScrollControls itemCount={newsItems.length} />
      </div>
    </nav>
  );
}
