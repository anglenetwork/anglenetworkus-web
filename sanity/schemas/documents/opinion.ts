import { CommentIcon } from "@sanity/icons";
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
  name: "opinion",
  title: "Opinion",
  icon: CommentIcon,
  type: "document",
  description:
    "Viewpoint or commentary content with a clearly attributable author. " +
    "Rankings and “most read” on the live site use Supabase article metrics—not Studio fields on other types.",
  groups: [
    {
      name: ARTICLE_FIELD_GROUPS.core,
      title: "Core editorial identity",
      default: true,
    },
    { name: ARTICLE_FIELD_GROUPS.typeSpecific, title: "Disclosure" },
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
      name: "disclosure",
      title: "Disclosure",
      type: "text",
      rows: 2,
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      description:
        "Disclose author affiliations, conflicts of interest, paid relationships, or other context readers need to assess the viewpoint. Use when anything could reasonably affect how the piece is read.",
    }),

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
      mediaCoverAsset: "cover.image",
    },
    prepare(selection) {
      const { title, status, authorName, date, mediaCoverAsset } =
        selection as {
          title?: string;
          status?: string;
          authorName?: string;
          date?: string;
          mediaCoverAsset?: unknown;
        };

      const parts: string[] = ["Opinion"];
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
