// /schemas/post.ts
import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    // ---- Core taxonomies ----
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    // Backward-compatible: allow old category refs to remain selectable,
    // but encourage using Tag going forward.
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      options: { layout: "tags" },
      description: "Public topical keywords (tag docs only).",
    }),
    

    // ---- Main metadata ----
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
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility.",
          validation: (rule) =>
            rule.custom((alt, context) => {
              const hasAsset = (context.document as any)?.coverImage?.asset?._ref;
              if (hasAsset && !alt) return "Required";
              return true;
            }),
        },
      ],
    }),
    defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
    defineField({ name: "imageSource", title: "Image Source", type: "string" }),

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

    // ---- Body content (legacy + rich) ----
    defineField({
      name: "bodyTextOne",
      title: "Body Text One",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bodyImageOne",
      title: "Body Image One",
      type: "image",
      options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
      fields: [
        { name: "alt", type: "string", title: "Alternative text", description: "Important for SEO and accessibility." },
        { name: "epigraph", type: "string", title: "Epigraph" },
        { name: "imageSource", type: "string", title: "Image Source" },
      ],
    }),
    defineField({ name: "bodyTextTwo", title: "Body Text Two", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "bodyImageTwo",
      title: "Body Image Two",
      type: "image",
      options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
      fields: [
        { name: "alt", type: "string", title: "Alternative text", description: "Important for SEO and accessibility." },
        { name: "epigraph", type: "string", title: "Epigraph" },
        { name: "imageSource", type: "string", title: "Image Source" },
      ],
    }),
    defineField({ name: "bodyTextThree", title: "Body Text Three", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "bodyImageThree",
      title: "Body Image Three",
      type: "image",
      options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
      fields: [
        { name: "alt", type: "string", title: "Alternative text", description: "Important for SEO and accessibility." },
        { name: "epigraph", type: "string", title: "Epigraph" },
        { name: "imageSource", type: "string", title: "Image Source" },
      ],
    }),
    defineField({ name: "bodyTextFour", title: "Body Text Four", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "bodyImageFour",
      title: "Body Image Four",
      type: "image",
      options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
      fields: [
        { name: "alt", type: "string", title: "Alternative text", description: "Important for SEO and accessibility." },
        { name: "epigraph", type: "string", title: "Epigraph" },
        { name: "imageSource", type: "string", title: "Image Source" },
      ],
    }),
    defineField({ name: "bodyTextFive", title: "Body Text Five", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "bodyImageFive",
      title: "Body Image Five",
      type: "image",
      options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
      fields: [
        { name: "alt", type: "string", title: "Alternative text", description: "Important for SEO and accessibility." },
        { name: "epigraph", type: "string", title: "Epigraph" },
        { name: "imageSource", type: "string", title: "Image Source" },
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
          fields: [
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            { name: "epigraph", title: "Epigraph", type: "string" },
            { name: "imageSource", title: "Image Source", type: "string" },
          ],
        },
      ],
      validation: (rule) => rule.max(3),
    }),

    // ---- Dates / status ----
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "scheduled", "published"] },
      initialValue: "draft",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description: 'Use for ordering/SEO. Keep "date" for legacy if needed.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) =>
        rule.custom((val, context) => {
          const st = (context.document as any)?.status;
          if (st === "published" && !val) return "publishedAt is required when status is published";
          return true;
        }),
    }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),

    // ---- Author / comments ----
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "comments",
      title: "Comments",
      type: "array",
      of: [{ type: "reference", to: [{ type: "comment" }] }],
      readOnly: true,
    }),

    // ---- Editorial controls ----
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Pin for homepage heroes/rails.",
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      description: "Higher number surfaces earlier in curated rails.",
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({ name: "readTime", title: "Estimated read time (min)", type: "number" }),

    // ---- Labels: internal editorial flags (strings) ----
    defineField({
      name: "labels",
      title: "Labels (internal)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
        list: [
          { title: "breaking", value: "breaking" },
          { title: "analysis", value: "analysis" },
          { title: "opinion", value: "opinion" },
          { title: "exclusive", value: "exclusive" },
          { title: "sponsored", value: "sponsored" },
          { title: "live", value: "live" },
        ],
      },
      description: "Internal flags for curation/badges; not used for public search.",
    }),

    // ---- Unified rich body (in addition to legacy chunks) ----
    defineField({
      name: "bodyRich",
      title: "Body (rich, portable text)",
      type: "blockContent",
    }),

    // ---- SEO ----
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "coverImage",
      featured: "featured",
      date: "publishedAt",
    },
    prepare(selection) {
      const { author, featured, date } = selection as any;
      const bits: string[] = [];
      if (author) bits.push(`by ${author}`);
      if (date) bits.push(new Date(date).toLocaleDateString());
      if (featured) bits.push("★ Featured");
      return { ...selection, subtitle: bits.join(" • ") };
    },
  },
});
