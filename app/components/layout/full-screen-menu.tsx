"use client";

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { SearchBar } from "../ui/search-bar";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

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

const menuNavListClass = "flex flex-col gap-4";

/** Tags and Company nav links */
const menuSecondaryLinkClass =
  "font-medium font-sans text-lg transition-colors hover:text-primary xl:text-xl";

const menuTagFallbacks = [
  { slug: "video", title: "Video" },
  { slug: "shop", title: "Shop" },
  { slug: "health", title: "Health" },
  { slug: "weather", title: "Weather" },
  { slug: "sports", title: "Sports" },
  { slug: "morning-news", title: "Morning News" },
  { slug: "evening-report", title: "Evening Report" },
  { slug: "weekend-edition", title: "Weekend Edition" },
  { slug: "investigative-reports", title: "Investigative Reports" },
  { slug: "special-coverage", title: "Special Coverage" },
  { slug: "documentary-series", title: "Documentary Series" },
] as const;

function EditorialShortcuts({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-x-8 gap-y-3", className)}>
      <Link
        href="/opinion"
        onClick={onClose}
        className="font-sans font-semibold text-lg transition-colors hover:text-primary"
      >
        Opinion
      </Link>
      <Link
        href="/analysis"
        onClick={onClose}
        className="font-sans font-semibold text-lg transition-colors hover:text-primary"
      >
        Analysis
      </Link>
      <Link
        href="/latest"
        onClick={onClose}
        className="font-sans font-semibold text-lg transition-colors hover:text-primary"
      >
        Latest
      </Link>
    </div>
  );
}

interface FullScreenMenuProps {
  isOpen: boolean;
  categories: Category[];
  tags: Tag[];
  showsTags: Tag[];
  onClose: () => void;
  headerOffset: number; // <— new prop: pixels to pad from top
  focusSearchOnOpen?: boolean;
  onFocusSearchHandled?: () => void;
}

export function FullScreenMenu({
  isOpen,
  categories,
  tags,
  showsTags,
  onClose,
  headerOffset,
  focusSearchOnOpen = false,
  onFocusSearchHandled,
}: FullScreenMenuProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  const onFocusSearchHandledRef = useRef(onFocusSearchHandled);
  onCloseRef.current = onClose;
  onFocusSearchHandledRef.current = onFocusSearchHandled;

  const menuTags = useMemo(() => {
    const seen = new Set<string>();
    return [...tags, ...showsTags].filter((tag) => {
      if (seen.has(tag.slug)) return false;
      seen.add(tag.slug);
      return true;
    });
  }, [tags, showsTags]);

  // ESC + body scroll lock (only while open)
  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("keydown", handleEscKey);
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !focusSearchOnOpen) return;

    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      onFocusSearchHandledRef.current?.();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, focusSearchOnOpen]);

  return (
    <div
      className={`fixed inset-0 z-40 overflow-hidden bg-background transition-all duration-500 ease-in-out ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ height: "100svh" }}
      role="dialog"
      aria-label="Navigation menu"
      data-state={isOpen ? "open" : "closed"}
      {...(isOpen
        ? { "aria-modal": true }
        : { "aria-hidden": true, "aria-modal": false })}
      onClick={onClose}
    >
      {/* Only this area can scroll; top padding = current header height */}
      <div
        className="h-full max-h-[100svh] overflow-y-auto overscroll-contain"
        style={{ paddingTop: `${headerOffset || 0}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container mx-auto max-w-7xl md:py-6">
          {/* Shared wrapper: search + nav same horizontal padding */}
          <div
            className={`space-y-6 px-4 pb-4 transition-all duration-700 ease-out sm:px-6 sm:pb-6 md:space-y-12 lg:px-16 lg:pb-16 xl:px-0 xl:pb-0 ${
              isOpen
                ? "translate-y-0 pt-2 opacity-100 md:pt-0"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "150ms" : "0ms" }}
          >
            {isOpen && (
              <>
                {/* Search */}
                <div data-menu-state="open">
                  <SearchBar
                    placeholder="Search news, articles, topics and more"
                    ariaLabel="search bar"
                    onClose={onClose}
                    inputRef={searchInputRef}
                    inputId="menu-search-input"
                  />
                </div>
              </>
            )}

            {/* Navigation Sections */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {/* Main Sections - Dynamic Categories */}
              <div>
                <nav className="flex flex-col gap-4">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        onClick={onClose}
                        className="font-bold font-sans text-2xl capitalize transition-colors hover:text-primary xl:text-3xl"
                      >
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      No categories available
                    </span>
                  )}
                </nav>
              </div>

              {/* Tags */}
              <div>
                <nav className={menuNavListClass}>
                  {(menuTags.length > 0 ? menuTags : menuTagFallbacks).map(
                    (tag) => (
                      <Link
                        key={tag.slug}
                        href={menuTags.length > 0 ? `/tag/${tag.slug}` : "#"}
                        onClick={onClose}
                        className={menuSecondaryLinkClass}
                      >
                        {tag.title}
                      </Link>
                    ),
                  )}
                </nav>
                <EditorialShortcuts
                  onClose={onClose}
                  className="mt-8 border-border border-t pt-6 xl:hidden"
                />
              </div>

              {/* Company */}
              <div>
                <h3 className="mb-4 font-sans font-semibold text-lg text-red-600">
                  Company
                </h3>
                <nav className={menuNavListClass}>
                  <Link
                    href="/company/terms-of-service"
                    onClick={onClose}
                    className={menuSecondaryLinkClass}
                  >
                    Terms of Use
                  </Link>
                  <Link
                    href="/company/privacy-policy"
                    onClick={onClose}
                    className={menuSecondaryLinkClass}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/company/advertise-with-us"
                    onClick={onClose}
                    className={menuSecondaryLinkClass}
                  >
                    Partner with us
                  </Link>
                  <Link
                    href="/company/contact"
                    onClick={onClose}
                    className={menuSecondaryLinkClass}
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          <div
            className={`hidden transition-all duration-700 ease-out xl:block ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "250ms" : "0ms" }}
          >
            <EditorialShortcuts
              onClose={onClose}
              className="border-border border-b p-8 px-4 sm:px-6 lg:px-16 xl:px-0"
            />
          </div>

          {/* Social */}
          <div
            className={`flex items-center gap-4 p-4 transition-all duration-700 ease-out sm:px-6 lg:px-16 xl:px-0 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "300ms" : "0ms" }}
          >
            <span
              aria-label="Facebook"
              className="transition-colors hover:text-primary"
            >
              <Facebook className="size-6" />
            </span>
            <span
              aria-label="Twitter"
              className="transition-colors hover:text-primary"
            >
              <Twitter className="size-6" />
            </span>
            <span
              aria-label="Instagram"
              className="transition-colors hover:text-primary"
            >
              <Instagram className="size-6" />
            </span>
            <span
              aria-label="YouTube"
              className="transition-colors hover:text-primary"
            >
              <Youtube className="size-6" />
            </span>
          </div>

          {/* Footer */}
          <div
            className={`space-y-2 px-4 pb-4 text-muted-foreground text-xs transition-all duration-700 ease-out sm:px-6 sm:pb-6 lg:px-16 lg:pb-16 xl:px-0 xl:pb-8 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "400ms" : "0ms" }}
          >
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href="/company/privacy-policy"
                onClick={onClose}
                className="font-sans transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/company/terms-of-service"
                onClick={onClose}
                className="font-sans transition-colors hover:text-foreground"
              >
                Terms of Use
              </Link>
            </div>
            <p className="font-sans">© 2025 News. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
