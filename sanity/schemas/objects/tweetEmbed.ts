import { defineField, defineType } from "sanity";

import { extractTweetId, isTweetUrl } from "@/lib/tweets";

const NUMERIC_TWEET_ID = /^\d+$/;

export default defineType({
  name: "tweetEmbed",
  title: "Tweet/X Embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Tweet URL",
      type: "url",
      description: "Paste a Twitter/X post URL.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https"] })
          .custom((value) => {
            if (!value || typeof value !== "string") return true;
            if (!isTweetUrl(value)) {
              return "Must be a valid Twitter/X status URL (twitter.com or x.com …/status/{id}).";
            }
            return true;
          }),
    }),
    defineField({
      name: "tweetId",
      title: "Tweet ID",
      type: "string",
      description: "Numeric Tweet/X status ID.",
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (!value || typeof value !== "string") {
              return "Tweet ID is required.";
            }
            if (!NUMERIC_TWEET_ID.test(value)) {
              return "Tweet ID must contain digits only.";
            }
            return true;
          }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional editor note displayed below the embed.",
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value || typeof value !== "object") return true;

      const { url, tweetId } = value as { url?: string; tweetId?: string };
      if (!url || !tweetId) return true;

      const idFromUrl = extractTweetId(url);
      if (idFromUrl && idFromUrl !== tweetId) {
        return "Tweet ID must match the numeric ID in the URL.";
      }

      return true;
    }),
  preview: {
    select: {
      url: "url",
      tweetId: "tweetId",
    },
    prepare({ url, tweetId }) {
      return {
        title: "Tweet/X Embed",
        subtitle: url || tweetId || "",
      };
    },
  },
});
