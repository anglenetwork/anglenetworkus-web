"use client";

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { SearchBar } from "../ui/search-bar";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { UserMenu } from "./navbar/user-menu";

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
  // ESC + body scroll lock + disable focusable elements when closed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      // Lock page scroll (no layout shift)
      const sw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (sw > 0) document.body.style.paddingRight = `${sw}px`;
    }

    // Disable/enable focusable elements based on menu state
    const menuElement = document.querySelector(
      '[role="dialog"][aria-label="Navigation menu"]',
    );
    if (menuElement) {
      const focusableElements = menuElement.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      focusableElements.forEach((el) => {
        if (!isOpen) {
          (el as HTMLElement).setAttribute("tabindex", "-1");
        } else {
          (el as HTMLElement).removeAttribute("tabindex");
        }
      });
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !focusSearchOnOpen) return;

    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      onFocusSearchHandled?.();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen, focusSearchOnOpen, onFocusSearchHandled]);

  return (
    <div
      className={`fixed inset-0 z-40 overflow-hidden bg-background transition-all duration-500 ease-in-out ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ height: "100svh" }}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal={isOpen ? "true" : "false"}
      aria-label="Navigation menu"
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
            className={`space-y-10 px-4 transition-all duration-700 ease-out md:space-y-12 md:px-0 ${
              isOpen
                ? "translate-y-0 pt-2 opacity-100 md:pt-0"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "150ms" : "0ms" }}
          >
            {/* Search */}
            <div data-menu-state={isOpen ? "open" : "closed"}>
              <SearchBar
                placeholder="Search news, articles, topics and more"
                ariaLabel="search bar"
                onClose={onClose}
                inputRef={searchInputRef}
                inputId="menu-search-input"
              />
            </div>

            {/* Sign in (mobile menu only; navbar hides it on small screens) */}
            <div className="lg:hidden">
              <UserMenu
                signInOnly
                signInButtonVariant="link"
                onSignInNavigate={onClose}
              />
            </div>

            {/* Editorial shortcuts */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-border border-b pb-6">
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

            {/* Navigation Sections */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
              {/* Main Sections - Dynamic Categories */}
              <div>
                <nav className="flex flex-col gap-4">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        onClick={onClose}
                        className="font-bold font-sans text-3xl capitalize transition-colors hover:text-primary"
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

              {/* Content Types */}
              <div>
                <nav className="flex flex-col gap-4">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/tag/${tag.slug}`}
                        onClick={onClose}
                        className="font-bold font-sans text-2xl transition-colors hover:text-primary"
                      >
                        {tag.title}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-bold font-sans text-2xl transition-colors hover:text-primary"
                      >
                        Video
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-bold font-sans text-2xl transition-colors hover:text-primary"
                      >
                        Shop
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-bold font-sans text-2xl transition-colors hover:text-primary"
                      >
                        Health
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-bold font-sans text-2xl transition-colors hover:text-primary"
                      >
                        Weather
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-bold font-sans text-2xl transition-colors hover:text-primary"
                      >
                        Sports
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              {/* See more */}
              <div>
                <h3 className="mb-4 font-sans font-semibold text-blue-600 text-lg">
                  See more
                </h3>
                <nav className="flex flex-col gap-3">
                  {showsTags.length > 0 ? (
                    showsTags.map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/tag/${tag.slug}`}
                        onClick={onClose}
                        className="font-sans text-base transition-colors hover:text-primary"
                      >
                        {tag.title}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-sans text-base transition-colors hover:text-primary"
                      >
                        Morning News
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-sans text-base transition-colors hover:text-primary"
                      >
                        Evening Report
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-sans text-base transition-colors hover:text-primary"
                      >
                        Weekend Edition
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-sans text-base transition-colors hover:text-primary"
                      >
                        Investigative Reports
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-sans text-base transition-colors hover:text-primary"
                      >
                        Special Coverage
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="font-sans text-base transition-colors hover:text-primary"
                      >
                        Documentary Series
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              {/* Company */}
              <div>
                <h3 className="mb-4 font-sans font-semibold text-blue-600 text-lg">
                  Company
                </h3>
                <nav className="flex flex-col gap-3">
                  <Link
                    href="/company/terms-of-service"
                    onClick={onClose}
                    className="font-sans text-base transition-colors hover:text-primary"
                  >
                    Terms of Use
                  </Link>
                  <Link
                    href="/company/privacy-policy"
                    onClick={onClose}
                    className="font-sans text-base transition-colors hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/company/advertise-with-us"
                    onClick={onClose}
                    className="font-sans text-base transition-colors hover:text-primary"
                  >
                    Partner with us
                  </Link>
                  <Link
                    href="/company/contact"
                    onClick={onClose}
                    className="font-sans text-base transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          {/* Social */}
          <div
            className={`mt-10 mb-8 flex items-center gap-4 px-4 transition-all duration-700 ease-out md:px-0 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? "300ms" : "0ms" }}
          >
            <a
              href="#"
              aria-label="Facebook"
              className="transition-colors hover:text-primary"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="transition-colors hover:text-primary"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="transition-colors hover:text-primary"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="transition-colors hover:text-primary"
            >
              <Youtube className="h-6 w-6" />
            </a>
          </div>

          {/* Footer */}
          <div
            className={`space-y-2 px-4 text-muted-foreground text-xs transition-all duration-700 ease-out md:px-0 ${
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
