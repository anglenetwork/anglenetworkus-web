"use client";

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { SearchBar } from "../ui/search-bar";
import Link from "next/link";
import { useEffect } from "react";

interface Category {
  slug: string;
  name: string;
}

interface FullScreenMenuProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  headerOffset: number; // <— new prop: pixels to pad from top
}

export function FullScreenMenu({
  isOpen,
  categories,
  onClose,
  headerOffset,
}: FullScreenMenuProps) {
  // ESC + body scroll lock
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
    >
      {/* Only this area can scroll; top padding = current header height */}
      <div
        className="h-full max-h-[100svh] overflow-y-auto overscroll-contain"
        style={{ paddingTop: `${headerOffset || 0}px` }}
      >
        <div className="container mx-auto md:py-6">
          {/* Shared wrapper: search + nav same horizontal padding */}
          <div
            className={`px-4 md:px-0 space-y-10 md:space-y-12 transition-all duration-700 ease-out ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: isOpen ? "150ms" : "0ms" }}
          >
            {/* Search */}
            <SearchBar
              placeholder="Search any topic on BI"
              ariaLabel="BI search"
              onClose={onClose}
            />

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
                        className="text-3xl font-bold hover:text-primary transition-colors capitalize font-outfit"
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
                  <Link
                    href="#"
                    className="text-2xl font-bold hover:text-primary transition-colors font-outfit"
                  >
                    Video
                  </Link>
                  <Link
                    href="#"
                    className="text-2xl font-bold hover:text-primary transition-colors font-outfit"
                  >
                    Shop
                  </Link>
                  <Link
                    href="#"
                    className="text-2xl font-bold hover:text-primary transition-colors font-outfit"
                  >
                    Health
                  </Link>
                  <Link
                    href="#"
                    className="text-2xl font-bold hover:text-primary transition-colors font-outfit"
                  >
                    Weather
                  </Link>
                  <Link
                    href="#"
                    className="text-2xl font-bold hover:text-primary transition-colors font-outfit"
                  >
                    Sports
                  </Link>
                </nav>
              </div>

              {/* Shows */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground font-outfit">
                  Shows
                </h3>
                <nav className="flex flex-col gap-3">
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Morning News
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Evening Report
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Weekend Edition
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Investigative Reports
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Special Coverage
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Documentary Series
                  </Link>
                </nav>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground font-outfit">
                  Company
                </h3>
                <nav className="flex flex-col gap-3">
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Advertise with Us
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Share Tips with News
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    News App
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    News Store
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Authors List
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Press Releases
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Feedback
                  </Link>
                  <Link
                    href="#"
                    className="text-base hover:text-primary transition-colors font-outfit"
                  >
                    Site Map
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
              <a
                href="#"
                className="hover:text-foreground transition-colors font-outfit"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors font-outfit"
              >
                Terms of Use
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors font-outfit"
              >
                Do Not Sell My Personal Information
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors font-outfit"
              >
                Children&apos;s Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors font-outfit"
              >
                Your Privacy Rights
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors font-outfit"
              >
                Interest-Based Ads
              </a>
            </div>
            <p className="font-outfit">© 2025 News. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
