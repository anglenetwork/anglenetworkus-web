import { BarChartIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import {
  ARTICLE_FIELD_GROUPS,
  articleAuthorField,
  articleBodyFields,
  articleCoreMetadataFields,
  articleCoverGalleryFields,
  articlePublishingFields,
  articleSeoField,
  withFieldGroup,
} from "../helpers/articleBaseFields";

export default defineType({
  name: "analysis",
  title: "Analysis",
  icon: BarChartIcon,
  type: "document",
  description:
    "Explanatory or interpretive journalism grounded in reporting and context, distinct from opinion. " +
    "Operational rankings and readership use Supabase metrics, not legacy Sanity view counters.",
  groups: [
    { name: ARTICLE_FIELD_GROUPS.core, title: "Core editorial identity", default: true },
    { name: ARTICLE_FIELD_GROUPS.typeSpecific, title: "Analysis metadata" },
    { name: ARTICLE_FIELD_GROUPS.taxonomy, title: "Taxonomy & attribution" },
    { name: ARTICLE_FIELD_GROUPS.media, title: "Media" },
    { name: ARTICLE_FIELD_GROUPS.body, title: "Body" },
    { name: ARTICLE_FIELD_GROUPS.publishing, title: "Publishing" },
    { name: ARTICLE_FIELD_GROUPS.seo, title: "SEO" },
  ],
  fields: [
    ...withFieldGroup(articleCoreMetadataFields, ARTICLE_FIELD_GROUPS.core),

    defineField({
      name: "analysisFocus",
      title: "Analysis Focus",
      type: "string",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      description:
        "One-line statement of what this analysis primarily explains, interprets, or contextualizes for readers (shown in listings and helps distinguish analysis from news and opinion).",
      validation: (rule) =>
        rule
          .required()
          .max(120)
          .custom((val: string | undefined) => {
            if (!val || typeof val !== "string") return true;
            if (val.trim() !== val) return "Remove leading/trailing spaces";
            return true;
          }),
    }),
    defineField({
      name: "methodologyNote",
      title: "Methodology Note",
      type: "text",
      rows: 3,
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      description:
        "Optional notes on how the analysis was constructed, interpreted, or framed.",
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "sourcesNote",
      title: "Sources Note",
      type: "text",
      rows: 3,
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      description:
        "Optional sourcing/context notes — e.g., based on reported developments, public statements, filings, data, or prior coverage.",
      validation: (rule) => rule.max(500),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: ARTICLE_FIELD_GROUPS.taxonomy,
      to: [{ type: "category" }],
      validation: (rule: any) => rule.required(),
    } as any),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: ARTICLE_FIELD_GROUPS.taxonomy,
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      options: { layout: "tags" },
      description: "Public topical keywords (tag docs only).",
    } as any),
    defineField({
      ...articleAuthorField({ required: true }),
      group: ARTICLE_FIELD_GROUPS.taxonomy,
    } as any),

    ...withFieldGroup(articleCoverGalleryFields, ARTICLE_FIELD_GROUPS.media),
    ...withFieldGroup(articleBodyFields, ARTICLE_FIELD_GROUPS.body),
    ...withFieldGroup(articlePublishingFields, ARTICLE_FIELD_GROUPS.publishing),

    defineField({
      ...articleSeoField,
      group: ARTICLE_FIELD_GROUPS.seo,
    } as any),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      authorName: "author.name",
      date: "publishedAt",
      analysisFocus: "analysisFocus",
      mediaCoverAsset: "cover.image",
    },
    prepare(selection) {
      const { title, status, authorName, date, analysisFocus, mediaCoverAsset } =
        selection as {
          title?: string;
          status?: string;
          authorName?: string;
          date?: string;
          analysisFocus?: string;
          mediaCoverAsset?: unknown;
        };

      const parts: string[] = ["Analysis"];
      if (authorName) parts.push(`by ${authorName}`);
      if (date) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) parts.push(d.toLocaleDateString());
      }
      if (analysisFocus) parts.push(analysisFocus);
      if (status === "draft") parts.push("Draft");
      else if (status === "scheduled") parts.push("Scheduled");
      else if (status === "published") parts.push("Published");

      return {
        title,
        media: mediaCoverAsset as any,
        subtitle: parts.join(" · "),
      };
    },
  },
});
