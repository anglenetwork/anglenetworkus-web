import { defineField, type FieldDefinition } from "sanity";

import { isUniqueSlugByType } from "@/sanity/lib/isUniqueSlug";

/** Desk / schema field group names (shared across article-family types). */
export const ARTICLE_FIELD_GROUPS = {
  core: "core",
  typeSpecific: "typeSpecific",
  taxonomy: "taxonomy",
  media: "media",
  body: "body",
  publishing: "publishing",
  seo: "seo",
  legacy: "legacy",
} as const;

export function withFieldGroup(
  fields: FieldDefinition[],
  group: string,
): FieldDefinition[] {
  return fields.map((field) =>
    defineField({ ...field, group } as FieldDefinition),
  );
}

export const articleCoreMetadataFields = [
  defineField({
    name: "title",
    title: "Title",
    type: "string",
    validation: (rule) => rule.required().min(4),
  }),
  defineField({
    name: "tickerTitle",
    title: "Ticker title (short)",
    type: "string",
    description:
      "Very short version for the top news ticker (max 40 characters).",
    validation: (rule) => rule.required().max(40),
  }),
  defineField({
    name: "excerpt",
    title: "Excerpt",
    type: "string",
    description:
      "Short dek or subhead for cards, listings, and SEO snippets. Aim for a clear hook (max 280 characters).",
    validation: (rule) => rule.max(280),
  }),
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    description: "A slug is required for the article to show up in previews.",
    options: {
      source: "title",
      maxLength: 96,
      isUnique: isUniqueSlugByType,
    },
    validation: (rule) => rule.required(),
  }),
];

export const articleCoverGalleryFields = [
  defineField({
    name: "cover",
    title: "Cover",
    type: "coverMedia",
    description:
      "Hero media for this article. Cover alt text is required for accessibility and SEO when published—describe what the image shows, literally and in context.",
    validation: (rule) =>
      rule.custom((coverRaw, ctx) => {
        const cover = coverRaw as any;
        const doc = ctx.document as any;
        if (doc?.status !== "published") return true;

        const usingExternal =
          cover?.source === "external" && !!cover?.externalUrl;
        const usingAsset =
          cover?.source === "asset" && !!cover?.image?.asset?._ref;
        if (!usingExternal && !usingAsset) {
          return "Published articles require a valid cover source (asset or external URL).";
        }
        if (!cover?.alt?.trim()) {
          return "Published articles require cover alt text.";
        }
        return true;
      }),
  }),
  defineField({
    name: "imageGallery",
    title: "Image Gallery",
    type: "array",
    description:
      "Optional gallery/carousel images separate from the article body.",
    options: {
      modal: {
        type: "dialog",
        width: 800,
      },
    },
    of: [{ type: "galleryImageItem" }],
  }),
];

export const articleBodyFields = [
  defineField({
    name: "body",
    title: "Article Body",
    type: "blockContent",
    description: "Canonical body content stream composed in reading order.",
    validation: (rule) =>
      rule.custom((value, ctx) => {
        const doc = ctx.document as any;
        if (doc?.status !== "published") return true;
        if (!Array.isArray(value) || value.length === 0) {
          return "Published articles require body content.";
        }
        return true;
      }),
  }),
];

/** @deprecated Prefer `articleCoverGalleryFields` + `articleBodyFields` for ordering; kept for compatibility. */
export const articleMediaFields = [
  ...articleCoverGalleryFields,
  ...articleBodyFields,
];

export const articlePublishingFields = [
  defineField({
    name: "status",
    title: "Status",
    type: "string",
    options: { list: ["draft", "scheduled", "published"] },
    initialValue: "published",
  }),
  defineField({
    name: "publishedAt",
    title: "Published at",
    type: "datetime",
    initialValue: () => new Date().toISOString(),
    validation: (rule) =>
      rule.custom((value, ctx) =>
        (ctx.document as any)?.status === "published" && !value
          ? "publishedAt is required when status is published."
          : true,
      ),
  }),
  defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
];

export const articleSearchTextField = defineField({
  name: "searchText",
  title: "Search text",
  type: "text",
  rows: 6,
  description:
    "Optional search index text (keywords or phrases, one per line). " +
    "Leave empty to auto-fill via npm run backfill:article-search-text from title, body, tags, and related fields. " +
    "The backfill script never overwrites non-empty values.",
});

export const articleAuthorField = (options?: { required?: boolean }) =>
  defineField({
    name: "author",
    title: "Author",
    type: "reference",
    to: [{ type: "author" }],
    validation: options?.required ? (rule) => rule.required() : undefined,
  });

export const articleSeoField = defineField({
  name: "seo",
  title: "SEO",
  type: "seo",
});

export const articleAuthorSeoFields = [articleAuthorField(), articleSeoField];

/** Shared Studio copy for legacy Sanity view counters (Supabase is operational source of truth). */
export const LEGACY_SANITY_VIEWS_METRICS_DESCRIPTION =
  "Legacy transitional field (kept for migration only; do not use for new workflows). " +
  "The application does not use these values for ranking, “most read” surfaces, or live metrics. " +
  "Supabase article metrics (article_metrics_*) are the operational source of truth.";

export const transitionalViewMetricsFields = [
  defineField({
    name: "viewsAll",
    title: "Views (all time)",
    type: "number",
    fieldset: "rankingMetrics",
    description: LEGACY_SANITY_VIEWS_METRICS_DESCRIPTION,
    initialValue: 0,
    readOnly: true,
  }),
  defineField({
    name: "views30d",
    title: "Views (30 days)",
    type: "number",
    fieldset: "rankingMetrics",
    description: LEGACY_SANITY_VIEWS_METRICS_DESCRIPTION,
    initialValue: 0,
    readOnly: true,
  }),
  defineField({
    name: "views7d",
    title: "Views (7 days)",
    type: "number",
    fieldset: "rankingMetrics",
    description: LEGACY_SANITY_VIEWS_METRICS_DESCRIPTION,
    initialValue: 0,
    readOnly: true,
  }),
];
