"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { MobileHeader } from "./mobile-header";
import { HeaderProps } from "./types";

const DESKTOP_NAV_QUERY = "(min-width: 1024px)";

const DesktopHeader = dynamic(
  () => import("./desktop-header").then((mod) => mod.DesktopHeader),
  { ssr: false },
);

const FullScreenMenu = dynamic(
  () => import("../full-screen-menu").then((mod) => mod.FullScreenMenu),
  { ssr: false },
);

export function HeaderClient({ categories, tags, showsTags }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusSearchOnOpen, setFocusSearchOnOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastHeightRef = useRef(0);
  const pathname = usePathname();
  const isDesktopNav = useMediaQuery(DESKTOP_NAV_QUERY);

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

  useEffect(() => {
    if (!isMenuOpen || !headerRef.current) return;

    measureHeaderHeight();
    const ro = new ResizeObserver(measureHeaderHeight);
    ro.observe(headerRef.current);
    window.addEventListener("resize", measureHeaderHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureHeaderHeight);
    };
  }, [isMenuOpen, measureHeaderHeight]);

  useEffect(() => {
    if (!isMenuOpen) return;
    setIsMenuOpen(false);
    setFocusSearchOnOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close menu on route change only
  }, [pathname]);

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
        className="sticky top-0 z-50 border-neutral-200 border-b bg-white shadow-sm transition-all duration-500 ease-out"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          {isDesktopNav ? (
            <DesktopHeader
              isMenuOpen={isMenuOpen}
              categories={categories}
              onMenuToggle={handleMenuToggle}
              onSearchMenuOpen={handleSearchMenuOpen}
              onCategoryClick={closeMenu}
            />
          ) : (
            <MobileHeader
              isMenuOpen={isMenuOpen}
              onMenuToggle={handleMenuToggle}
              onSearchMenuOpen={handleSearchMenuOpen}
            />
          )}
        </div>
      </header>

      {isMenuOpen ? (
        <FullScreenMenu
          isOpen
          categories={categories}
          tags={tags}
          showsTags={showsTags}
          onClose={closeMenu}
          headerOffset={headerOffset}
          focusSearchOnOpen={focusSearchOnOpen}
          onFocusSearchHandled={() => setFocusSearchOnOpen(false)}
        />
      ) : null}
    </>
  );
}
