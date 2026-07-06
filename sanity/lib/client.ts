import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { readToken } from "@/sanity/lib/token";

/** Published reads — Sanity CDN edge cache. */
export const publishedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: readToken,
  perspective: "published",
  stega: false,
});

/** Preview / live — fresh API for draft mode and SanityLive. */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: readToken,
  perspective: "published",
  stega: {
    studioUrl,
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === "title") {
        return true;
      }

      return props.filterDefault(props);
    },
  },
});
