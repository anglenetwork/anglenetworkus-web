import { SITE_PAGE_WIDTH_HUB_CLASS } from "@/app/components/layout/site-page-width";

/** Placeholder chrome matching {@link LiveUpdatesTicker} height while ticker data streams. */
export function LiveUpdatesTickerFallback() {
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
        </div>
      </div>
    </nav>
  );
}
