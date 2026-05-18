"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { HeaderClient } from "../navbar";
import { Footer } from "../footer";
import type { SiteShellNav } from "./types";

interface SiteShellFrameProps extends SiteShellNav {
  children: ReactNode;
}

/**
 * Client half of the site shell. Wraps page content with the global header
 * and footer, hiding them on `/studio` routes so the Sanity Studio embed
 * renders without app chrome.
 */
export function SiteShellFrame({
  children,
  categories,
  tags,
  showsTags,
}: SiteShellFrameProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith("/studio");

  return (
    <div className="min-h-screen bg-white">
      {!isStudioRoute && (
        <HeaderClient
          categories={categories}
          tags={tags}
          showsTags={showsTags}
        />
      )}
      {children}
      {!isStudioRoute && <Footer categories={categories} tags={tags} />}
    </div>
  );
}
