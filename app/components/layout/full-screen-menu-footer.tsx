"use client";

import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  menuCopyright,
  menuLegalLink,
  xlMenuCopyright,
  xlMenuLegalLink,
} from "@/app/lib/typography/full-screen-menu";
import { siteSocialLinks } from "@/app/lib/site-social-links";
import {
  MenuActionLinks,
  MenuStackedFooterLinks,
} from "./full-screen-menu-parts";

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

interface FullScreenMenuFooterProps {
  onClose: () => void;
}

function MenuSocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {siteSocialLinks.map((social) => {
        const Icon =
          socialIcons[social.label as keyof typeof socialIcons] ?? Facebook;

        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="inline-flex rounded-lg p-1.5 text-foreground transition-[background,color] duration-150 hover:bg-news-primary/10 hover:text-news-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-2"
          >
            <Icon className="size-5" />
          </a>
        );
      })}
    </div>
  );
}

export function FullScreenMenuFooter({ onClose }: FullScreenMenuFooterProps) {
  return (
    <div className="mt-6 pt-0 xl:mt-14 xl:border-border xl:border-t xl:pt-6">
      <MenuActionLinks
        onClose={onClose}
        variant="xl"
        className="mb-5 hidden xl:flex"
      />

      <div className="xl:hidden">
        <MenuStackedFooterLinks onClose={onClose} />

        <div className="mt-3 flex flex-col items-start gap-4">
          <MenuSocialLinks />

          <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2">
            <Link
              href="/company/privacy-policy"
              onClick={onClose}
              className={menuLegalLink}
            >
              Privacy Policy
            </Link>
            <Link
              href="/company/terms-of-service"
              onClick={onClose}
              className={menuLegalLink}
            >
              Terms of Use
            </Link>
            <span className={menuCopyright}>
              © 2026 News. All rights reserved.
            </span>
          </div>
        </div>
      </div>

      <div className="hidden flex-wrap items-center justify-between gap-4 xl:flex">
        <MenuSocialLinks />
        <div className="flex flex-wrap items-center gap-[18px]">
          <Link
            href="/company/privacy-policy"
            onClick={onClose}
            className={xlMenuLegalLink}
          >
            Privacy Policy
          </Link>
          <Link
            href="/company/terms-of-service"
            onClick={onClose}
            className={xlMenuLegalLink}
          >
            Terms of Use
          </Link>
          <span className={xlMenuCopyright}>
            © 2026 News. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
