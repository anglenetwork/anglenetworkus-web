"use client";

import dynamic from "next/dynamic";

const NewsTickerScrollControls = dynamic(
  () =>
    import("./news-ticker-scroll-controls").then((mod) => ({
      default: mod.NewsTickerScrollControls,
    })),
  { ssr: false },
);

export function NewsTickerControls({ itemCount }: { itemCount: number }) {
  return <NewsTickerScrollControls itemCount={itemCount} />;
}
