import { cn } from "@/lib/utils";
import { articleTitleLink } from "@/app/lib/typography/article-links";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

const DUMMY_ITEMS = [
  {
    id: "1",
    category: "TECH",
    title: "Perplexity is giving out tech's latest status symbol: a Mac Mini",
    readTime: 4,
  },
  {
    id: "2",
    category: "MARKETS",
    title:
      "Charles Schwab's chief strategist warns of 'casino-like behavior' as stocks rally to records",
    readTime: 3,
  },
  {
    id: "3",
    category: "ECONOMY",
    title: "The class of 2026 might have to pivot in their job hunt",
    readTime: 5,
  },
  {
    id: "4",
    category: "AI",
    title: "An AI CEO explains how much he spent on Codex last month",
    readTime: 2,
  },
] as const;

export default function TestSection() {
  return (
    <section
      aria-label="Featured stories"
      className="rounded-lg bg-neutral-100 px-4 py-6 md:px-6 md:py-8"
    >
      <div className="grid grid-cols-1 divide-y divide-dotted divide-neutral-300 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {DUMMY_ITEMS.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-2 py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0"
          >
            <p className="font-sans font-semibold text-neutral-900 text-xs uppercase tracking-wide">
              {item.category}
            </p>
            <h3
              className={cn(
                "font-sans font-semibold text-base text-neutral-900 leading-snug tracking-normal md:text-base",
                articleTitleLink,
              )}
            >
              {item.title}
            </h3>
            <ReadTimeLabel minutes={item.readTime} />
          </article>
        ))}
      </div>
    </section>
  );
}
