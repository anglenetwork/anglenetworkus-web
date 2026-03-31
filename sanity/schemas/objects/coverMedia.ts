import { defineField, defineType } from "sanity";
import {
  externalUrlField,
  imageAssetField,
  imageSourceField,
  mediaCaptionAndCreditFields,
} from "../helpers/mediaFields";

export default defineType({
  name: "coverMedia",
  title: "Cover Media",
  type: "object",
  fields: [
    imageSourceField,
    externalUrlField,
    imageAssetField,
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Required for published articles: describe the image accurately (who/what/where, meaningful text, and context). Used by screen readers and SEO.",
    }),
    ...mediaCaptionAndCreditFields,
  ],
  preview: {
    select: {
      source: "source",
      media: "image",
      epigraph: "epigraph",
      alt: "alt",
    },
    prepare({ source, media, epigraph, alt }: any) {
      return {
        title: epigraph || alt || "Cover image",
        subtitle: source === "external" ? "External image" : "Uploaded asset",
        media,
      };
    },
  },
});
