import { defineField, defineType } from "sanity";
import {
  externalUrlField,
  imageAssetField,
  imageAttributionValidation,
  imageSourceField,
  mediaAltField,
  mediaCaptionAndCreditFields,
} from "../helpers/mediaFields";

export default defineType({
  name: "editorialImage",
  title: "Editorial Image",
  type: "object",
  validation: imageAttributionValidation,
  fields: [
    imageSourceField,
    externalUrlField,
    imageAssetField,
    mediaAltField,
    ...mediaCaptionAndCreditFields,
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      initialValue: "inline",
      options: {
        list: [
          { title: "Inline", value: "inline" },
          { title: "Wide", value: "wide" },
          { title: "Full", value: "full" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      source: "source",
      media: "image",
      caption: "caption",
      alt: "alt",
    },
    prepare({ source, media, caption, alt }: any) {
      return {
        title: caption || alt || "Editorial Image",
        subtitle: source === "external" ? "External image" : "Uploaded asset",
        media,
      };
    },
  },
});
