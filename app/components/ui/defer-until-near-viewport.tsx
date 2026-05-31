"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Flush with viewport bottom — avoids mobile prefetch of far below-fold sections. */
const DEFER_ROOT_MARGIN = "0px 0px 120px 0px";

type DeferUntilNearViewportProps = {
  children: ReactNode;
  fallback: ReactNode;
};

/**
 * Renders children only when the sentinel nears the viewport.
 * Defers child chunk download/hydration until scroll.
 */
export function DeferUntilNearViewport({
  children,
  fallback,
}: DeferUntilNearViewportProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: DEFER_ROOT_MARGIN },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={sentinelRef} className="min-w-0">
      {shouldRender ? children : fallback}
    </div>
  );
}
