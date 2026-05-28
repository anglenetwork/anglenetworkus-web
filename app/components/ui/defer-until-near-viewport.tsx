"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DeferUntilNearViewportProps = {
  children: ReactNode;
  fallback: ReactNode;
  /** IntersectionObserver rootMargin (default loads ~400px before entering viewport). */
  rootMargin?: string;
};

/**
 * Renders children only when the sentinel nears the viewport.
 * Defers child chunk download/hydration until scroll (or wide rootMargin on tall viewports).
 */
export function DeferUntilNearViewport({
  children,
  fallback,
  rootMargin = "400px 0px",
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
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender, rootMargin]);

  return (
    <div ref={sentinelRef} className="min-w-0">
      {shouldRender ? children : fallback}
    </div>
  );
}
