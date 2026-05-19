"use client";
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from "@sanity/vision";
import { PluginOptions, defineConfig } from "sanity";
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { singletonPlugin } from "@/sanity/plugins/settings";
import { editorialDeskStructure } from "@/sanity/structure/editorialDesk";
import { assistWithPresets } from "@/sanity/plugins/assist";
import author from "@/sanity/schemas/documents/author";
import category from "@/sanity/schemas/documents/category";
import analysis from "@/sanity/schemas/documents/analysis";
import opinion from "@/sanity/schemas/documents/opinion";
import post from "@/sanity/schemas/documents/post";
import sponsored from "@/sanity/schemas/documents/sponsored";
import settings from "@/sanity/schemas/singletons/settings";
import tag from "@/sanity/schemas/documents/tag";
import topic from "@/sanity/schemas/documents/topic";
import blockContent from "@/sanity/schemas/objects/blockContent";
import editorialImage from "@/sanity/schemas/objects/editorialImage";
import pullQuote from "@/sanity/schemas/objects/pullQuote";
import articleDivider from "@/sanity/schemas/objects/articleDivider";
import videoEmbed from "@/sanity/schemas/objects/videoEmbed";
import coverMedia from "@/sanity/schemas/objects/coverMedia";
import galleryImageItem from "@/sanity/schemas/objects/galleryImageItem";
import seo from "@/sanity/schemas/objects/seo";
import sponsorAttribution from "@/sanity/schemas/objects/sponsorAttribution";
import { resolveHref } from "@/sanity/lib/utils";

const homeLocation = {
  title: "Home",
  href: "/",
} satisfies DocumentLocation;

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [
      // Singletons
      settings,
      // Documents
      post,
      opinion,
      analysis,
      sponsored,
      author,
      category,
      tag,
      topic,
      // Objects
      blockContent,
      editorialImage,
      coverMedia,
      galleryImageItem,
      pullQuote,
      articleDivider,
      videoEmbed,
      seo,
      sponsorAttribution,
    ],
  },
  plugins: [
    presentationTool({
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: "/post/:slug",
            filter: `_type == "post" && slug.current == $slug`,
          },
          {
            route: "/opinion/:slug",
            filter: `_type == "opinion" && slug.current == $slug`,
          },
          {
            route: "/analysis/:slug",
            filter: `_type == "analysis" && slug.current == $slug`,
          },
          {
            route: "/sponsored/:slug",
            filter: `_type == "sponsored" && slug.current == $slug`,
          },
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: "This document is used on all pages",
            tone: "caution",
          }),
          post: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => {
              const postHref = resolveHref("post", doc?.slug);
              if (!postHref) {
                return {
                  locations: [homeLocation],
                };
              }

              return {
                locations: [
                  {
                    title: doc?.title || "Untitled",
                    href: postHref,
                  },
                  homeLocation,
                ],
              };
            },
          }),
          opinion: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => {
              const opinionHref = resolveHref("opinion", doc?.slug);
              if (!opinionHref) {
                return {
                  locations: [homeLocation],
                };
              }
              return {
                locations: [
                  {
                    title: doc?.title || "Untitled",
                    href: opinionHref,
                  },
                  homeLocation,
                ],
              };
            },
          }),
          analysis: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => {
              const analysisHref = resolveHref("analysis", doc?.slug);
              if (!analysisHref) {
                return {
                  locations: [homeLocation],
                };
              }
              return {
                locations: [
                  {
                    title: doc?.title || "Untitled",
                    href: analysisHref,
                  },
                  homeLocation,
                ],
              };
            },
          }),
          sponsored: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => {
              const sponsoredHref = resolveHref("sponsored", doc?.slug);
              if (!sponsoredHref) {
                return {
                  locations: [homeLocation],
                };
              }
              return {
                locations: [
                  {
                    title: doc?.title || "Untitled",
                    href: sponsoredHref,
                  },
                  homeLocation,
                ],
              };
            },
          }),
        },
      },
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_PREVIEW_URL ||
          process.env.NEXT_PUBLIC_SITE_URL ||
          "http://localhost:3000",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    structureTool({ structure: editorialDeskStructure }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Sets up AI Assist with preset prompts
    // https://www.sanity.io/docs/ai-assist
    assistWithPresets(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    process.env.NODE_ENV === "development" &&
      visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
});
