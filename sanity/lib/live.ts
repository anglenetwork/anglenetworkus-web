import "server-only";

import { defineLive } from "next-sanity/live";

import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/lib/token";

export const { sanityFetch: liveSanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken,
});
