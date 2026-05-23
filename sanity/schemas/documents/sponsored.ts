import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import {
  ARTICLE_FIELD_GROUPS,
  articleAuthorField,
  articleBodyFields,
  articleCoreMetadataFields,
  articleCoverGalleryFields,
  articlePublishingFields,
  articleSearchTextField,
  articleSeoField,
  withFieldGroup,
} from "../helpers/articleBaseFields";

export default defineType({
  name: "sponsored",
  title: "Sponsored",
  icon: TagIcon,
  type: "document",
  description:
    "Paid or partner-published article content that must include clear sponsor attribution and disclosure. " +
    "Live-site rankings use Supabase metrics; keep sponsor fields accurate for readers and compliance.",
  groups: [
    { name: ARTICLE_FIELD_GROUPS.core, title: "Core editorial identity", default: true },
    { name: ARTICLE_FIELD_GROUPS.typeSpecific, title: "Sponsor attribution" },
    { name: ARTICLE_FIELD_GROUPS.taxonomy, title: "Taxonomy & attribution" },
    { name: ARTICLE_FIELD_GROUPS.media, title: "Media" },
    { name: ARTICLE_FIELD_GROUPS.body, title: "Body" },
    { name: ARTICLE_FIELD_GROUPS.publishing, title: "Publishing" },
    { name: ARTICLE_FIELD_GROUPS.seo, title: "SEO" },
    { name: ARTICLE_FIELD_GROUPS.legacy, title: "Legacy / operational" },
  ],
  fields: [
    ...withFieldGroup(articleCoreMetadataFields, ARTICLE_FIELD_GROUPS.core),

    defineField({
      name: "sponsorAttribution",
      title: "Sponsor Attribution",
      type: "sponsorAttribution",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      validation: (rule) => rule.required(),
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
      ...articleSearchTextField,
      group: ARTICLE_FIELD_GROUPS.legacy,
    } as any),

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
      sponsorName: "sponsorAttribution.sponsorName",
      mediaCoverAsset: "cover.image",
    },
    prepare(selection) {
      const { title, status, authorName, date, sponsorName, mediaCoverAsset } =
        selection as {
          title?: string;
          status?: string;
          authorName?: string;
          date?: string;
          sponsorName?: string;
          mediaCoverAsset?: unknown;
        };

      const parts: string[] = ["Sponsored"];
      if (sponsorName) parts.push(sponsorName);
      if (authorName) parts.push(`by ${authorName}`);
      if (date) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) parts.push(d.toLocaleDateString());
      }
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
