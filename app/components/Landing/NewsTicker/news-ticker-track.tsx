"use client";

import { useRef, useState, useLayoutEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type NewsTickerTrackProps = {
  children: ReactNode;
};

export function NewsTickerTrack({ children }: NewsTickerTrackProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [centerWhenFits, setCenterWhenFits] = useState(true);
  const centerWhenFitsRef = useRef(true);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const next = inner.scrollWidth <= outer.clientWidth + 1;
      if (next === centerWhenFitsRef.current) return;
      centerWhenFitsRef.current = next;
      setCenterWhenFits(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div
      ref={outerRef}
      id="news-ticker-scroll"
      className={cn(
        "scrollbar-hide flex w-full min-w-0 max-w-full items-center gap-0 overflow-x-auto overscroll-x-contain py-4",
        centerWhenFits ? "justify-center" : "justify-start",
      )}
    >
      <div ref={innerRef} className="flex shrink-0 items-center">
        {children}
      </div>
    </div>
  );
}
