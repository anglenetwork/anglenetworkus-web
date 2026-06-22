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
  menuColumns,
}: SiteShellFrameProps) {
  const footerTags = menuColumns.flatMap((column) =>
    column.categories.flatMap((category) => category.tags),
  );

  return (
    <div className="min-h-screen bg-white">
      <HeaderClient categories={categories} menuColumns={menuColumns} />
      {children}
      <Footer categories={categories} tags={footerTags} />
    </div>
  );
}
