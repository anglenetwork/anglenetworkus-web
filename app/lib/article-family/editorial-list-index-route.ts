import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import {
  buildOpinionIndexMetadata,
  buildSponsoredIndexMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";
import type { EditorialListIndexConfig } from "./editorial-list-index-config";

export type { EditorialListIndexConfig } from "./editorial-list-index-config";
export {
  OPINION_EDITORIAL_LIST_CONFIG,
  SPONSORED_EDITORIAL_LIST_CONFIG,
} from "./editorial-list-index-config";

const METADATA_BUILDERS = {
  opinion: buildOpinionIndexMetadata,
  sponsored: buildSponsoredIndexMetadata,
} as const;

export async function createEditorialListIndexMetadata(
  config: EditorialListIndexConfig,
): Promise<Metadata> {
  const [settings, totalRaw] = await Promise.all([
    getCachedSettings(),
    sanityFetch({
      query: config.countQuery,
    }),
  ]);
  const total = typeof totalRaw === "number" ? totalRaw : 0;
  return finalizePublicMetadata(
    METADATA_BUILDERS[config.family](1, total, settings, demo.title),
  );
}
