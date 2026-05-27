import { defineField } from "sanity";

type ValidationContext = {
  parent?: {
    source?: "asset" | "external";
    externalUrl?: string;
    image?: { asset?: { _ref?: string } };
    creditAuthor?: string;
    creditSource?: string;
    licenseOrRights?: string;
  };
};

type ImageMediaParent = ValidationContext["parent"];

export function hasImageMedia(parent: ImageMediaParent | undefined): boolean {
  if (!parent) return false;
  if (parent.source === "external" && parent.externalUrl) return true;
  if (parent.source === "asset" && parent.image?.asset?._ref) return true;
  return false;
}

export function validateImageAttribution(
  parent: ImageMediaParent | undefined,
): true | string {
  if (!hasImageMedia(parent)) return true;

  if (!parent?.licenseOrRights?.trim()) {
    return "License / rights is required when an image is provided.";
  }

  const hasAuthor = Boolean(parent?.creditAuthor?.trim());
  const hasSource = Boolean(parent?.creditSource?.trim());
  if (!hasAuthor && !hasSource) {
    return "Credit author or credit source is required when an image is provided.";
  }

  return true;
}

// Sanity object-level validation helper; Rule type is not exported for reuse.
export const imageAttributionValidation = (
  rule: Parameters<
    NonNullable<import("sanity").ObjectDefinition["validation"]>
  >[0],
) =>
  rule.custom((_, context) =>
    validateImageAttribution(context.parent as ImageMediaParent),
  );

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
      if (
        parent?.source === "asset" &&
        !(value as { asset?: { _ref?: string } })?.asset?._ref
      ) {
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
  defineField({
    name: "caption",
    title: "Caption",
    type: "string",
    description: "Visible image caption shown below the image.",
  }),
  defineField({
    name: "creditAuthor",
    title: "Credit author",
    type: "string",
    description:
      "Creator/photographer name. Example: Jane Doe, Evan Vucci, Staff.",
  }),
  defineField({
    name: "creditSource",
    title: "Credit source",
    type: "string",
    description:
      "Provider, agency, or platform. Example: AP, AFP/Getty Images, Unsplash, Company Press Kit.",
  }),
  defineField({
    name: "licenseOrRights",
    title: "License / rights",
    type: "string",
    description:
      "Internal rights note. Example: Licensed via Getty, Unsplash License, Staff-owned, Creative Commons BY 4.0.",
  }),
];
