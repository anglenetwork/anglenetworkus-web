// /schemas/post.ts
import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      options: { layout: "tags" },
      description: "Public topical keywords (tag docs only).",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(4),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "string",
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "cover",
      title: "Cover",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({
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
        }),
        defineField({
          name: "externalUrl",
          title: "External image URL",
          type: "url",
          description:
            "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
          hidden: ({ parent }) => parent?.source !== "external",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "external") {
                if (!value) return "External image URL is required";
              }
              return true;
            }),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
          hidden: ({ parent }) => parent?.source !== "asset",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "asset") {
                if (!value?.asset?._ref) return "Select or upload an image";
              }
              return true;
            }),
        }),
        defineField({
          name: "alt",
          title: "Alt text (cover)",
          type: "string",
          description:
            "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
          validation: (rule) =>
            rule.custom((val, ctx) => {
              const parent = ctx.parent as any;
              const usingExternal = parent?.source === "external" && parent?.externalUrl;
              const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
              if (usingExternal && !val) return "Alt text is required for external images";
              const nestedAlt = parent?.image?.alt;
              if (usingAsset && !nestedAlt && !val) {
                return "Alt text is required (fill nested alt or this field)";
              }
              return true;
            }),
        }),
        defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
        defineField({ name: "imageSource", title: "Image Source / Credit", type: "string" }),
      ],
      validation: (rule) =>
        rule.custom((cover, ctx) => {
          const doc = ctx.document as any;
          const usingExternal = cover?.source === "external" && !!cover?.externalUrl;
          const usingAsset = cover?.source === "asset" && !!cover?.image?.asset?._ref;
          const isPublishing = doc?.status === "published";
          if (isPublishing && !(usingExternal || usingAsset)) {
            return "Provide a cover image (external URL or uploaded asset) before publishing";
          }
          return true;
        }),
      description:
        "Choose between an uploaded/selected image or a pasted external URL. Alt text is required for accessibility.",
    }),
    // Removed legacy top-level epigraph/imageSource (use cover.epigraph/imageSource)
    // Removed legacy top-level epigraph/imageSource (use cover.epigraph/imageSource)
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the post to show up in the preview",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "bodyTextOne", title: "Body Text One", type: "array", of: [{ type: "block" }], validation: (rule) => rule.required() }),
    defineField({
      name: "bodyImageOne",
      title: "Body Image One",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({
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
        }),
        defineField({
          name: "externalUrl",
          title: "External image URL",
          type: "url",
          description:
            "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
          hidden: ({ parent }) => parent?.source !== "external",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "external") {
                if (!value) return "External image URL is required";
              }
              return true;
            }),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
          hidden: ({ parent }) => parent?.source !== "asset",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "asset") {
                if (!value?.asset?._ref) return "Select or upload an image";
              }
              return true;
            }),
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
          validation: (rule) =>
            rule.custom((val, ctx) => {
              const parent = ctx.parent as any;
              const usingExternal = parent?.source === "external" && parent?.externalUrl;
              const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
              if (usingExternal && !val) return "Alt text is required for external images";
              const nestedAlt = parent?.image?.alt;
              if (usingAsset && !nestedAlt && !val) {
                return "Alt text is required (fill nested alt or this field)";
              }
              return true;
            }),
        }),
        defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
        defineField({ name: "imageSource", title: "Image Source / Credit", type: "string" }),
      ],
    }),
    defineField({ name: "bodyTextTwo", title: "Body Text Two", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "bodyImageTwo",
      title: "Body Image Two",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({
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
        }),
        defineField({
          name: "externalUrl",
          title: "External image URL",
          type: "url",
          description:
            "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
          hidden: ({ parent }) => parent?.source !== "external",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "external") {
                if (!value) return "External image URL is required";
              }
              return true;
            }),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
          hidden: ({ parent }) => parent?.source !== "asset",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "asset") {
                if (!value?.asset?._ref) return "Select or upload an image";
              }
              return true;
            }),
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
          validation: (rule) =>
            rule.custom((val, ctx) => {
              const parent = ctx.parent as any;
              const usingExternal = parent?.source === "external" && parent?.externalUrl;
              const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
              if (usingExternal && !val) return "Alt text is required for external images";
              const nestedAlt = parent?.image?.alt;
              if (usingAsset && !nestedAlt && !val) {
                return "Alt text is required (fill nested alt or this field)";
              }
              return true;
            }),
        }),
        defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
        defineField({ name: "imageSource", title: "Image Source / Credit", type: "string" }),
      ],
    }),
    defineField({ name: "bodyTextThree", title: "Body Text Three", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "bodyImageThree",
      title: "Body Image Three",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({
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
        }),
        defineField({
          name: "externalUrl",
          title: "External image URL",
          type: "url",
          description:
            "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
          hidden: ({ parent }) => parent?.source !== "external",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "external") {
                if (!value) return "External image URL is required";
              }
              return true;
            }),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
          hidden: ({ parent }) => parent?.source !== "asset",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "asset") {
                if (!value?.asset?._ref) return "Select or upload an image";
              }
              return true;
            }),
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
          validation: (rule) =>
            rule.custom((val, ctx) => {
              const parent = ctx.parent as any;
              const usingExternal = parent?.source === "external" && parent?.externalUrl;
              const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
              if (usingExternal && !val) return "Alt text is required for external images";
              const nestedAlt = parent?.image?.alt;
              if (usingAsset && !nestedAlt && !val) {
                return "Alt text is required (fill nested alt or this field)";
              }
              return true;
            }),
        }),
        defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
        defineField({ name: "imageSource", title: "Image Source / Credit", type: "string" }),
      ],
    }),
    defineField({ name: "bodyTextFour", title: "Body Text Four", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "bodyImageFour",
      title: "Body Image Four",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({
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
        }),
        defineField({
          name: "externalUrl",
          title: "External image URL",
          type: "url",
          description:
            "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
          hidden: ({ parent }) => parent?.source !== "external",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "external") {
                if (!value) return "External image URL is required";
              }
              return true;
            }),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
          hidden: ({ parent }) => parent?.source !== "asset",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "asset") {
                if (!value?.asset?._ref) return "Select or upload an image";
              }
              return true;
            }),
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
          validation: (rule) =>
            rule.custom((val, ctx) => {
              const parent = ctx.parent as any;
              const usingExternal = parent?.source === "external" && parent?.externalUrl;
              const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
              if (usingExternal && !val) return "Alt text is required for external images";
              const nestedAlt = parent?.image?.alt;
              if (usingAsset && !nestedAlt && !val) {
                return "Alt text is required (fill nested alt or this field)";
              }
              return true;
            }),
        }),
        defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
        defineField({ name: "imageSource", title: "Image Source / Credit", type: "string" }),
      ],
    }),
    defineField({ name: "bodyTextFive", title: "Body Text Five", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "bodyImageFive",
      title: "Body Image Five",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({
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
        }),
        defineField({
          name: "externalUrl",
          title: "External image URL",
          type: "url",
          description:
            "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
          hidden: ({ parent }) => parent?.source !== "external",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "external") {
                if (!value) return "External image URL is required";
              }
              return true;
            }),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
          hidden: ({ parent }) => parent?.source !== "asset",
          validation: (rule) =>
            rule.custom((value, ctx) => {
              const parent = ctx.parent as any;
              if (parent?.source === "asset") {
                if (!value?.asset?._ref) return "Select or upload an image";
              }
              return true;
            }),
        }),
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
          validation: (rule) =>
            rule.custom((val, ctx) => {
              const parent = ctx.parent as any;
              const usingExternal = parent?.source === "external" && parent?.externalUrl;
              const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
              if (usingExternal && !val) return "Alt text is required for external images";
              const nestedAlt = parent?.image?.alt;
              if (usingAsset && !nestedAlt && !val) {
                return "Alt text is required (fill nested alt or this field)";
              }
              return true;
            }),
        }),
        defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
        defineField({ name: "imageSource", title: "Image Source / Credit", type: "string" }),
      ],
    }),
    defineField({
      name: "bodyImages",
      title: "Body Images",
      type: "array",
      of: [
        {
          type: "object",
          name: "bodyImage",
          title: "Body Image",
          options: { collapsible: false },
          fields: [
            defineField({
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
            }),
            defineField({
              name: "externalUrl",
              title: "External image URL",
              type: "url",
              description:
                "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
              hidden: ({ parent }) => parent?.source !== "external",
              validation: (rule) =>
                rule.custom((value, ctx) => {
                  const parent = ctx.parent as any;
                  if (parent?.source === "external") {
                    if (!value) return "External image URL is required";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative text",
                  description: "Important for SEO and accessibility.",
                },
              ],
              hidden: ({ parent }) => parent?.source !== "asset",
              validation: (rule) =>
                rule.custom((value, ctx) => {
                  const parent = ctx.parent as any;
                  if (parent?.source === "asset") {
                    if (!value?.asset?._ref) return "Select or upload an image";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
              validation: (rule) =>
                rule.custom((val, ctx) => {
                  const parent = ctx.parent as any;
                  const usingExternal = parent?.source === "external" && parent?.externalUrl;
                  const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
                  if (usingExternal && !val) return "Alt text is required for external images";
                  const nestedAlt = parent?.image?.alt;
                  if (usingAsset && !nestedAlt && !val) {
                    return "Alt text is required (fill nested alt or this field)";
                  }
                  return true;
                }),
            }),
            defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
            defineField({ name: "imageSource", title: "Image Source / Credit", type: "string" }),
          ],
        },
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({ name: "date", title: "Date", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "status", title: "Status", type: "string", options: { list: ["draft", "scheduled", "published"] }, initialValue: "draft" }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime", description: 'Use for ordering/SEO. Keep "date" for legacy if needed.', initialValue: () => new Date().toISOString(), validation: (rule) => rule.custom((val, ctx) => (ctx.document as any)?.status === "published" && !val ? "publishedAt is required when status is published" : true) }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false, description: "Pin for homepage heroes/rails." }),
    defineField({ name: "priority", title: "Priority", type: "number", description: "Higher number surfaces earlier in curated rails.", validation: (rule) => rule.min(0).max(10) }),
    defineField({ name: "readTime", title: "Estimated read time (min)", type: "number" }),
    defineField({ name: "viewsAll", title: "Views (all time)", type: "number", initialValue: 0, readOnly: true }),
    defineField({ name: "views30d", title: "Views (30 days)", type: "number", initialValue: 0, readOnly: true }),
    defineField({ name: "views7d", title: "Views (7 days)", type: "number", initialValue: 0, readOnly: true }),
    defineField({ name: "labels", title: "Labels (internal)", type: "array", of: [{ type: "string" }], options: { layout: "tags", list: [{ title: "breaking", value: "breaking" }, { title: "analysis", value: "analysis" }, { title: "opinion", value: "opinion" }, { title: "exclusive", value: "exclusive" }, { title: "sponsored", value: "sponsored" }, { title: "live", value: "live" }] }, description: "Internal flags for curation/badges; not used for public search." }),
    defineField({ name: "bodyRich", title: "Body (rich, portable text)", type: "blockContent" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      mediaCoverAsset: "cover.image",
      featured: "featured",
      date: "publishedAt",
    },
    prepare(selection) {
      const { author, featured, date, mediaCoverAsset } = selection as any;
      const bits: string[] = [];
      if (author) bits.push(`by ${author}`);
      if (date) bits.push(new Date(date).toLocaleDateString());
      if (featured) bits.push("★ Featured");
      const media = mediaCoverAsset || undefined;
      return { ...selection, media, subtitle: bits.join(" • ") };
    },
  },
});

