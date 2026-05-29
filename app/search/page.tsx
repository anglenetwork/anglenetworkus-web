import type { Metadata } from "next";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import SearchResults from "@/app/search/SearchResults";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import {
  buildSearchPageMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";

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

export default function SearchPage() {
  return (
    <SitePageWidth className="py-8">
      <SearchResults />
    </SitePageWidth>
  );
}
