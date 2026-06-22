import { defineField, defineType } from "sanity";

import { extractTweetId, isTweetUrl } from "@/lib/tweets";

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
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional editor note displayed below the embed.",
    }),
  ],
  preview: {
    select: {
      url: "url",
    },
    prepare({ url }) {
      const idFromUrl =
        typeof url === "string" ? extractTweetId(url) : null;

      return {
        title: "Tweet/X Embed",
        subtitle: idFromUrl ? `${url} (ID: ${idFromUrl})` : url || "",
      };
    },
  },
});
