"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FullScreenMenu } from "../full-screen-menu";
import { MobileHeader } from "./mobile-header";
import { DesktopHeader } from "./desktop-header";
import { HeaderProps } from "./types";

export function HeaderClient({ categories, tags, showsTags }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  const measureHeaderHeight = () => {
    if (!headerRef.current) return;
    const height = headerRef.current.getBoundingClientRect().height || 0;
    setHeaderOffset(height);
    document.documentElement.style.setProperty(
      "--header-offset",
      `${height}px`
    );
  };

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
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      measureHeaderHeight();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen((v) => !v);
  };

  const handleCategoryClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 bg-white z-50 transition-all duration-500 ease-out border-b border-neutral-200 shadow-sm"
      >
        <div className="container mx-auto">
          <MobileHeader
            isMenuOpen={isMenuOpen}
            onMenuToggle={handleMenuToggle}
          />
          <DesktopHeader
            isMenuOpen={isMenuOpen}
            categories={categories}
            onMenuToggle={handleMenuToggle}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </header>

      <FullScreenMenu
        isOpen={isMenuOpen}
        categories={categories}
        tags={tags}
        showsTags={showsTags}
        onClose={() => setIsMenuOpen(false)}
        headerOffset={headerOffset}
      />
    </>
  );
}
