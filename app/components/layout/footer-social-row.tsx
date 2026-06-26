import { Facebook, Instagram } from "lucide-react";
import { footerFollowLabel } from "@/app/lib/typography/footer";
import { siteSocialLinks } from "@/app/lib/site-social-links";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialIcons = {
  Facebook,
  X: XIcon,
  Instagram,
} as const;

export function FooterSocialRow() {
  return (
    <div className="flex justify-start pb-6 sm:justify-end">
      <div className="flex items-center gap-4">
        <span className={footerFollowLabel}>Follow Us On</span>
        <ul className="flex items-center gap-3">
          {siteSocialLinks.map((social) => {
            const Icon =
              socialIcons[social.label as keyof typeof socialIcons] ?? Facebook;

            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex text-white transition-opacity hover:opacity-80"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
