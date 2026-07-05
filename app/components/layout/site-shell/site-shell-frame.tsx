import type { ReactNode } from "react";
import { Suspense } from "react";
import { HeaderClient } from "../navbar/header-client";
import { LiveUpdatesTicker } from "../live-updates-ticker";
import { LiveUpdatesTickerFallback } from "../live-updates-ticker-fallback";
import { Footer } from "../footer";
import { isSubscriptionVisible } from "@/lib/subscriptions/is-subscription-visible";
import { DeferredLiveUpdatesTicker } from "./deferred-live-updates-ticker";
import type { SiteShellNav } from "./types";

interface SiteShellFrameProps extends SiteShellNav {
  children: ReactNode;
  isHomepage?: boolean;
}

/**
 * Server shell: global header + footer. Client work is limited to HeaderClient.
 */
export function SiteShellFrame({
  children,
  categories,
  menuCategories,
  tickerPosts,
  isHomepage = false,
}: SiteShellFrameProps) {
  const showSubscriptions = isSubscriptionVisible();

  const ticker = isHomepage ? (
    <Suspense fallback={<LiveUpdatesTickerFallback />}>
      <DeferredLiveUpdatesTicker />
    </Suspense>
  ) : (
    <LiveUpdatesTicker posts={tickerPosts ?? []} />
  );

  return (
    <div className="min-h-screen bg-white">
      <HeaderClient
        categories={categories}
        menuCategories={menuCategories}
        showSubscriptions={showSubscriptions}
      />
      {ticker}
      {children}
      <Footer menuCategories={menuCategories} />
    </div>
  );
}
