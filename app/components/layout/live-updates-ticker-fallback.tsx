import { SITE_PAGE_WIDTH_HUB_CLASS } from "@/app/components/layout/site-page-width";

/** Placeholder chrome matching {@link LiveUpdatesTicker} height while ticker data streams. */
export function LiveUpdatesTickerFallback() {
  return (
    <nav
      aria-label="Live updates"
      className="w-full border-stone-200 border-b bg-stone-50"
    >
      <div className={SITE_PAGE_WIDTH_HUB_CLASS}>
        <div className="scrollbar-hide flex items-center overflow-x-auto py-[9px]">
          <div className="flex shrink-0 items-center gap-2 border-stone-200 border-r pr-5">
            <span
              className="size-[7px] shrink-0 animate-ticker-pulse rounded-full bg-red-500"
              aria-hidden
            />
            <span className="whitespace-nowrap font-bold font-sans text-[11px] text-red-500 uppercase tracking-[0.1em]">
              Live Updates
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
