import type { ReactNode } from "react";
import { HeaderClient } from "../navbar/header-client";
import { Footer } from "../footer";
import { isSubscriptionVisible } from "@/lib/subscriptions/is-subscription-visible";
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
  const showSubscriptions = isSubscriptionVisible();

  return (
    <div className="min-h-screen bg-white">
      <HeaderClient
        categories={categories}
        menuColumns={menuColumns}
        showSubscriptions={showSubscriptions}
      />
      {children}
      <Footer menuColumns={menuColumns} />
    </div>
  );
}
