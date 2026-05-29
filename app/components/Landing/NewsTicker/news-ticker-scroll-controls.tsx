"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function NewsTickerScrollControls({ itemCount }: { itemCount: number }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const showLeftRef = useRef(false);
  const showRightRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = document.getElementById("news-ticker-scroll");
    if (!container) return;

    const applyScrollState = () => {
      rafRef.current = null;
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const nextLeft = scrollLeft > 10;
      const nextRight = scrollLeft < maxScroll - 10;

      if (nextLeft !== showLeftRef.current) {
        showLeftRef.current = nextLeft;
        setShowLeftArrow(nextLeft);
      }
      if (nextRight !== showRightRef.current) {
        showRightRef.current = nextRight;
        setShowRightArrow(nextRight);
      }
    };

    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(applyScrollState);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Defer first layout read until scroll or idle (avoids forced reflow on mount).
    const idleId =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => applyScrollState(), {
            timeout: 2000,
          })
        : window.setTimeout(() => applyScrollState(), 1);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId as number);
      } else {
        window.clearTimeout(idleId as number);
      }
    };
  }, []);

  const scrollToNext = () => {
    const container = document.getElementById("news-ticker-scroll");
    if (container) {
      const itemWidth = container.scrollWidth / itemCount;
      container.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  const scrollToPrev = () => {
    const container = document.getElementById("news-ticker-scroll");
    if (container) {
      const itemWidth = container.scrollWidth / itemCount;
      container.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  return (
    <>
      {showLeftArrow && (
        <button
          onClick={scrollToPrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white p-1 shadow-md md:hidden"
          aria-label="Scroll to previous article"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={scrollToNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white p-1 shadow-md md:hidden"
          aria-label="Scroll to next article"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
