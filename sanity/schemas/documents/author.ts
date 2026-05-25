import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  icon: UserIcon,
  type: "document",
  fields: [
    // Core fields
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
          validation: (rule: any) =>
            rule.custom((alt: string | undefined, context: any) => {
              if ((context.document?.picture as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            }),
        },
      ],
      validation: (rule: any) => rule.required(),
    } as any),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value: string, context: any) =>
          context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cmsRole",
      title: "CMS Role",
      type: "string",
      description:
        "Used for Studio access control (separate from editorial title).",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "Editor", value: "editor" },
          { title: "Author", value: "author" },
        ],
        layout: "radio",
      },
      initialValue: "author",
    }),
    defineField({
      name: "canAccessStudio",
      title: "Can access Studio",
      type: "boolean",
      description:
        "If enabled, this author can log into the Sanity Studio via NextAuth gate.",
      initialValue: false,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Your email address authorized to access Studio.",
      validation: (rule) => rule.required(),
    }),

    // Editorial fields
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
      title: "Summary",
      type: "text",
      rows: 3,
      description: "One-liner for bylines and cards.",
    }),
    defineField({
      name: "bio",
      title: "Full Bio",
      type: "blockContent",
      description: "Rich bio for the author page.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City, country (optional).",
    }),

    // Social links
    defineField({ name: "website", title: "Website", type: "url" }),
    defineField({ name: "twitter", title: "X / Twitter", type: "string" }),
    defineField({ name: "instagram", title: "Instagram", type: "string" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "string" }),
    defineField({ name: "youtube", title: "YouTube", type: "string" }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    select: {
      title: "name",
      roleTitle: "title",
      media: "picture",
      cmsRole: "cmsRole",
      canAccessStudio: "canAccessStudio",
    },
    prepare(selection) {
      const { title, roleTitle, cmsRole, canAccessStudio, media } =
        selection as any;

      const studioBit = canAccessStudio
        ? `Studio access (${cmsRole || "on"})`
        : "Byline only (no Studio login)";

      const bits = [roleTitle || null, studioBit].filter(Boolean).join(" · ");

      return {
        title,
        subtitle: bits,
        media,
      };
    },
  },
});
