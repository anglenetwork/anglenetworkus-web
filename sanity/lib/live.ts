import "server-only";

import { defineLive } from "next-sanity/live";

import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

export const { sanityFetch: liveSanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
