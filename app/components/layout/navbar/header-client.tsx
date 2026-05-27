"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { FullScreenMenu } from "../full-screen-menu";
import { MobileHeader } from "./mobile-header";
import { DesktopHeader } from "./desktop-header";
import { HeaderProps } from "./types";

export function HeaderClient({ categories, tags, showsTags }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusSearchOnOpen, setFocusSearchOnOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastHeightRef = useRef(0);
  const pathname = usePathname();

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
    if (!headerRef.current) return;
    measureHeaderHeight();
    const ro = new ResizeObserver(measureHeaderHeight);
    ro.observe(headerRef.current);
    const onResize = () => measureHeaderHeight();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [measureHeaderHeight]);

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setFocusSearchOnOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleMenuToggle = () => {
    setIsMenuOpen((v) => {
      if (!v) setFocusSearchOnOpen(false);
      return !v;
    });
  };

  const handleSearchMenuOpen = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setFocusSearchOnOpen(false);
    } else {
      setFocusSearchOnOpen(true);
      setIsMenuOpen(true);
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setFocusSearchOnOpen(false);
  };

  const handleCategoryClick = () => {
    handleMenuClose();
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-neutral-200 border-b bg-white shadow-sm transition-all duration-500 ease-out"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <MobileHeader
            isMenuOpen={isMenuOpen}
            onMenuToggle={handleMenuToggle}
            onSearchMenuOpen={handleSearchMenuOpen}
          />
          <DesktopHeader
            isMenuOpen={isMenuOpen}
            categories={categories}
            onMenuToggle={handleMenuToggle}
            onSearchMenuOpen={handleSearchMenuOpen}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </header>

      <FullScreenMenu
        isOpen={isMenuOpen}
        categories={categories}
        tags={tags}
        showsTags={showsTags}
        onClose={handleMenuClose}
        headerOffset={headerOffset}
        focusSearchOnOpen={focusSearchOnOpen}
        onFocusSearchHandled={() => setFocusSearchOnOpen(false)}
      />
    </>
  );
}
