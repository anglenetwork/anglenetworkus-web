import type { ReactNode } from "react";
import { Suspense } from "react";
import { HeaderClient } from "../navbar/header-client";
import { LiveUpdatesTicker } from "../live-updates-ticker";
import { LiveUpdatesTickerFallback } from "../live-updates-ticker-fallback";
import { Footer } from "../footer";
import { isSubscriptionVisible } from "@/lib/subscriptions/is-subscription-visible";
import { DeferredLiveUpdatesTicker } from "./deferred-live-updates-ticker";
import { DeferredShellFooter } from "./deferred-shell-footer";
import { MenuCategoriesProvider } from "./menu-categories-provider";
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

  const footer = isHomepage ? (
    <Suspense fallback={null}>
      <DeferredShellFooter categories={categories} />
    </Suspense>
  ) : (
    <Footer menuCategories={menuCategories} />
  );

  const shell = (
    <>
      <HeaderClient
        categories={categories}
        menuCategories={menuCategories}
        showSubscriptions={showSubscriptions}
      />
      {ticker}
      {children}
      {footer}
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      {isHomepage ? (
        <MenuCategoriesProvider initialMenuCategories={menuCategories}>
          {shell}
        </MenuCategoriesProvider>
      ) : (
        shell
      )}
    </div>
  );
}
