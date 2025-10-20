import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  icon: UserIcon,
  type: "document",
  fields: [
    // --- existing fields (unchanged) ---
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: "alt" },
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) =>
            rule.custom((alt, context) => {
              if ((context.document?.picture as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            }),
        },
      ],
      validation: (rule) => rule.required(),
    }),

    // --- additions (non-breaking) ---
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Role / Title",
      type: "string",
      description: "e.g., Senior Reporter, Opinions Editor.",
    }),
    defineField({
      name: "pronouns",
      title: "Pronouns",
      type: "string",
      description: "e.g., she/her, he/him, they/them.",
    }),
    defineField({
      name: "shortBio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description: "One-liner for bylines and cards.",
    }),
    defineField({
      name: "bio",
      title: "Full Bio",
      type: "blockContent", // create this object schema if you haven't yet
      description: "Rich bio for the author page.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City, country (optional).",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Optional contact email.",
    }),

    // Socials (add what you use)
    defineField({ name: "website", title: "Website", type: "url" }),
    defineField({ name: "twitter", title: "X / Twitter", type: "string" }),
    defineField({ name: "instagram", title: "Instagram", type: "string" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "string" }),
    defineField({ name: "youtube", title: "YouTube", type: "string" }),

    // Editorial flags
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Surface this author on the team page/homepage.",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide from author indexes.",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first in author lists.",
    }),

    // Optional: SEO bundle for author pages
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo", // create seo object schema if you haven't yet
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitleAlt: "title",
      media: "picture",
      handleX: "twitter",
      website: "website",
      featured: "featured",
      active: "active",
      order: "order",
    },
    prepare(selection) {
      const { title, subtitleAlt, handleX, website, featured, active, order, media } =
        selection as any;

      const bits = [
        subtitleAlt || null,
        handleX ? `@${handleX}` : null,
        website ? new URL(website).hostname.replace(/^www\./, "") : null,
        featured ? "★ featured" : null,
        active === false ? "inactive" : null,
        typeof order === "number" ? `#${order}` : null,
      ]
        .filter(Boolean)
        .join(" • ");

      return {
        title,
        subtitle: bits,
        media,
      };
    },
  },
});
