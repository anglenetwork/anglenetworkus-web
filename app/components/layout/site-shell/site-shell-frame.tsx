import type { ReactNode } from "react";
import { HeaderClient } from "../navbar/header-client";
import { Footer } from "../footer";
import type { SiteShellNav } from "./types";

interface SiteShellFrameProps extends SiteShellNav {
  children: ReactNode;
}

/**
 * Server shell: global header + footer. Client work is limited to HeaderClient.
 */
export function SiteShellFrame({
  children,
  categories,
  tags,
  showsTags,
}: SiteShellFrameProps) {
  return (
    <div className="min-h-screen bg-white">
      <HeaderClient categories={categories} tags={tags} showsTags={showsTags} />
      {children}
      <Footer categories={categories} tags={tags} />
    </div>
  );
}
