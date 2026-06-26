import type { Metadata } from "next";
import {
  createEditorialListIndexMetadata,
  SPONSORED_EDITORIAL_LIST_CONFIG,
} from "@/app/lib/article-family/editorial-list-index-route";
import { EditorialListIndexPageView } from "@/app/lib/article-family/editorial-list-index-page-view";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return createEditorialListIndexMetadata(SPONSORED_EDITORIAL_LIST_CONFIG);
}

export default async function SponsoredIndexPage() {
  return EditorialListIndexPageView({
    config: SPONSORED_EDITORIAL_LIST_CONFIG,
  });
}
