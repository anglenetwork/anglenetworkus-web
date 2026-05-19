// /schemas/post.ts
import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import {
  ARTICLE_FIELD_GROUPS,
  articleAuthorField,
  articleBodyFields,
  articleCoreMetadataFields,
  articleCoverGalleryFields,
  articlePublishingFields,
  articleSeoField,
  LEGACY_SANITY_VIEWS_METRICS_DESCRIPTION,
  transitionalViewMetricsFields,
  withFieldGroup,
} from "../helpers/articleBaseFields";

const homepageRailExclusivity =
  "Only one primary homepage rail may be on at a time: Main Headline, Frontline, Right Rail, or Just In. " +
  "You cannot combine two rails on the same post (Studio validation enforces this).";

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  description:
    "Standard reported news article for the main editorial news flow. " +
    "Rankings and “most read” on the live site use Supabase article metrics, not legacy Sanity view fields below.",
  groups: [
    { name: ARTICLE_FIELD_GROUPS.core, title: "Core editorial identity", default: true },
    { name: ARTICLE_FIELD_GROUPS.typeSpecific, title: "Homepage & curation" },
    { name: ARTICLE_FIELD_GROUPS.taxonomy, title: "Taxonomy & attribution" },
    { name: ARTICLE_FIELD_GROUPS.media, title: "Media" },
    { name: ARTICLE_FIELD_GROUPS.body, title: "Body" },
    { name: ARTICLE_FIELD_GROUPS.publishing, title: "Publishing" },
    { name: ARTICLE_FIELD_GROUPS.seo, title: "SEO" },
    { name: ARTICLE_FIELD_GROUPS.legacy, title: "Legacy / operational" },
  ],
  fieldsets: [
    {
      name: "homepage",
      title: "Homepage & curation",
      description: `${homepageRailExclusivity} Featured and priority below are separate boosts (not mutually exclusive with a rail).`,
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "rankingMetrics",
      title: "Legacy metrics (transitional)",
      description:
        LEGACY_SANITY_VIEWS_METRICS_DESCRIPTION +
        " Do not use for editorial decisions; operational rankings use Supabase.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    ...withFieldGroup(articleCoreMetadataFields, ARTICLE_FIELD_GROUPS.core),

    defineField({
      name: "mainHeadline",
      title: "Main Headline",
      type: "boolean",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      initialValue: false,
      description: `Homepage hero rail — the lead story slot. ${homepageRailExclusivity}`,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (value) {
            if (doc?.frontline) {
              return "Cannot be both Main Headline and Frontline at the same time";
            }
            if (doc?.rightHeadline) {
              return "Cannot be both Main Headline and Right Rail at the same time";
            }
            if (doc?.justIn) {
              return "Cannot be both Main Headline and Just In at the same time";
            }
          }
          return true;
        }),
    }),

    defineField({
      name: "frontline",
      title: "Frontline",
      type: "boolean",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      initialValue: false,
      description: `Homepage “more top headlines” rail (Frontline). Same exclusivity rules as other primary rails. ${homepageRailExclusivity}`,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (value) {
            if (doc?.mainHeadline) {
              return "Cannot be both Frontline and Main Headline at the same time";
            }
            if (doc?.rightHeadline) {
              return "Cannot be both Frontline and Right Rail at the same time";
            }
            if (doc?.justIn) {
              return "Cannot be both Frontline and Just In at the same time";
            }
            if (!doc?.publishedAt) {
              return "Warning: Published date is recommended when showing on front page";
            }
          }
          return true;
        }),
    }),

    defineField({
      name: "rightHeadline",
      title: "Right Rail",
      type: "boolean",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      initialValue: false,
      description: `Homepage right-hand headline rail. ${homepageRailExclusivity}`,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (value) {
            if (doc?.mainHeadline) {
              return "Cannot be both Right Rail and Main Headline at the same time";
            }
            if (doc?.frontline) {
              return "Cannot be both Right Rail and Frontline at the same time";
            }
            if (doc?.justIn) {
              return "Cannot be both Right Rail and Just In at the same time";
            }
          }
          return true;
        }),
    }),

    defineField({
      name: "justIn",
      title: "Just In",
      type: "boolean",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      initialValue: false,
      description: `Homepage “Just In” rail. ${homepageRailExclusivity} Breaking / Developing flags only apply when Just In is on.`,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (value) {
            if (doc?.mainHeadline) {
              return "Cannot be both Just In and Main Headline at the same time";
            }
            if (doc?.frontline) {
              return "Cannot be both Just In and Frontline at the same time";
            }
            if (doc?.rightHeadline) {
              return "Cannot be both Just In and Right Rail at the same time";
            }
          }
          return true;
        }),
    }),

    defineField({
      name: "breakingNews",
      title: "Breaking",
      type: "boolean",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      initialValue: false,
      description: "Breaking label for this item in Just In (mutually exclusive with Developing).",
      hidden: ({ parent }) => !parent?.justIn,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (doc?.justIn && value && doc?.developingStory) {
            return "Cannot be both breaking news and developing story at the same time";
          }
          return true;
        }),
    }),
    defineField({
      name: "developingStory",
      title: "Developing",
      type: "boolean",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      initialValue: false,
      description: "Developing label for this item in Just In (mutually exclusive with Breaking).",
      hidden: ({ parent }) => !parent?.justIn,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (doc?.justIn && value && doc?.breakingNews) {
            return "Cannot be both breaking news and developing story at the same time";
          }
          return true;
        }),
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      initialValue: false,
      description:
        "Editorial boost for hero, search, and other surfaces—not a homepage rail slot. Can be combined with a rail when allowed by validation.",
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description:
        "Site-wide editorial boost (0–10) for curated rails and relevance-style surfaces—not the same as per-rail order above.",
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "readTime",
      title: "Estimated read time (min)",
      type: "number",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: "Optional editorial estimate. Can be auto-derived from body content in a later stage.",
    }),

    defineField({
      name: "labels",
      title: "Labels (internal)",
      type: "array",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
        list: [
          { title: "breaking", value: "breaking" },
          { title: "exclusive", value: "exclusive" },
          { title: "live", value: "live" },
        ],
      },
      description: "Internal curation or badge flags only. Not a content-type system.",
    } as any),

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
      ...articleAuthorField(),
      group: ARTICLE_FIELD_GROUPS.taxonomy,
    } as any),

    ...withFieldGroup(articleCoverGalleryFields, ARTICLE_FIELD_GROUPS.media),
    ...withFieldGroup(articleBodyFields, ARTICLE_FIELD_GROUPS.body),
    ...withFieldGroup(articlePublishingFields, ARTICLE_FIELD_GROUPS.publishing),

    ...transitionalViewMetricsFields.map((f) =>
      defineField({ ...f, group: ARTICLE_FIELD_GROUPS.legacy } as any),
    ),

    defineField({
      ...articleSeoField,
      group: ARTICLE_FIELD_GROUPS.seo,
    } as any),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      publishedAt: "publishedAt",
      categoryName: "category.name",
      mainHeadline: "mainHeadline",
      frontline: "frontline",
      rightHeadline: "rightHeadline",
      justIn: "justIn",
      breakingNews: "breakingNews",
      developingStory: "developingStory",
      mediaCoverAsset: "cover.image",
    },
    prepare(selection) {
      const {
        title,
        status,
        publishedAt,
        categoryName,
        mainHeadline,
        frontline,
        rightHeadline,
        justIn,
        breakingNews,
        developingStory,
        mediaCoverAsset,
      } = selection as Record<string, unknown>;

      const parts: string[] = ["Post"];
      if (categoryName && typeof categoryName === "string") parts.push(categoryName);
      if (publishedAt && typeof publishedAt === "string") {
        const d = new Date(publishedAt);
        if (!isNaN(d.getTime())) parts.push(d.toLocaleDateString());
      }

      if (mainHeadline) parts.push("Main Headline");
      else if (frontline) parts.push("Frontline");
      else if (rightHeadline) parts.push("Right Rail");
      else if (justIn) parts.push("Just In");

      if (breakingNews) parts.push("Breaking");
      else if (developingStory) parts.push("Developing");

      if (status === "draft") parts.push("Draft");
      else if (status === "scheduled") parts.push("Scheduled");
      else if (status === "published") parts.push("Published");

      const subtitle = parts.join(" · ");
      return {
        title: typeof title === "string" ? title : undefined,
        subtitle,
        media: (mediaCoverAsset || undefined) as any,
      };
    },
  },
});
