import Link from "next/link";
import Image from "next/image";
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
              <div className="mb-4 flex items-center gap-2">
                <Image
                  src="/black-logo.svg"
                  alt="The Angle Logo"
                  width={48}
                  height={48}
                  className="shrink-0"
                  priority
                />
                <h3 className="font-bold font-sans text-4xl text-white tracking-tight">
                  The Angle
                </h3>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h4 className="mb-4 font-semibold text-red-600">Sections</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/opinion"
                  className="text-gray-300 hover:text-white"
                >
                  Opinion
                </Link>
              </li>
              <li>
                <Link
                  href="/analysis"
                  className="text-gray-300 hover:text-white"
                >
                  Analysis
                </Link>
              </li>
              <li>
                <Link href="/latest" className="text-gray-300 hover:text-white">
                  Latest
                </Link>
              </li>
              {categories.length > 0 ? (
                categories.slice(0, 5).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-gray-300 capitalize hover:text-white"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <span className="text-gray-300">Congress</span>
                  </li>
                  <li>
                    <span className="text-gray-300">White House</span>
                  </li>
                  <li>
                    <span className="text-gray-300">Defense</span>
                  </li>
                  <li>
                    <span className="text-gray-300">Energy</span>
                  </li>
                  <li>
                    <span className="text-gray-300">Health Care</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Topics */}
          <div className="col-span-1">
            <h4 className="mb-4 font-semibold text-red-600">Topics</h4>
            <ul className="space-y-2 text-sm">
              {tags.length > 0 ? (
                tags.slice(0, 5).map((tag) => (
                  <li key={tag.slug}>
                    <a
                      href={`/tag/${tag.slug}`}
                      className="text-gray-300 capitalize hover:text-white"
                    >
                      {tag.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <span className="text-gray-300">POLITICO Pro</span>
                  </li>
                  <li>
                    <span className="text-gray-300">Playbook</span>
                  </li>
                  <li>
                    <span className="text-gray-300">Newsletters</span>
                  </li>
                  <li>
                    <span className="text-gray-300">Magazine</span>
                  </li>
                  <li>
                    <span className="text-gray-300">Events</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="mb-4 font-semibold text-red-600">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/company/terms-of-service"
                  className="text-gray-300 hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/company/privacy-policy"
                  className="text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/company/advertise-with-us"
                  className="text-gray-300 hover:text-white"
                >
                  Partner with us
                </Link>
              </li>
              <li>
                <Link
                  href="/company/contact"
                  className="text-gray-300 hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-gray-700 border-t pt-8 md:flex-row">
          <p className="text-gray-400 text-sm">
            © 2025 The Angle LLC. All rights reserved.
          </p>
          <div className="mt-4 flex gap-x-6 md:mt-0">
            <Link
              href="/company/privacy-policy"
              className="text-gray-400 text-sm hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/company/terms-of-service"
              className="text-gray-400 text-sm hover:text-white"
            >
              Terms
            </Link>
            <span className="text-gray-400 text-sm">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
