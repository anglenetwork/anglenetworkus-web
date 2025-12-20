import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  icon: TagIcon,
  type: "document",
  fields: [
    // --- existing fields (unchanged) ---
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value: string, context: any) => context.defaultIsUnique(value, context),
      },
      validation: (rule: any) => rule.required(),
    }),

    // --- additions (non-breaking) ---
    defineField({
      name: "parent",
      title: "Parent (optional)",
      type: "reference",
      to: [{ type: "category" }],
      description: "Use to build hierarchical sections (e.g., Sports → Football).",
    } as any),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "hero",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Important for SEO and accessibility.",
        },
      ],
    } as any),
    defineField({
      name: "emoji",
      title: "Emoji (optional)",
      type: "string",
      description: "One emoji to show with this category in UI.",
      validation: (rule: any) => rule.max(4),
    }),
    defineField({
      name: "color",
      title: "Color (hex)",
      type: "string",
      description: "Optional brand color for this category (e.g. #0ea5e9).",
      validation: (rule: any) =>
        rule
          .regex(/^#([0-9a-fA-F]{3}){1,2}$/, { name: "hex color" })
          .warning("Use a valid hex like #0ea5e9"),
    }),
    defineField({
      name: "navTitle",
      title: "Navigation Title",
      type: "string",
      description: "Shorter label for menus (defaults to Name if empty).",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first in nav and lists.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Surface this category on the homepage/section rails.",
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      initialValue: false,
      description: "Hide from public navigation (still queryable).",
    }),
    defineField({
      name: "layout",
      title: "Default Section Layout",
      type: "string",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Grid", value: "grid" },
          { title: "Magazine", value: "magazine" },
        ],
      },
      initialValue: "standard",
      description: "Optional hint for your front-end to choose a layout.",
    }),
    // Optional: requires you to have an 'seo' object schema
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "views",
      title: "Views",
      type: "number",
      initialValue: 0,
      description: "Total number of visits to posts in this category.",
      validation: (rule: any) => rule.min(0),
    }),
  ],

  preview: {
    select: {
      title: "name",
      slug: "slug.current",
      emoji: "emoji",
      featured: "featured",
      hidden: "hidden",
      order: "order",
      parentName: "parent.name",
      media: "hero",
      views: "views",
    },
    prepare(selection) {
      const { title, slug, emoji, featured, hidden, order, parentName, media, views } =
        selection as any;

      const flags = [
        parentName ? `↳ ${parentName}` : null,
        featured ? "★ featured" : null,
        hidden ? "hidden" : null,
        typeof order === "number" ? `#${order}` : null,
        views > 0 ? `👁 ${views}` : null,
      ]
        .filter(Boolean)
        .join(" • ");

      return {
        title: `${emoji ? `${emoji} ` : ""}${title}`,
        subtitle: [slug, flags].filter(Boolean).join(" • "),
        media,
      };
    },
  },
});
