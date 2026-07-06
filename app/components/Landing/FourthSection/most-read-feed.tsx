import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  mostReadHeadline,
  mostReadMeta,
  mostReadTitle,
} from "@/app/lib/typography/fourth-section";
import { formatReadTimeLabel } from "@/app/lib/typography/read-time";

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
      <div
        className={cn(
          "bg-angle-ink px-9 py-8 text-angle-bg",
          "max-[1100px]:bg-transparent max-[1100px]:px-0 max-[1100px]:pt-8 max-[1100px]:pb-0 max-[1100px]:text-angle-ink",
        )}
      >
        <h2 className={mostReadTitle}>Most Read</h2>

        <ul className="list-none">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-angle-bg/15 border-t py-5 first:border-t-0 first:pt-0 max-[1100px]:border-angle-hairline"
            >
              <Link
                href={item.href}
                className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-angle-red focus-visible:outline-offset-[3px]"
                aria-label={`Read article: ${item.title}`}
              >
                <h3 className={mostReadHeadline}>{item.title}</h3>
                <p className={mostReadMeta}>
                  {formatReadTimeLabel(item.readTimeMinutes)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
