"use client";

import {
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { SearchBar } from "../ui/search-bar";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  buildXlMenuGrid,
  type NavMenuCategory,
  type NavMenuColumn,
} from "@/app/lib/nav/menu-columns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

/** Tags nav links */
const menuSecondaryLinkClass =
  "font-normal font-sans text-lg transition-colors hover:text-primary xl:text-base";

const menuNavListClass = "mt-4 flex flex-col gap-2";
const menuCategoryLinkClass =
  "font-semibold font-sans text-2xl capitalize transition-colors hover:text-primary xl:text-2xl";

const menuActionLinkClass =
  "font-sans font-semibold text-lg transition-colors hover:text-primary";

function MenuCategoryAccordion({
  categories,
  onClose,
}: {
  categories: NavMenuCategory[];
  onClose: () => void;
}) {
  return (
    <Accordion type="multiple" className="w-full">
      {categories.map((category) => (
        <AccordionItem
          key={category.slug}
          value={category.slug}
          className="border-border border-b border-dotted"
        >
          <AccordionPrimitive.Header className="flex items-center justify-between">
            <Link
              href={`/category/${category.slug}`}
              onClick={onClose}
              className={cn(menuCategoryLinkClass, "shrink-0 py-3")}
            >
              {category.name}
            </Link>
            <AccordionPrimitive.Trigger
              className={cn(
                "flex flex-1 items-center justify-end py-3 pl-4 hover:no-underline",
                "text-muted-foreground transition-colors hover:text-primary",
                "[&[data-state=open]>svg]:rotate-180",
              )}
            >
              <span className="sr-only">Show {category.name} tags</span>
              <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent>
            {category.tags.length > 0 ? (
              <nav
                className={menuNavListClass}
                aria-label={`${category.name} tags`}
              >
                {category.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    onClick={onClose}
                    className={menuSecondaryLinkClass}
                  >
                    {tag.title}
                  </Link>
                ))}
              </nav>
            ) : (
              <Link
                href={`/category/${category.slug}`}
                onClick={onClose}
                className={menuSecondaryLinkClass}
              >
                View {category.name}
              </Link>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function MenuCategorySection({
  category,
  onClose,
}: {
  category: NavMenuCategory;
  onClose: () => void;
}) {
  return (
    <section>
      <Link
        href={`/category/${category.slug}`}
        onClick={onClose}
        className={menuCategoryLinkClass}
      >
        {category.name}
      </Link>
      {category.tags.length > 0 ? (
        <nav className={menuNavListClass} aria-label={`${category.name} tags`}>
          {category.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              onClick={onClose}
              className={menuSecondaryLinkClass}
            >
              {tag.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
}

function MenuActionLinks({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-x-8 gap-y-3", className)}>
      <Link href="/opinion" onClick={onClose} className={menuActionLinkClass}>
        Opinion
      </Link>
      <Link href="/analysis" onClick={onClose} className={menuActionLinkClass}>
        Analysis
      </Link>
      <Link
        href="/company/advertise-with-us"
        onClick={onClose}
        className={menuActionLinkClass}
      >
        Partner with us
      </Link>
      <Link
        href="/company/contact"
        onClick={onClose}
        className={menuActionLinkClass}
      >
        Contact
      </Link>
    </div>
  );
}

interface FullScreenMenuProps {
  menuColumns: NavMenuColumn[];
  onClose: () => void;
  headerOffset: number;
  focusSearchOnOpen?: boolean;
  onFocusSearchHandled?: () => void;
}

export function FullScreenMenu({
  menuColumns,
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
  const xlMenuRows = buildXlMenuGrid(menuColumns);
  const menuCategories = useMemo(
    () => menuColumns.flatMap((column) => column.categories),
    [menuColumns],
  );

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setVisible(true));

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("keydown", handleEscKey);

    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("keydown", handleEscKey);
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
      open
      aria-modal="true"
      aria-label="Navigation menu"
      data-state="open"
      className={cn(
        "fixed inset-0 z-40 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-background p-0 transition-all duration-500 ease-in-out",
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

            <div className="md:hidden">
              <MenuCategoryAccordion
                categories={menuCategories}
                onClose={onClose}
              />
            </div>

            <div className="hidden gap-12 md:grid md:grid-cols-2 lg:grid-cols-2 xl:hidden">
              {menuColumns.map((column, columnIndex) => (
                <div
                  key={`menu-column-${columnIndex}`}
                  className="flex flex-col gap-8"
                >
                  {column.categories.map((category) => (
                    <MenuCategorySection
                      key={category.slug}
                      category={category}
                      onClose={onClose}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div
              className="hidden gap-x-12 gap-y-8 xl:grid xl:grid-cols-5"
              style={{
                gridTemplateRows: `repeat(${xlMenuRows.length}, auto)`,
              }}
            >
              {xlMenuRows.flatMap((row, rowIndex) =>
                row.map((category, columnIndex) =>
                  category ? (
                    <MenuCategorySection
                      key={category.slug}
                      category={category}
                      onClose={onClose}
                    />
                  ) : (
                    <div
                      key={`xl-menu-empty-${rowIndex}-${columnIndex}`}
                      aria-hidden
                    />
                  ),
                ),
              )}
            </div>

            <MenuActionLinks
              onClose={onClose}
              className="border-border border-t pt-6 md:pt-8"
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
