import Link from "next/link";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "./navbar/logo";
import { SITE_PAGE_WIDTH_HUB_CLASS } from "@/app/components/layout/site-page-width";
import { FooterCategoriesGrid } from "./footer-categories-grid";
import { FooterLegalBar } from "./footer-legal-bar";
import { FooterSocialRow } from "./footer-social-row";
import { footerTopNavLink } from "@/app/lib/typography/footer";
import { footerTopNavLinks } from "@/app/lib/site-social-links";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";

interface FooterProps {
  menuCategories: NavMenuCategory[];
}

export function Footer({ menuCategories }: FooterProps) {
  return (
    <footer className="mt-0 bg-black font-sans text-white">
      <div className={cn(SITE_PAGE_WIDTH_HUB_CLASS, "py-10")}>
        {/* Row 1 — logo + utility nav (CNN top bar) */}
        <div className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-block transition-opacity hover:opacity-80"
          >
            <Wordmark theme="dark" titleClassName="text-[2rem] leading-none" />
          </Link>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerTopNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={footerTopNavLink}
              >
                {item.label}
              </Link>
            ))}
            <span
              aria-hidden="true"
              className="hidden h-4 w-px bg-[#555555] sm:block"
            />
            <Link
              href="/signin"
              aria-label="Account"
              className="inline-flex text-white transition-opacity hover:opacity-80"
            >
              <User className="size-5 stroke-[1.5]" />
            </Link>
          </div>
        </div>

        <FooterCategoriesGrid menuCategories={menuCategories} />

        {/* Row 2 — follow + social icons (CNN social row) */}
        <FooterSocialRow />

        {/* Row 3 — legal links + copyright */}
        <FooterLegalBar />
      </div>
    </footer>
  );
}
