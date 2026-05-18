import Link from "next/link";
import Image from "next/image";
import type { Category, Tag } from "./site-shell/types";

interface FooterProps {
  categories: Category[];
  tags: Tag[];
}

export function Footer({ categories, tags }: FooterProps) {
  return (
    <footer className="bg-black text-white py-12 mt-0 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity inline-block"
            >
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/black-logo.svg"
                  alt="The Angle Logo"
                  width={48}
                  height={48}
                  className="flex-shrink-0"
                />
                <h3 className="text-4xl font-bold text-white tracking-tight font-sans">
                  The Angle
                </h3>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h4 className="font-semibold text-red-600 mb-4">Sections</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/opinion" className="text-gray-300 hover:text-white">
                  Opinion
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="text-gray-300 hover:text-white">
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
                      className="text-gray-300 hover:text-white capitalize"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Congress
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      White House
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Defense
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Energy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Health Care
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Topics */}
          <div className="col-span-1">
            <h4 className="font-semibold text-red-600 mb-4">Topics</h4>
            <ul className="space-y-2 text-sm">
              {tags.length > 0 ? (
                tags.slice(0, 5).map((tag) => (
                  <li key={tag.slug}>
                    <a
                      href={`/tag/${tag.slug}`}
                      className="text-gray-300 hover:text-white capitalize"
                    >
                      {tag.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      POLITICO Pro
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Playbook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Newsletters
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Magazine
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Events
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="font-semibold text-red-600 mb-4">Company</h4>
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

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 The Angle LLC. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/company/privacy-policy"
              className="text-gray-400 hover:text-white text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/company/terms-of-service"
              className="text-gray-400 hover:text-white text-sm"
            >
              Terms
            </Link>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
