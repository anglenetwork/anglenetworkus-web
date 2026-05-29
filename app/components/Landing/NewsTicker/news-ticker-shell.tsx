"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useDeferredOnInteraction } from "@/app/hooks/use-deferred-on-interaction";

const NewsTickerScrollControls = dynamic(
  () =>
    import("./news-ticker-scroll-controls").then((mod) => ({
      default: mod.NewsTickerScrollControls,
    })),
  { ssr: false },
);

type NewsTickerShellProps = {
  children: ReactNode;
  itemCount: number;
};

export function NewsTickerShell({ children, itemCount }: NewsTickerShellProps) {
  const { armed, interactionProps } = useDeferredOnInteraction();

  return (
    <div className="relative w-full min-w-0 max-w-full" {...interactionProps}>
      {children}
      {armed ? <NewsTickerScrollControls itemCount={itemCount} /> : null}
    </div>
  );
}
