// /schemas/tag.ts
import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "tag",
  title: "Tag",
  icon: TagIcon,
  type: "document",
  fields: [
    // ---- Core ----
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule.required().min(2).custom((val: string | undefined) => {
          if (!val || typeof val !== "string") return true;
          if (val.trim() !== val) return "Remove leading/trailing spaces";
          return true;
        }),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value: string, context: any) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),

    // ---- Editorial metadata ----
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "aliases",
      title: "Aliases / Synonyms",
      type: "array",
      of: [{ type: "string" }],
      description: "Optional alternate names (helps search & dedup).",
      validation: (rule: any) =>
        rule.unique().max(20).warning("Keep aliases concise and distinct."),
    } as any),

    // Visuals (optional)
    defineField({
      name: "emoji",
      title: "Emoji (optional)",
      type: "string",
      description: "One-character emoji to show alongside this tag in UI.",
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "color",
      title: "Color (hex)",
      type: "string",
      description: "Optional brand color for this tag (e.g. #0ea5e9).",
      validation: (rule) =>
        rule
          .regex(/^#([0-9a-fA-F]{3}){1,2}$/, { name: "hex color" })
          .warning("Use a valid hex like #0ea5e9"),
    }),

    // Sorting / feature flags
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first in tag lists.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Surface this tag in navigation or featured rails.",
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      initialValue: false,
      description:
        "Hide from public tag indexes (still usable for editorial).",
    }),

    // Lifecycle / analytics
    defineField({
      name: "deprecated",
      title: "Deprecated",
      type: "boolean",
      initialValue: false,
      description:
        "Mark when this tag should no longer be used for new content.",
    }),
    defineField({
      name: "redirectTo",
      title: "Redirect to (canonical tag)",
      type: "reference",
      to: [{ type: "tag" }],
      description:
        "If deprecated, point to the canonical tag you want to consolidate into.",
      hidden: ({ parent }: { parent?: { deprecated?: boolean } }) => !parent?.deprecated,
    } as any),
    defineField({
      name: "analyticsKey",
      title: "Analytics Key",
      type: "string",
      description: "Optional key used by your analytics/tracking.",
    }),
    defineField({
      name: "views",
      title: "Views",
      type: "number",
      initialValue: 0,
      description: "Total number of visits to this tag page.",
      validation: (rule) => rule.min(0),
    }),
  ],

  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      emoji: "emoji",
      featured: "featured",
      hidden: "hidden",
      order: "order",
      deprecated: "deprecated",
      redirect: "redirectTo.title",
      alias0: "aliases[0]",
      alias1: "aliases[1]",
    },
    prepare(selection) {
      const {
        title,
        slug,
        emoji,
        featured,
        hidden,
        order,
        deprecated,
        redirect,
        alias0,
        alias1,
      } = selection as any;
      const aliasBits = [alias0, alias1].filter(Boolean);
      const aliasStr =
        aliasBits.length > 0 ? `aka ${aliasBits.join(", ")}` : null;
      const flags = [
        featured ? "★ featured" : null,
        hidden ? "hidden" : null,
        deprecated ? (redirect ? `→ ${redirect}` : "deprecated") : null,
        typeof order === "number" ? `#${order}` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      return {
        title: `${emoji ? `${emoji} ` : ""}${title}`,
        subtitle: [slug, aliasStr, flags].filter(Boolean).join(" · "),
      };
    },
  },
});
