"use client";

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { SearchBar } from "../ui/search-bar";
import Link from "next/link";
import { useEffect } from "react";

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
}

export function FullScreenMenu({
  isOpen,
  categories,
  tags,
  showsTags,
  onClose,
  headerOffset,
}: FullScreenMenuProps) {
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
    const menuElement = document.querySelector('[role="dialog"][aria-label="Navigation menu"]');
    if (menuElement) {
      const focusableElements = menuElement.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach((el) => {
        if (!isOpen) {
          (el as HTMLElement).setAttribute('tabindex', '-1');
        } else {
          (el as HTMLElement).removeAttribute('tabindex');
        }
      });
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 bg-background overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
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
        <div className="container mx-auto md:py-6">
          {/* Shared wrapper: search + nav same horizontal padding */}
          <div
            className={`px-4 md:px-0 space-y-10 md:space-y-12 transition-all duration-700 ease-out ${
              isOpen
                ? "opacity-100 translate-y-0 pt-2 md:pt-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isOpen ? "150ms" : "0ms" }}
          >
            {/* Search */}
            <div data-menu-state={isOpen ? "open" : "closed"}>
              <SearchBar
                placeholder="Search news, articles, topics and more"
                ariaLabel="search bar"
                onClose={onClose}
              />
            </div>

            {/* Navigation Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {/* Main Sections - Dynamic Categories */}
              <div>
                <nav className="flex flex-col gap-4">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        onClick={onClose}
                        className="text-3xl font-bold hover:text-primary transition-colors capitalize font-sans"
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
                        className="text-2xl font-bold hover:text-primary transition-colors font-sans"
                      >
                        {tag.title}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-2xl font-bold hover:text-primary transition-colors font-sans"
                      >
                        Video
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-2xl font-bold hover:text-primary transition-colors font-sans"
                      >
                        Shop
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-2xl font-bold hover:text-primary transition-colors font-sans"
                      >
                        Health
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-2xl font-bold hover:text-primary transition-colors font-sans"
                      >
                        Weather
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-2xl font-bold hover:text-primary transition-colors font-sans"
                      >
                        Sports
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              {/* See more */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600 font-sans">
                  See more
                </h3>
                <nav className="flex flex-col gap-3">
                  {showsTags.length > 0 ? (
                    showsTags.map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/tag/${tag.slug}`}
                        onClick={onClose}
                        className="text-base hover:text-primary transition-colors font-sans"
                      >
                        {tag.title}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-base hover:text-primary transition-colors font-sans"
                      >
                        Morning News
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-base hover:text-primary transition-colors font-sans"
                      >
                        Evening Report
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-base hover:text-primary transition-colors font-sans"
                      >
                        Weekend Edition
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-base hover:text-primary transition-colors font-sans"
                      >
                        Investigative Reports
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-base hover:text-primary transition-colors font-sans"
                      >
                        Special Coverage
                      </Link>
                      <Link
                        href="#"
                        onClick={onClose}
                        className="text-base hover:text-primary transition-colors font-sans"
                      >
                        Documentary Series
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600 font-sans">
                  Company
                </h3>
                <nav className="flex flex-col gap-3">
                  <Link
                    href="/company/terms-of-service"
                    onClick={onClose}
                    className="text-base hover:text-primary transition-colors font-sans"
                  >
                    Terms of Use
                  </Link>
                  <Link
                    href="/company/privacy-policy"
                    onClick={onClose}
                    className="text-base hover:text-primary transition-colors font-sans"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/company/advertise-with-us"
                    onClick={onClose}
                    className="text-base hover:text-primary transition-colors font-sans"
                  >
                    Advertise with us
                  </Link>
                  <Link
                    href="/company/contact"
                    onClick={onClose}
                    className="text-base hover:text-primary transition-colors font-sans"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          {/* Social */}
          <div
            className={`px-4 md:px-0 flex items-center gap-4 mt-10 mb-8 transition-all duration-700 ease-out ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isOpen ? "300ms" : "0ms" }}
          >
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-primary transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-primary transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-primary transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </a>
          </div>

          {/* Footer */}
          <div
            className={`px-4 md:px-0 text-xs text-muted-foreground space-y-2 transition-all duration-700 ease-out ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isOpen ? "400ms" : "0ms" }}
          >
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href="/company/privacy-policy"
                onClick={onClose}
                className="hover:text-foreground transition-colors font-sans"
              >
                Privacy Policy
              </Link>
              <Link
                href="/company/terms-of-service"
                onClick={onClose}
                className="hover:text-foreground transition-colors font-sans"
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
