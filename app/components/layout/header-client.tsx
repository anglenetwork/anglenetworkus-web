"use client";

import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FullScreenMenu } from "./full-screen-menu";

interface Category {
  slug: string;
  name: string;
  views?: number;
}

interface Tag {
  slug: string;
  title: string;
  views?: number;
}

interface BetterHeaderProps {
  categories: Category[];
  tags: Tag[];
  showsTags: Tag[];
}

export function HeaderClient({
  categories,
  tags,
  showsTags,
}: BetterHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0); // Current header height in pixels
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
      const y = window.scrollY;
      setIsScrolled(y > 20);
      measureHeaderHeight();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 bg-white z-50 transition-all duration-500 ease-out ${
          isScrolled ? "shadow-sm border-b border-neutral-200" : ""
        }`}
      >
        <div className="container mx-auto">
          {/* MOBILE: hamburger (left) • logo (center) • search (right) */}
          <div className="flex items-center justify-between py-3 lg:hidden">
            {/* Left: Hamburger (fixed size on mobile) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className={`rounded-full bg-transparent p-0 relative flex items-center justify-center transition-all duration-500 ease-out h-10 w-10`}
            >
              <div className="relative flex items-center justify-center w-5 h-5">
                <Menu
                  className={`text-black absolute transition-all duration-300 ease-in-out h-5 w-5 ${
                    isMenuOpen
                      ? "opacity-0 rotate-180 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                />
                <X
                  className={`text-black absolute transition-all duration-300 ease-in-out h-5 w-5 ${
                    isMenuOpen
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-180 scale-0"
                  }`}
                />
              </div>
            </Button>

            {/* Center: Logo (fixed size on mobile) */}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="font-bold text-red-600 tracking-tight text-3xl font-sans">
                POLITICO
              </h1>
            </Link>

            {/* Right: Search (fixed size on mobile) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Open search menu"
              className="rounded-full bg-transparent p-0 flex items-center justify-center hover:bg-gray-100 h-10 w-10"
            >
              <Search className="text-black h-5 w-5" />
            </Button>
          </div>

          {/* DESKTOP: hamburger + logo + categories (left) • search (right) */}
          <div className="hidden lg:flex items-center justify-between py-4 transition-all duration-500 ease-out">
            {/* Left block: Hamburger + Logo + Categories */}
            <div className="flex items-center gap-4">
              {/* Hamburger (shrinks only on lg+) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className={`rounded-full bg-transparent p-0 relative flex items-center justify-center transition-all duration-500 ease-out ${
                  isScrolled ? "lg:h-8 lg:w-8" : "lg:h-10 lg:w-10"
                } h-10 w-10`} // mobile fallback (not used here but keeps consistency)
              >
                <div
                  className={`relative flex items-center justify-center transition-all duration-500 ease-out ${
                    isScrolled ? "lg:w-4 lg:h-4" : "lg:w-5 lg:h-5"
                  } w-5 h-5`}
                >
                  <Menu
                    className={`text-black absolute transition-all duration-300 ease-in-out ${
                      isScrolled ? "lg:h-4 lg:w-4" : "lg:h-5 lg:w-5"
                    } h-5 w-5 ${
                      isMenuOpen
                        ? "opacity-0 rotate-180 scale-0"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    className={`text-black absolute transition-all duration-300 ease-in-out ${
                      isScrolled ? "lg:h-4 lg:w-4" : "lg:h-5 lg:w-5"
                    } h-5 w-5 ${
                      isMenuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-180 scale-0"
                    }`}
                  />
                </div>
              </Button>

              {/* Logo (shrinks only on lg+) */}
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <h1
                  className={`font-bold text-blue-600 tracking-tight transition-all duration-500 ease-out font-sans ${
                    isScrolled ? "lg:text-xl" : "lg:text-4xl"
                  } text-4xl`}
                >
                  CURRENTS
                </h1>
              </Link>

              {/* Categories (next to logo) */}
              <nav className="ml-4 flex items-center gap-6">
                {categories.length > 0 ? (
                  categories.slice(0, 10).map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={`hover:text-red-600 font-normal tracking-wide text-neutral-900 capitalize transition-all duration-500 ease-out whitespace-nowrap font-sans ${
                        isScrolled ? "lg:text-base" : "lg:text-base"
                      } text-base`}
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <>
                    {[
                      ["politics", "Politics"],
                      ["policy", "Policy"],
                      ["congress", "Congress"],
                      ["white-house", "White House"],
                      ["elections", "Elections"],
                      ["magazine", "Magazine"],
                      ["newsletters", "Newsletters"],
                      ["podcasts", "Podcasts"],
                    ].map(([href, label]) => (
                      <Link
                        key={href}
                        href={`/${href}`}
                        onClick={() => setIsMenuOpen(false)}
                        className={`hover:text-red-600 font-light text-neutral-900 transition-all duration-500 ease-out whitespace-nowrap font-sans ${
                          isScrolled ? "lg:text-sm" : "lg:text-base"
                        } text-base`}
                      >
                        {label}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </div>

            {/* Right: Search (shrinks only on lg+) */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Open search menu"
                className={`rounded-full bg-transparent p-0 flex items-center justify-center hover:bg-gray-100 transition-all duration-500 ease-out ${
                  isScrolled ? "lg:h-8 lg:w-8" : "lg:h-10 lg:w-10"
                } h-10 w-10`}
              >
                <Search
                  className={`text-black transition-all duration-500 ease-out ${
                    isScrolled ? "lg:h-4 lg:w-4" : "lg:h-5 lg:w-5"
                  } h-5 w-5`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu - Triggered by hamburger or search icons */}
      <FullScreenMenu
        isOpen={isMenuOpen}
        categories={categories}
        tags={tags}
        showsTags={showsTags}
        onClose={() => setIsMenuOpen(false)}
        headerOffset={headerOffset} // Pass current header height for proper positioning
      />
    </>
  );
}
