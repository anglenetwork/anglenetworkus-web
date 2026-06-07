import Link from "next/link";
import { Wordmark } from "./navbar/logo";
import {
  footerColumnHeading,
  footerCopyright,
  footerLegalLabel,
  footerLegalLink,
  footerNavLabel,
  footerNavLink,
} from "@/app/lib/typography/footer";
import type { Category, Tag } from "./site-shell/types";

interface FooterProps {
  categories: Category[];
  tags: Tag[];
}

export function Footer({ categories, tags }: FooterProps) {
  return (
    <footer className="mt-0 bg-neutral-950 py-12 font-sans text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="col-span-1">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <div className="mb-4">
                <Wordmark theme="dark" titleClassName="text-2xl" />
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h4 className={footerColumnHeading}>Sections</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/opinion" className={footerNavLink}>
                  Opinion
                </Link>
              </li>
              <li>
                <Link href="/analysis" className={footerNavLink}>
                  Analysis
                </Link>
              </li>
              <li>
                <Link href="/latest" className={footerNavLink}>
                  Latest
                </Link>
              </li>
              {categories.length > 0 ? (
                categories.slice(0, 5).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className={`${footerNavLink} capitalize`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <span className={footerNavLabel}>Congress</span>
                  </li>
                  <li>
                    <span className={footerNavLabel}>White House</span>
                  </li>
                  <li>
                    <span className={footerNavLabel}>Defense</span>
                  </li>
                  <li>
                    <span className={footerNavLabel}>Energy</span>
                  </li>
                  <li>
                    <span className={footerNavLabel}>Health Care</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Topics */}
          <div className="col-span-1">
            <h4 className={footerColumnHeading}>Topics</h4>
            <ul className="space-y-2">
              {tags.length > 0 ? (
                tags.slice(0, 5).map((tag) => (
                  <li key={tag.slug}>
                    <a
                      href={`/tag/${tag.slug}`}
                      className={`${footerNavLink} capitalize`}
                    >
                      {tag.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <span className={footerNavLabel}>POLITICO Pro</span>
                  </li>
                  <li>
                    <span className={footerNavLabel}>Playbook</span>
                  </li>
                  <li>
                    <span className={footerNavLabel}>Newsletters</span>
                  </li>
                  <li>
                    <span className={footerNavLabel}>Magazine</span>
                  </li>
                  <li>
                    <span className={footerNavLabel}>Events</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className={footerColumnHeading}>Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/company/terms-of-service"
                  className={footerNavLink}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/company/privacy-policy" className={footerNavLink}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/company/advertise-with-us"
                  className={footerNavLink}
                >
                  Partner with us
                </Link>
              </li>
              <li>
                <Link href="/company/contact" className={footerNavLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-gray-700 border-t pt-8 md:flex-row">
          <p className={footerCopyright}>
            © 2025 The Angle LLC. All rights reserved.
          </p>
          <div className="mt-4 flex gap-x-6 md:mt-0">
            <Link href="/company/privacy-policy" className={footerLegalLink}>
              Privacy
            </Link>
            <Link href="/company/terms-of-service" className={footerLegalLink}>
              Terms
            </Link>
            <span className={footerLegalLabel}>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
