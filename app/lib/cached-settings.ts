import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

export const getCachedSettings = cache(async () =>
  sanityFetch({
    query: settingsQuery,
    stega: false,
  }),
);
