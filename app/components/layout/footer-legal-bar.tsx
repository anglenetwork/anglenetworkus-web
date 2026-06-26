import Link from "next/link";
import {
  footerCopyright,
  footerLegalLabel,
  footerLegalLink,
} from "@/app/lib/typography/footer";

const footerLegalItems = [
  { label: "Terms of Use", href: "/company/terms-of-service" },
  { label: "Privacy Policy", href: "/company/privacy-policy" },
  { label: "Manage Cookies", href: null },
  { label: "Partner with us", href: "/company/advertise-with-us" },
  { label: "Contact", href: "/company/contact" },
] as const;

export function FooterLegalBar() {
  return (
    <div className="border-[#333333] border-t pt-5">
      <nav
        aria-label="Legal and site information"
        className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8"
      >
        {footerLegalItems.map((item) =>
          item.href ? (
            <Link key={item.label} href={item.href} className={footerLegalLink}>
              {item.label}
            </Link>
          ) : (
            <span key={item.label} className={footerLegalLabel}>
              {item.label}
            </span>
          ),
        )}
      </nav>
      <p className={footerCopyright}>
        © 2025 The Angle LLC. All rights reserved.
      </p>
    </div>
  );
}
