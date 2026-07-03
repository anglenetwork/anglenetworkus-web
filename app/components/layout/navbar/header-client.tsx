"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_PAGE_WIDTH_HUB_CLASS } from "@/app/components/layout/site-page-width";
import { UnifiedNavbar } from "./unified-navbar";
import { HeaderProps } from "./types";

const FullScreenMenu = dynamic(
  () => import("../full-screen-menu").then((mod) => mod.FullScreenMenu),
  { ssr: false },
);

export function HeaderClient({
  categories,
  menuCategories,
  showSubscriptions = false,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusSearchOnOpen, setFocusSearchOnOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastHeightRef = useRef(0);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  if (previousPathnameRef.current !== pathname) {
    previousPathnameRef.current = pathname;
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setFocusSearchOnOpen(false);
    }
  }

  const measureHeaderHeight = useCallback(() => {
    if (!headerRef.current) return;
    const height = headerRef.current.getBoundingClientRect().height || 0;
    if (height === lastHeightRef.current) return;
    lastHeightRef.current = height;
    setHeaderOffset(height);
    document.documentElement.style.setProperty(
      "--header-offset",
      `${height}px`,
    );
  }, []);

  const measureHeaderHeightRef = useRef(measureHeaderHeight);
  measureHeaderHeightRef.current = measureHeaderHeight;

  useEffect(() => {
    if (!isMenuOpen || !headerRef.current) return;

    const measure = () => measureHeaderHeightRef.current();
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(headerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setFocusSearchOnOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((open) => {
      if (!open) setFocusSearchOnOpen(false);
      return !open;
    });
  };

  const handleSearchMenuOpen = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setFocusSearchOnOpen(true);
      setIsMenuOpen(true);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[100] h-[60px] w-full border-stone-200 border-b bg-stone-50"
      >
        <div className={cn(SITE_PAGE_WIDTH_HUB_CLASS, "h-full")}>
          <UnifiedNavbar
            isMenuOpen={isMenuOpen}
            categories={categories}
            showSubscriptions={showSubscriptions}
            onMenuToggle={handleMenuToggle}
            onSearchMenuOpen={handleSearchMenuOpen}
            onCategoryClick={closeMenu}
          />
        </div>
      </header>

      {isMenuOpen ? (
        <FullScreenMenu
          menuCategories={menuCategories}
          onClose={closeMenu}
          headerOffset={headerOffset}
          focusSearchOnOpen={focusSearchOnOpen}
          onFocusSearchHandled={() => setFocusSearchOnOpen(false)}
        />
      ) : null}
    </>
  );
}
