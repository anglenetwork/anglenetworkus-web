import type { ReactNode } from "react";
import { HeaderClient } from "../navbar/header-client";
import { LiveUpdatesTicker } from "../live-updates-ticker";
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
  menuCategories,
  tickerPosts,
}: SiteShellFrameProps) {
  const showSubscriptions = isSubscriptionVisible();

  return (
    <div className="min-h-screen bg-white">
      <HeaderClient
        categories={categories}
        menuCategories={menuCategories}
        showSubscriptions={showSubscriptions}
      />
      <LiveUpdatesTicker posts={tickerPosts} />
      {children}
      <Footer menuCategories={menuCategories} />
    </div>
  );
}
