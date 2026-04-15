import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "mx-auto w-full px-4 sm:px-6 lg:px-10",
        variant === "hub" ? "max-w-[1440px]" : "max-w-5xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
