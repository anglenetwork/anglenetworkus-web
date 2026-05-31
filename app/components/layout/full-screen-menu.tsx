"use client";

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { SearchBar } from "../ui/search-bar";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
  categories: Category[];
  tags: Tag[];
  showsTags: Tag[];
  onClose: () => void;
  headerOffset: number;
  focusSearchOnOpen?: boolean;
  onFocusSearchHandled?: () => void;
}

export function FullScreenMenu({
  categories,
  tags,
  showsTags,
  onClose,
  headerOffset,
  focusSearchOnOpen = false,
  onFocusSearchHandled,
}: FullScreenMenuProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const onFocusSearchHandledRef = useRef(onFocusSearchHandled);
  onCloseRef.current = onClose;
  onFocusSearchHandledRef.current = onFocusSearchHandled;

  const [visible, setVisible] = useState(false);

  const menuTags = useMemo(() => {
    const seen = new Set<string>();
    return [...tags, ...showsTags].filter((tag) => {
      if (seen.has(tag.slug)) return false;
      seen.add(tag.slug);
      return true;
    });
  }, [tags, showsTags]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const frameId = requestAnimationFrame(() => setVisible(true));

    const handleDialogClose = () => {
      onCloseRef.current();
    };

    dialog.addEventListener("close", handleDialogClose);

    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;

    return () => {
      cancelAnimationFrame(frameId);
      dialog.removeEventListener("close", handleDialogClose);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    if (!focusSearchOnOpen) return;

    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      onFocusSearchHandledRef.current?.();
    });

    return () => cancelAnimationFrame(frameId);
  }, [focusSearchOnOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Navigation menu"
      data-state="open"
      className={cn(
        "fixed inset-0 z-40 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-background p-0 transition-all duration-500 ease-in-out backdrop:bg-black/40",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
      style={{ height: "100svh" }}
    >
      <div
        className="h-full max-h-[100svh] overflow-y-auto overscroll-contain"
        style={{ paddingTop: `${headerOffset || 0}px` }}
      >
        <div className="container mx-auto max-w-7xl md:py-6">
          <div
            className={cn(
              "space-y-6 px-4 pb-4 transition-all duration-700 ease-out sm:px-6 sm:pb-6 md:space-y-12 lg:px-16 lg:pb-16 xl:px-0 xl:pb-0",
              visible
                ? "translate-y-0 pt-2 opacity-100 md:pt-0"
                : "translate-y-8 opacity-0",
            )}
            style={{ transitionDelay: visible ? "150ms" : "0ms" }}
          >
            <div data-menu-state="open">
              <SearchBar
                placeholder="Search news, articles, topics and more"
                ariaLabel="search bar"
                onClose={onClose}
                inputRef={searchInputRef}
                inputId="menu-search-input"
              />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
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
            className={cn(
              "hidden transition-all duration-700 ease-out xl:block",
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
            style={{ transitionDelay: visible ? "250ms" : "0ms" }}
          >
            <EditorialShortcuts
              onClose={onClose}
              className="border-border border-b p-8 px-4 sm:px-6 lg:px-16 xl:px-0"
            />
          </div>

          <div
            className={cn(
              "flex items-center gap-4 p-4 transition-all duration-700 ease-out sm:px-6 lg:px-16 xl:px-0",
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
            style={{ transitionDelay: visible ? "300ms" : "0ms" }}
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

          <div
            className={cn(
              "space-y-2 px-4 pb-4 text-muted-foreground text-xs transition-all duration-700 ease-out sm:px-6 sm:pb-6 lg:px-16 lg:pb-16 xl:px-0 xl:pb-8",
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
            style={{ transitionDelay: visible ? "400ms" : "0ms" }}
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
    </dialog>
  );
}
