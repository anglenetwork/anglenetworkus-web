import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode } from "next/headers";

import { authenticatedClient } from "@/sanity/lib/authenticated-client";
import { liveSanityFetch, SanityLive } from "@/sanity/lib/live";

export { SanityLive };

/**
 * Fetch Sanity content in Server Components with live cache tags and draft-mode support.
 * Returns query data directly; use `liveSanityFetch` from `./live` when you need tags or source maps.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  perspective,
  stega,
  tags,
  requestTag,
}: {
  query: QueryString;
  params?: QueryParams | Promise<QueryParams>;
  perspective?: Exclude<ClientPerspective, "raw">;
  stega?: boolean;
  tags?: string[];
  requestTag?: string;
}) {
  const resolvedParams = await params;
  const { isEnabled: isPreview } = await draftMode();
  const useLivePreview =
    isPreview || perspective === "drafts" || perspective === "previewDrafts";

  if (useLivePreview) {
    const { data } = await liveSanityFetch({
      query,
      params: resolvedParams,
      perspective: perspective ?? "drafts",
      stega,
      tags,
      requestTag,
    });
    return data;
  }

  return authenticatedClient.fetch(query, resolvedParams, {
    perspective: perspective ?? "published",
    stega: stega ?? false,
    ...(requestTag ? { tag: requestTag } : {}),
  });
}

/**
 * Fetch published content for static generation (generateStaticParams, etc.).
 * Always uses the published perspective without stega encoding.
 */
export async function sanityFetchStatic<const QueryString extends string>({
  query,
  params = {},
  tag,
  requestTag,
}: {
  query: QueryString;
  params?: QueryParams | Promise<QueryParams>;
  /** @deprecated Use `requestTag` — Sanity request-log label, not a Next.js cache tag. */
  tag?: string;
  requestTag?: string;
}) {
  const resolvedParams = await params;
  return authenticatedClient.fetch(query, resolvedParams, {
    perspective: "published",
    stega: false,
    ...(requestTag ?? tag ? { tag: requestTag ?? tag } : {}),
  });
}
