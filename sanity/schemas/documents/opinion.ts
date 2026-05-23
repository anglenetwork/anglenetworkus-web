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

const OPINION_FORMAT_LABELS: Record<string, string> = {
  "op-ed": "Op-Ed",
  editorial: "Editorial",
  column: "Column",
  commentary: "Commentary",
};

export default defineType({
  name: "opinion",
  title: "Opinion",
  icon: CommentIcon,
  type: "document",
  description:
    "Viewpoint or commentary content with a clearly attributable author and opinion format. " +
    "Rankings and “most read” on the live site use Supabase article metrics—not Studio fields on other types.",
  groups: [
    { name: ARTICLE_FIELD_GROUPS.core, title: "Core editorial identity", default: true },
    { name: ARTICLE_FIELD_GROUPS.typeSpecific, title: "Opinion format & disclosure" },
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
      name: "opinionFormat",
      title: "Opinion Format",
      type: "string",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      description: "Editorial format for this opinion piece.",
      options: {
        list: [
          { title: "Op-Ed", value: "op-ed" },
          { title: "Editorial", value: "editorial" },
          { title: "Column", value: "column" },
          { title: "Commentary", value: "commentary" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
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
      opinionFormat: "opinionFormat",
      mediaCoverAsset: "cover.image",
    },
    prepare(selection) {
      const { title, status, authorName, date, opinionFormat, mediaCoverAsset } =
        selection as {
          title?: string;
          status?: string;
          authorName?: string;
          date?: string;
          opinionFormat?: string;
          mediaCoverAsset?: unknown;
        };

      const parts: string[] = ["Opinion"];
      if (authorName) parts.push(`by ${authorName}`);
      if (date) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) parts.push(d.toLocaleDateString());
      }
      if (opinionFormat) {
        parts.push(OPINION_FORMAT_LABELS[opinionFormat] ?? opinionFormat);
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
