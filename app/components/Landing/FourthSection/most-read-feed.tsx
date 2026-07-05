import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { SectionHeader } from "@/app/components/ui/section-header";
import { mostReadFeedHeadline } from "@/app/lib/typography/fourth-section";

export type MostReadFeedItem = {
  id: string;
  title: string;
  href: string;
  readTimeMinutes: number | null;
};

export function MostReadFeed({ items }: { items: MostReadFeedItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside aria-label="Most read articles">
      <SectionHeader title="Most Read" variant="dark" accentStyle="modern" />

      <ul className="flex flex-col divide-y divide-white/15">
        {items.map((item) => (
          <li key={item.id} className="py-5 first:pt-0 last:pb-0">
            <Link
              href={item.href}
              className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-2"
              aria-label={`Read article: ${item.title}`}
            >
              <h3 className={cn(mostReadFeedHeadline, "text-white")}>
                {item.title}
              </h3>
              <ReadTimeLabel minutes={item.readTimeMinutes} variant="dark" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
