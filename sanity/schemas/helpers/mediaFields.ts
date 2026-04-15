import { defineField } from "sanity";

type ValidationContext = {
  parent?: {
    source?: "asset" | "external";
  };
};

export const imageSourceField = defineField({
  name: "source",
  title: "Source",
  type: "string",
  options: {
    list: [
      { title: "Upload / Asset", value: "asset" },
      { title: "External URL", value: "external" },
    ],
    layout: "radio",
    direction: "horizontal",
  },
  initialValue: "asset",
  validation: (rule) => rule.required(),
});

export const externalUrlField = defineField({
  name: "externalUrl",
  title: "External image URL",
  type: "url",
  description: "Paste a direct image URL (http/https).",
  hidden: ({ parent }: ValidationContext) => parent?.source !== "external",
  validation: (rule) =>
    rule.custom((value, ctx) => {
      const parent = ctx.parent as ValidationContext["parent"];
      if (parent?.source === "external" && !value) {
        return "External image URL is required when source is external.";
      }
      return true;
    }),
});

export const imageAssetField = defineField({
  name: "image",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  hidden: ({ parent }: ValidationContext) => parent?.source !== "asset",
  validation: (rule) =>
    rule.custom((value, ctx) => {
      const parent = ctx.parent as ValidationContext["parent"];
      if (parent?.source === "asset" && !(value as any)?.asset?._ref) {
        return "Select or upload an image when source is asset.";
      }
      return true;
    }),
});

export const mediaAltField = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe the image for accessibility and SEO.",
  validation: (rule) => rule.required(),
});

export const mediaCaptionAndCreditFields = [
  defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
  defineField({ name: "creditProvider", title: "Credit Provider", type: "string" }),
  defineField({ name: "creditAuthor", title: "Credit Author", type: "string" }),
  defineField({ name: "creditSourceUrl", title: "Credit Source URL", type: "url" }),
  defineField({ name: "creditLicense", title: "Credit License", type: "string" }),
];
