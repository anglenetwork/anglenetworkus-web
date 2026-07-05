import "server-only";

import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { newsTickerQuery } from "@/sanity/lib/queries";
import { LiveUpdatesTicker } from "../live-updates-ticker";
import { mapTickerPosts } from "./map-ticker-posts";

export async function DeferredLiveUpdatesTicker() {
  const tickerData = await sanityFetchStatic({ query: newsTickerQuery });
  return <LiveUpdatesTicker posts={mapTickerPosts(tickerData)} />;
}
