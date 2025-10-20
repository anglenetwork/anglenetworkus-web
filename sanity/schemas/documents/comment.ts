import { CommentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "comment",
  title: "Comment",
  icon: CommentIcon,
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
      name: "approved",
      title: "Approved",
      type: "boolean",
      description: "Comments won't show on the site without approval",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "comment",
      title: "Comment",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (rule) => rule.required(),
    }),

    // --- additions (non-breaking) ---
    // Threading (replies)
    defineField({
      name: "parent",
      title: "Parent comment",
      type: "reference",
      to: [{ type: "comment" }],
      description: "Optional. Set when this is a reply to another comment.",
    }),

    // Status + moderation
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
          { title: "Flagged", value: "flagged" },
          { title: "Spam", value: "spam" },
        ],
      },
      initialValue: "pending",
      description: "Editorial moderation status (approved boolean is still honored).",
    }),
    defineField({
      name: "moderatorNote",
      title: "Moderator note",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "pinned",
      title: "Pinned",
      type: "boolean",
      initialValue: false,
      description: "Pin this comment to the top of the thread.",
    }),
    defineField({
      name: "reports",
      title: "Reports count",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "likes",
      title: "Likes / Upvotes",
      type: "number",
      initialValue: 0,
    }),

    // Audit / metadata (useful for abuse prevention & analytics)
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
    }),
    defineField({
      name: "ip",
      title: "IP (masked)",
      type: "string",
      description: "Optional. Store masked IP for abuse prevention.",
    }),
    defineField({
      name: "userAgent",
      title: "User agent",
      type: "string",
    }),
    defineField({
      name: "referrer",
      title: "Referrer",
      type: "url",
    }),
    defineField({
      name: "pageUrl",
      title: "Page URL",
      type: "url",
      description: "Canonical page URL where the comment was posted.",
    }),

    // Compliance / consent
    defineField({
      name: "consent",
      title: "Privacy consent",
      type: "boolean",
      initialValue: true,
      description: "User consent to display/process comment (if collected).",
    }),
  ],

  preview: {
    select: {
      title: "name",
      body: "comment",
      approved: "approved",
      status: "status",
      pinned: "pinned",
      createdAt: "createdAt",
    },
    prepare(sel) {
      const { title, body, approved, status, pinned, createdAt } = sel as any;
      const flags = [
        pinned ? "📌 pinned" : null,
        approved ? "approved" : "unapproved",
        status && status !== "pending" ? status : null,
        createdAt ? new Date(createdAt).toLocaleDateString() : null,
      ]
        .filter(Boolean)
        .join(" • ");

      return {
        title,
        subtitle: `${(body || "").slice(0, 70)}${body?.length > 70 ? "…" : ""} ${flags ? `• ${flags}` : ""}`,
      };
    },
  },
});
