"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function NewsTickerScrollControls({ itemCount }: { itemCount: number }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const container = document.getElementById("news-ticker-scroll");

    const handleScroll = () => {
      if (container) {
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft < maxScroll - 10);
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
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
