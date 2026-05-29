import type { ReactNode } from "react";

type NewsTickerTrackProps = {
  children: ReactNode;
};

/**
 * Horizontal ticker track. Uses `mx-auto` + `w-max` so short content centers
 * without layout-measurement JS (avoids forced reflow from scrollWidth reads).
 */
export function NewsTickerTrack({ children }: NewsTickerTrackProps) {
  return (
    <div
      id="news-ticker-scroll"
      className="scrollbar-hide flex w-full min-w-0 max-w-full items-center overflow-x-auto overscroll-x-contain py-4"
    >
      <div className="mx-auto flex w-max shrink-0 items-center gap-0">
        {children}
      </div>
    </div>
  );
}
