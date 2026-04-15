"use client";

import {
  useRef,
  useState,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type NewsTickerTrackProps = {
  children: ReactNode;
};

export function NewsTickerTrack({ children }: NewsTickerTrackProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [centerWhenFits, setCenterWhenFits] = useState(true);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      setCenterWhenFits(inner.scrollWidth <= outer.clientWidth + 1);
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
        "flex w-full min-w-0 max-w-full items-center gap-0 overflow-x-auto overscroll-x-contain py-4 scrollbar-hide",
        centerWhenFits ? "justify-center" : "justify-start",
      )}
    >
      <div ref={innerRef} className="flex shrink-0 items-center">
        {children}
      </div>
    </div>
  );
}
