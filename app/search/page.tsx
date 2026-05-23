import type { Metadata } from "next";
import { Suspense } from "react";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import SearchResults from "@/app/search/SearchResults";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import { buildSearchPageMetadata } from "@/app/lib/seo/metadata-builders";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const settings = await getCachedSettings();
  return buildSearchPageMetadata(sp, settings, demo.title);
}

export default function SearchPage() {
  return (
    <SitePageWidth className="py-8">
      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </SitePageWidth>
  );
}
