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

const rankHelp =
  "Editorial order within this rail only: higher numbers surface earlier (e.g. 10 above 5). Not site-wide priority.";

const untilHelp =
  "Placement expiry: after this date/time the post stops appearing in this rail (even if the toggle stays on). Required when the placement is enabled.";

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
            if (doc?.mainHeadlineUntil) {
              const mainHeadlineUntilDate = new Date(doc.mainHeadlineUntil);
              const now = new Date();
              const threeDaysFromNow = new Date(now);
              threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

              if (mainHeadlineUntilDate > threeDaysFromNow) {
                return "Warning: Main Headline Until date is more than 3 days away. Consider setting it to 24-48 hours to ensure content freshness.";
              }
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "mainHeadlineRank",
      title: "Main Headline order",
      type: "number",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: `${rankHelp} (Main Headline rail.)`,
      hidden: ({ parent }) => !parent?.mainHeadline,
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "mainHeadlineUntil",
      title: "Main Headline until (expiry)",
      type: "datetime",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: `${untilHelp} Recommended: 24–48 hours (max 3 days).`,
      hidden: ({ parent }) => !parent?.mainHeadline,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;

          if (doc?.mainHeadline && !value) {
            return "Main Headline Until is required when Main Headline is enabled.";
          }

          if (!value) return true;

          if (typeof value !== "string") return true;

          const mainHeadlineUntilDate = new Date(value);
          if (isNaN(mainHeadlineUntilDate.getTime())) return true;

          const now = new Date();
          const threeDaysFromNow = new Date(now);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

          if (mainHeadlineUntilDate > threeDaysFromNow) {
            return "Warning: Main Headline Until date is more than 3 days away. This may keep the article in the main headline section longer than intended. Recommended: 24-48 hours.";
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
            if (doc?.frontUntil) {
              const frontUntilDate = new Date(doc.frontUntil);
              const now = new Date();
              const threeDaysFromNow = new Date(now);
              threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

              if (frontUntilDate > threeDaysFromNow) {
                return "Warning: Front Until date is more than 3 days away. Consider setting it to 24-48 hours to ensure content freshness.";
              }
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "frontRank",
      title: "Frontline order",
      type: "number",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: `${rankHelp} (Frontline rail.)`,
      hidden: ({ parent }) => !parent?.frontline,
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "frontUntil",
      title: "Frontline until (expiry)",
      type: "datetime",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: `${untilHelp} Recommended: 24–48 hours (max 3 days).`,
      hidden: ({ parent }) => !parent?.frontline,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;

          if (doc?.frontline && !value) {
            return "Front Until is required when Frontline is enabled.";
          }

          if (!value) return true;

          if (typeof value !== "string") return true;

          const frontUntilDate = new Date(value);
          if (isNaN(frontUntilDate.getTime())) return true;

          const now = new Date();
          const threeDaysFromNow = new Date(now);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

          if (frontUntilDate > threeDaysFromNow) {
            return "Warning: Front Until date is more than 3 days away. This may keep the article in the Frontline section longer than intended. Recommended: 24-48 hours.";
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
            if (doc?.rightHeadlineUntil) {
              const rightHeadlineUntilDate = new Date(doc.rightHeadlineUntil);
              const now = new Date();
              const threeDaysFromNow = new Date(now);
              threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

              if (rightHeadlineUntilDate > threeDaysFromNow) {
                return "Warning: Right Rail Until date is more than 3 days away. Consider setting it to 24-48 hours to ensure content freshness.";
              }
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "rightHeadlineRank",
      title: "Right Rail order",
      type: "number",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: `${rankHelp} (Right Rail.)`,
      hidden: ({ parent }) => !parent?.rightHeadline,
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "rightHeadlineUntil",
      title: "Right Rail until (expiry)",
      type: "datetime",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: `${untilHelp} Recommended: 24–48 hours (max 3 days).`,
      hidden: ({ parent }) => !parent?.rightHeadline,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;

          if (doc?.rightHeadline && !value) {
            return "Right Rail Until is required when Right Rail is enabled.";
          }

          if (!value) return true;

          if (typeof value !== "string") return true;

          const rightHeadlineUntilDate = new Date(value);
          if (isNaN(rightHeadlineUntilDate.getTime())) return true;

          const now = new Date();
          const threeDaysFromNow = new Date(now);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

          if (rightHeadlineUntilDate > threeDaysFromNow) {
            return "Warning: Right Rail Until date is more than 3 days away. This may keep the article in the right rail longer than intended. Recommended: 24-48 hours.";
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
            if (doc?.justInUntil) {
              const justInUntilDate = new Date(doc.justInUntil);
              const now = new Date();
              const threeDaysFromNow = new Date(now);
              threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

              if (justInUntilDate > threeDaysFromNow) {
                return "Warning: Just In Until date is more than 3 days away. Consider setting it to 24-48 hours to ensure content freshness.";
              }
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "justInRank",
      title: "Just In order",
      type: "number",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: `${rankHelp} (Just In rail.)`,
      hidden: ({ parent }) => !parent?.justIn,
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "justInUntil",
      title: "Just In until (expiry)",
      type: "datetime",
      group: ARTICLE_FIELD_GROUPS.typeSpecific,
      fieldset: "homepage",
      description: `${untilHelp} Recommended: 24–48 hours (max 3 days).`,
      hidden: ({ parent }) => !parent?.justIn,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;

          if (doc?.justIn && !value) {
            return "Just In Until is required when Just In is enabled.";
          }

          if (!value) return true;

          if (typeof value !== "string") return true;

          const justInUntilDate = new Date(value);
          if (isNaN(justInUntilDate.getTime())) return true;

          const now = new Date();
          const threeDaysFromNow = new Date(now);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

          if (justInUntilDate > threeDaysFromNow) {
            return "Warning: Just In Until date is more than 3 days away. This may keep the article in Just In longer than intended. Recommended: 24-48 hours.";
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
      categoryName: "category->name",
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
