"use client";

import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FullScreenMenu } from "./full-screen-menu";

interface Category {
  slug: string;
  name: string;
}

interface HeaderClientProps {
  categories: Category[];
}

export function HeaderClient({ categories }: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPolitico, setShowPolitico] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0); // <— current header height (px)
  const headerRef = useRef<HTMLElement | null>(null);

  // Measure header height whenever it changes (scroll, resize, CSS transitions)
  useEffect(() => {
    if (!headerRef.current) return;

    const el = headerRef.current;

    const measure = () => {
      const h = el.getBoundingClientRect().height || 0;
      setHeaderOffset(h);
      // also expose as CSS variable for any other consumers
      document.documentElement.style.setProperty("--header-offset", `${h}px`);
    };

    measure();

    // Listen to size changes of the header (handles show/hide transitions)
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Re-measure on resize
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Toggle compact state on scroll and re-measure
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const nextIsScrolled = scrollTop > 50;
      setIsScrolled(nextIsScrolled);
      setShowPolitico(!nextIsScrolled);
      // measurement is handled by ResizeObserver, but this keeps it snappy
      if (headerRef.current) {
        const h = headerRef.current.getBoundingClientRect().height || 0;
        setHeaderOffset(h);
        document.documentElement.style.setProperty("--header-offset", `${h}px`);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header ref={headerRef} className="sticky top-0 bg-white z-50">
        <div className="">
          {/* Top Bar - POLITICO Logo + Hamburger Button */}
          <div
            className={`container mx-auto transition-all duration-500 ease-in-out ${
              showPolitico
                ? "opacity-100 max-h-20 translate-y-0 "
                : "opacity-0 max-h-0 -translate-y-full overflow-hidden border-b-0"
            }`}
          >
            <div className="flex items-center justify-between py-3">
              {/* Left side - Hamburger Button */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className="h-10 w-10 rounded-full bg-transparent p-0 relative overflow-hidden flex items-center justify-center"
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Menu
                      className={`h-5 w-5 text-black absolute transition-all duration-300 ease-in-out ${
                        isMenuOpen
                          ? "opacity-0 rotate-180 scale-0"
                          : "opacity-100 rotate-0 scale-100"
                      }`}
                    />
                    <X
                      className={`h-5 w-5 text-black absolute transition-all duration-300 ease-in-out ${
                        isMenuOpen
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 -rotate-180 scale-0"
                      }`}
                    />
                  </div>
                </Button>
              </div>

              {/* Center - POLITICO Logo */}
              <div className="flex items-center">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <h1 className="text-4xl font-bold text-red-600 tracking-tight">
                    POLITICO
                  </h1>
                </Link>
              </div>

              {/* Right side - Search Button */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full bg-transparent p-0 flex items-center justify-center hover:bg-gray-100"
                >
                  <Search className="h-5 w-5 text-black" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Bar - Categories */}
          <nav className=" hidden md:block border-t border-neutral-200">
            <div
              className={`mx-auto container flex items-center py-3 text-sm font-medium text-gray-700 transition-all duration-500 ease-in-out ${
                isScrolled ? "justify-between" : "justify-center space-x-8"
              }`}
            >
              {/* Left Block */}
              <div className="flex items-center space-x-6">
                {/* Compact Header Elements - Only visible when scrolled */}
                {isScrolled && (
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMenuOpen((v) => !v)}
                      className="h-8 w-8 rounded-full bg-transparent p-0 relative overflow-hidden flex items-center justify-center"
                    >
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <Menu
                          className={`h-4 w-4 text-black absolute transition-all duration-300 ease-in-out ${
                            isMenuOpen
                              ? "opacity-0 rotate-180 scale-0"
                              : "opacity-100 rotate-0 scale-100"
                          }`}
                        />
                        <X
                          className={`h-4 w-4 text-black absolute transition-all duration-300 ease-in-out ${
                            isMenuOpen
                              ? "opacity-100 rotate-0 scale-100"
                              : "opacity-0 -rotate-180 scale-0"
                          }`}
                        />
                      </div>
                    </Button>

                    <Link
                      href="/"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <h2 className="text-lg font-bold text-red-600 tracking-tight">
                        POLITICO
                      </h2>
                    </Link>
                  </div>
                )}

                {/* Categories - Always visible */}
                <div className="flex items-center space-x-8">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <a
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="hover:text-red-600 font-outfit font-light text-neutral-900 text-base capitalize"
                      >
                        {category.name}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-500">
                      No categories available
                    </span>
                  )}
                </div>
              </div>

              {/* Right Block - Search Button (only visible when scrolled) */}
              {isScrolled && (
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-transparent p-0 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Search className="h-4 w-4 text-black" />
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Full Screen Menu */}
      <FullScreenMenu
        isOpen={isMenuOpen}
        categories={categories}
        onClose={() => setIsMenuOpen(false)}
        headerOffset={headerOffset} // <— pass current header height
      />
    </>
  );
}
