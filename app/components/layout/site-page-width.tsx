import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared hub shell — category, post, home, tag, and site chrome. */
export const SITE_PAGE_WIDTH_HUB_CLASS =
  "mx-auto w-full px-4 sm:px-6 container lg:px-16";

type SitePageWidthProps = {
  children: ReactNode;
  className?: string;
  /**
   * hub — main site grid (home, article shell, category, tag).
   * narrow — long-form listings (e.g. opinion/analysis index).
   */
  variant?: "hub" | "narrow";
};

export function SitePageWidth({
  children,
  className,
  variant = "hub",
}: SitePageWidthProps) {
  return (
    <div
      className={cn(
        variant === "hub"
          ? SITE_PAGE_WIDTH_HUB_CLASS
          : "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
