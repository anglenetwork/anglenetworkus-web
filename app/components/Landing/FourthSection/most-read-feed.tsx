import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import {
  mostReadFeedHeadline,
  mostReadFeedSeeAllLink,
  mostReadFeedTitle,
} from "@/app/lib/typography/fourth-section";

export type MostReadFeedItem = {
  id: string;
  title: string;
  href: string;
  readTimeMinutes: number | null;
};

function MostReadFeedHeader({ seeAllHref }: { seeAllHref: string }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <h2 className={mostReadFeedTitle}>
        <span className="relative inline-block">
          M
          <span
            className="absolute right-0 -bottom-1 left-0 h-1 bg-news-primary"
            aria-hidden
          />
        </span>
        ost Read
      </h2>
      <Link
        href={seeAllHref}
        className="group flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-2"
      >
        <span className={mostReadFeedSeeAllLink}>See all</span>
        <span
          className="flex size-6 items-center justify-center rounded-full bg-news-primary text-white"
          aria-hidden
        >
          <ChevronRight className="size-3.5 stroke-[2.5]" />
        </span>
      </Link>
    </div>
  );
}

export function MostReadFeed({
  items,
  seeAllHref = "/latest",
}: {
  items: MostReadFeedItem[];
  seeAllHref?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside aria-label="Most read articles">
      <MostReadFeedHeader seeAllHref={seeAllHref} />

      <ul className="flex flex-col divide-y divide-dotted divide-news-border">
        {items.map((item) => (
          <li key={item.id} className="py-5 first:pt-0 last:pb-0">
            <Link
              href={item.href}
              className="group block space-y-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-2"
              aria-label={`Read article: ${item.title}`}
            >
              <ReadTimeLabel minutes={item.readTimeMinutes} variant="accent" />
              <h3 className={mostReadFeedHeadline}>{item.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
