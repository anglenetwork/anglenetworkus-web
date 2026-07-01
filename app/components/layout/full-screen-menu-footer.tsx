"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullScreenMenuFooterProps {
  visible: boolean;
  onClose: () => void;
}

export function FullScreenMenuFooter({
  visible,
  onClose,
}: FullScreenMenuFooterProps) {
  return (
    <>
      <div
        className={cn(
          "flex items-center gap-4 p-4 transition-all duration-700 ease-out sm:px-6 lg:px-16 xl:px-0",
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
        style={{ transitionDelay: visible ? "300ms" : "0ms" }}
      >
        <span
          aria-label="Facebook"
          className="transition-colors hover:text-primary"
        >
          <Facebook className="size-6" />
        </span>
        <span
          aria-label="Twitter"
          className="transition-colors hover:text-primary"
        >
          <Twitter className="size-6" />
        </span>
        <span
          aria-label="Instagram"
          className="transition-colors hover:text-primary"
        >
          <Instagram className="size-6" />
        </span>
        <span
          aria-label="YouTube"
          className="transition-colors hover:text-primary"
        >
          <Youtube className="size-6" />
        </span>
      </div>

      <div
        className={cn(
          "space-y-2 px-4 pb-4 text-muted-foreground text-xs transition-all duration-700 ease-out sm:px-6 sm:pb-6 lg:px-16 lg:pb-16 xl:px-0 xl:pb-8",
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
        style={{ transitionDelay: visible ? "400ms" : "0ms" }}
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
    </>
  );
}
