import type { Metadata } from "next";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import SearchResults from "@/app/search/SearchResults";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import {
  buildSearchPageMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";
import { runEditorialSearch } from "@/app/lib/search/run-editorial-search";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const [sp, settings] = await Promise.all([searchParams, getCachedSettings()]);
  return finalizePublicMetadata(
    buildSearchPageMetadata(sp, settings, demo.title),
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  let payload = null;
  let error: string | null = null;

  if (q) {
    try {
      payload = await runEditorialSearch({
        q,
        sort: typeof sp.sort === "string" ? sp.sort : null,
        type: typeof sp.type === "string" ? sp.type : null,
        page:
          typeof sp.page === "string"
            ? sp.page
            : typeof sp.page === "number"
              ? sp.page
              : null,
      });
    } catch (err) {
      console.error("Search page error:", err);
      error = err instanceof Error ? err.message : "Search failed";
    }
  }

  return (
    <SitePageWidth className="py-8">
      <SearchResults payload={payload} error={error} />
    </SitePageWidth>
  );
}
