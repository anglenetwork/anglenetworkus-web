// /schemas/post.ts
import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule: any) => rule.required(),
    } as any),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      options: { layout: "tags" },
      description: "Public topical keywords (tag docs only).",
    } as any),
    defineField({
      name: "mainHeadline",
      title: "Main Headline",
      type: "boolean",
      initialValue: false,
      description: "Mark this post as a main headline. Auto-sets Main Headline Until to 24 hours (adjustable).",
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (value) {
            if (doc?.frontline) {
              return "Cannot be both Main Headline and Front Page (More Top Headlines) Section at the same time";
            }
            if (doc?.rightHeadline) {
              return "Cannot be both Main Headline and Right Headline at the same time";
            }
            if (doc?.justIn) {
              return "Cannot be both Main Headline and Just In at the same time";
            }
            // Validate mainHeadlineUntil if set
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
      title: "Main Headline Rank",
      type: "number",
      description: "Higher number shows earlier in the main headline section (e.g., 10 = top).",
      hidden: ({ parent }) => !parent?.mainHeadline,
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "mainHeadlineUntil",
      title: "Main Headline Until",
      type: "datetime",
      description: "Auto-removes from main headline after this date. Required when Main Headline is enabled. Recommended: 24-48 hours (max 3 days).",
      hidden: ({ parent }) => !parent?.mainHeadline,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          
          // Required when mainHeadline is enabled
          if (doc?.mainHeadline && !value) {
            return "Main Headline Until is required when Main Headline is enabled.";
          }
          
          // Allow clearing the field if mainHeadline is disabled
          if (!value) return true;
          
          // Validate that value is a valid date string
          if (typeof value !== 'string') return true;
          
          const mainHeadlineUntilDate = new Date(value);
          if (isNaN(mainHeadlineUntilDate.getTime())) return true;
          
          const now = new Date();
          const threeDaysFromNow = new Date(now);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
          
          if (mainHeadlineUntilDate > threeDaysFromNow) {
            return "Warning: Main Headline Until date is more than 3 days away. This may keep the article in the main headline section longer than intended. Recommended: 24-48 hours.";
          }
          
          if (mainHeadlineUntilDate < now) {
            return "Main Headline Until date is in the past. The article will be immediately removed from the main headline section.";
          }
          
          return true;
        }),
    }),
    defineField({
      name: "frontline",
      title: "Front Page (More Top Headlines) Section",
      type: "boolean",
      initialValue: false,
      description: "Pin to main headlines. Auto-sets Front Until to 24 hours (adjustable).",
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (value) {
            if (doc?.mainHeadline) {
              return "Cannot be both Front Page (More Top Headlines) Section and Main Headline at the same time";
            }
            if (doc?.rightHeadline) {
              return "Cannot be both Front Page (More Top Headlines) Section and Right Headline at the same time";
            }
            if (doc?.justIn) {
              return "Cannot be both Front Page (More Top Headlines) Section and Just In at the same time";
            }
            if (!doc?.publishedAt) {
              return "Warning: Published date is recommended when showing on front page";
            }
            // Validate frontUntil if set
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
      title: "Front Rank",
      type: "number",
      description: "Higher number shows earlier in the More Top Headlines section (e.g., 10 = top).",
      hidden: ({ parent }) => !parent?.frontline,
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "frontUntil",
      title: "Front Until",
      type: "datetime",
      description: "Auto-removes from More Top Headlines section after this date. Required when Front Page is enabled. Recommended: 24-48 hours (max 3 days).",
      hidden: ({ parent }) => !parent?.frontline,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          
          // Required when frontline is enabled
          if (doc?.frontline && !value) {
            return "Front Until is required when Front Page is enabled.";
          }
          
          // Allow clearing the field if frontline is disabled
          if (!value) return true;
          
          // Validate that value is a valid date string
          if (typeof value !== 'string') return true;
          
          const frontUntilDate = new Date(value);
          // Check if date is valid
          if (isNaN(frontUntilDate.getTime())) return true;
          
          const now = new Date();
          const threeDaysFromNow = new Date(now);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
          
          if (frontUntilDate > threeDaysFromNow) {
            return "Warning: Front Until date is more than 3 days away. This may keep the article in the More Top Headlines section longer than intended. Recommended: 24-48 hours.";
          }
          
          if (frontUntilDate < now) {
            return "Front Until date is in the past. The article will be immediately removed from the More Top Headlines section.";
          }
          
          return true;
        }),
    }),
    defineField({
      name: "rightHeadline",
      title: "Right Headline",
      type: "boolean",
      initialValue: false,
      description: "Mark this post as a right headline. Right Headline Until is required when enabled.",
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (value) {
            if (doc?.mainHeadline) {
              return "Cannot be both Right Headline and Main Headline at the same time";
            }
            if (doc?.frontline) {
              return "Cannot be both Right Headline and Front Page (More Top Headlines) Section at the same time";
            }
            if (doc?.justIn) {
              return "Cannot be both Right Headline and Just In at the same time";
            }
            // Validate rightHeadlineUntil if set
            if (doc?.rightHeadlineUntil) {
              const rightHeadlineUntilDate = new Date(doc.rightHeadlineUntil);
              const now = new Date();
              const threeDaysFromNow = new Date(now);
              threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
              
              if (rightHeadlineUntilDate > threeDaysFromNow) {
                return "Warning: Right Headline Until date is more than 3 days away. Consider setting it to 24-48 hours to ensure content freshness.";
              }
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "rightHeadlineRank",
      title: "Right Headline Rank",
      type: "number",
      description: "Higher number shows earlier in the right headline section (e.g., 10 = top).",
      hidden: ({ parent }) => !parent?.rightHeadline,
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "rightHeadlineUntil",
      title: "Right Headline Until",
      type: "datetime",
      description: "Auto-removes from right headline after this date. Required when Right Headline is enabled. Recommended: 24-48 hours (max 3 days).",
      hidden: ({ parent }) => !parent?.rightHeadline,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          
          // Required when rightHeadline is enabled
          if (doc?.rightHeadline && !value) {
            return "Right Headline Until is required when Right Headline is enabled.";
          }
          
          // Allow clearing the field if rightHeadline is disabled
          if (!value) return true;
          
          // Validate that value is a valid date string
          if (typeof value !== 'string') return true;
          
          const rightHeadlineUntilDate = new Date(value);
          if (isNaN(rightHeadlineUntilDate.getTime())) return true;
          
          const now = new Date();
          const threeDaysFromNow = new Date(now);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
          
          if (rightHeadlineUntilDate > threeDaysFromNow) {
            return "Warning: Right Headline Until date is more than 3 days away. This may keep the article in the right headline section longer than intended. Recommended: 24-48 hours.";
          }
          
          if (rightHeadlineUntilDate < now) {
            return "Right Headline Until date is in the past. The article will be immediately removed from the right headline section.";
          }
          
          return true;
        }),
    }),
    defineField({
      name: "justIn",
      title: "Just In",
      type: "boolean",
      initialValue: false,
      description: "Show this post in the 'Just in' section. Auto-sets Just In Until to 24 hours (adjustable).",
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          if (value) {
            if (doc?.mainHeadline) {
              return "Cannot be both Just In and Main Headline at the same time";
            }
            if (doc?.frontline) {
              return "Cannot be both Just In and Front Page (More Top Headlines) Section at the same time";
            }
            if (doc?.rightHeadline) {
              return "Cannot be both Just In and Right Headline at the same time";
            }
            // Validate justInUntil if set
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
      title: "Just In Rank",
      type: "number",
      description: "Higher number shows earlier in the Just In section (e.g., 10 = top).",
      hidden: ({ parent }) => !parent?.justIn,
      validation: (rule) => rule.min(0).max(10),
    }),
    defineField({
      name: "justInUntil",
      title: "Just In Until",
      type: "datetime",
      description: "Auto-removes from Just In after this date. Required when Just In is enabled. Recommended: 24-48 hours (max 3 days).",
      hidden: ({ parent }) => !parent?.justIn,
      validation: (rule) =>
        rule.custom((value, ctx) => {
          const doc = ctx.document as any;
          
          // Required when justIn is enabled
          if (doc?.justIn && !value) {
            return "Just In Until is required when Just In is enabled.";
          }
          
          // Allow clearing the field if justIn is disabled
          if (!value) return true;
          
          // Validate that value is a valid date string
          if (typeof value !== 'string') return true;
          
          const justInUntilDate = new Date(value);
          if (isNaN(justInUntilDate.getTime())) return true;
          
          const now = new Date();
          const threeDaysFromNow = new Date(now);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
          
          if (justInUntilDate > threeDaysFromNow) {
            return "Warning: Just In Until date is more than 3 days away. This may keep the article in the Just In section longer than intended. Recommended: 24-48 hours.";
          }
          
          if (justInUntilDate < now) {
            return "Just In Until date is in the past. The article will be immediately removed from the Just In section.";
          }
          
          return true;
        }),
    }),
    defineField({
      name: "breakingNews",
      title: "Breaking News",
      type: "boolean",
      initialValue: false,
      description: "Mark this as breaking news.",
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
      title: "Developing Story",
      type: "boolean",
      initialValue: false,
      description: "Mark this as a developing story.",
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
      initialValue: false,
      description: "Editorial boost to increase relevance/visibility in Hero, Search, etc.",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(4),
    }),
    defineField({
      name: "tickerTitle",
      title: "Ticker title (short)",
      type: "string",
      description: "Very short version for the top news ticker (max ±40 characters).",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "string",
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: "cover",
      title: "Cover",
      type: "object",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "source",
          title: "Source",
          type: "string",
          options: {
            list: [
              { title: "Upload / Asset", value: "asset" },
              { title: "External URL", value: "external" },
            ],
            layout: "radio",
            direction: "horizontal",
          },
          initialValue: "asset",
          validation: (rule: any) => rule.required(),
        }),
        defineField({
          name: "externalUrl",
          title: "External image URL",
          type: "url",
          description:
            "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
          hidden: ({ parent }: { parent?: { source?: string } }) => parent?.source !== "external",
          validation: (rule: any) =>
            rule.custom((value: string | undefined, ctx: any) => {
              const parent = ctx.parent as any;
              if (parent?.source === "external") {
                if (!value) return "External image URL is required";
              }
              return true;
            }),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
            },
          ],
          hidden: ({ parent }: { parent?: { source?: string } }) => parent?.source !== "asset",
          validation: (rule: any) =>
            rule.custom((value: any, ctx: any) => {
              const parent = ctx.parent as any;
              if (parent?.source === "asset") {
                if (!value?.asset?._ref) return "Select or upload an image";
              }
              return true;
            }),
        } as any),
        defineField({
          name: "alt",
          title: "Alt text (cover)",
          type: "string",
          description:
            "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
          validation: (rule: any) =>
            rule.custom((val: string | undefined, ctx: any) => {
              const parent = ctx.parent as any;
              const usingExternal = parent?.source === "external" && parent?.externalUrl;
              const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
              if (usingExternal && !val) return "Alt text is required for external images";
              const nestedAlt = parent?.image?.alt;
              if (usingAsset && !nestedAlt && !val) {
                return "Alt text is required (fill nested alt or this field)";
              }
              return true;
            }),
        }),
        defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
        // ✅ Minimal image attribution fields (Wikimedia Commons compliant)
        defineField({
          name: "creditProvider",
          title: "Credit Provider",
          type: "string",
          description: 'Optional. Example: "Wikimedia Commons", "Pexels".',
        }),
        defineField({
          name: "creditAuthor",
          title: "Credit Author",
          type: "string",
          description: "Optional. Photographer/creator name (e.g., Timothy Powaleny).",
        }),
        defineField({
          name: "creditSourceUrl",
          title: "Credit Source URL",
          type: "url",
          description: "Optional. Link to the photo page (Commons file page / Pexels photo page).",
        }),
        defineField({
          name: "creditLicense",
          title: "Credit License",
          type: "string",
          description: 'Optional. Example: "CC BY-SA 4.0", "CC BY 4.0", "Pexels", "Public Domain".',
        }),
      ],
      validation: (rule: any) =>
        rule.custom((cover: any, ctx: any) => {
          const doc = ctx.document as any;
          const usingExternal = cover?.source === "external" && !!cover?.externalUrl;
          const coverImage = cover?.image as any;
          const usingAsset = cover?.source === "asset" && coverImage?.asset?._ref;
          const isPublishing = doc?.status === "published";
          if (isPublishing && !(usingExternal || usingAsset)) {
            return "Provide a cover image (external URL or uploaded asset) before publishing";
          }
          return true;
        }),
      description: "Upload image or paste external URL. Alt text required. Optional licensing fields for Wikimedia/CC attribution.",
    } as any),
    // Removed legacy top-level epigraph/imageSource (use cover.epigraph/imageSource)
    // Removed legacy top-level epigraph/imageSource (use cover.epigraph/imageSource)
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the post to show up in the preview",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value: string, context: any) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "bodyTextOne", title: "Main Text", type: "array", of: [{ type: "block" }], validation: (rule: any) => rule.required() } as any),
    defineField({
      name: "bodyBlocks",
      title: "Content Blocks",
      type: "array",
      description: "Add blocks of content (text + image pairs). Click 'Add Block' to add a new block. Click the X button or click outside the modal to save and close.",
      options: {
        modal: {
          type: "dialog",
          width: 800,
        },
      },
      of: [
        {
          type: "object",
          name: "bodyBlock",
          title: "Content Block",
          options: {
            modal: {
              type: "dialog",
              width: "large",
            },
          },
          fields: [
            defineField({
              name: "bodyText",
              title: "Body Text",
              type: "array",
              of: [{ type: "block" }],
              description: "Text content for this block",
            } as any),
            defineField({
              name: "bodyImage",
              title: "Body Image",
              type: "object",
              options: { collapsible: false },
              description: "Optional image for this block",
              fields: [
                defineField({
                  name: "source",
                  title: "Source",
                  type: "string",
                  options: {
                    list: [
                      { title: "Upload / Asset", value: "asset" },
                      { title: "External URL", value: "external" },
                    ],
                    layout: "radio",
                    direction: "horizontal",
                  },
                  initialValue: "asset",
                  validation: (rule: any) => rule.custom((value: string | undefined, ctx: any) => {
                    const parent = ctx.parent as any;
                    // Only require if image is being used
                    const hasImage = parent?.image?.asset?._ref || parent?.externalUrl;
                    if (hasImage && !value) {
                      return "Source is required when an image is provided";
                    }
                    return true;
                  }),
                }),
                defineField({
                  name: "externalUrl",
                  title: "External image URL",
                  type: "url",
                  description:
                    "Paste a direct image URL (e.g., Wikimedia Commons). Must be a direct file URL (http/https).",
                  hidden: ({ parent }: { parent?: { source?: string } }) => parent?.source !== "external",
                  validation: (rule: any) =>
                    rule.custom((value: string | undefined, ctx: any) => {
                      const parent = ctx.parent as any;
                      if (parent?.source === "external") {
                        if (!value) return "External image URL is required";
                      }
                      return true;
                    }),
                }),
                defineField({
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true, aiAssist: { imageDescriptionField: "alt" } },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alternative text",
                      description: "Important for SEO and accessibility.",
                    },
                  ],
                  hidden: ({ parent }: { parent?: { source?: string } }) => parent?.source !== "asset",
                  validation: (rule: any) =>
                    rule.custom((value: any, ctx: any) => {
                      const parent = ctx.parent as any;
                      if (parent?.source === "asset") {
                        if (!value?.asset?._ref) return "Select or upload an image";
                      }
                      return true;
                    }),
                } as any),
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                  description:
                    "Describe the image for screen readers. Required if an external URL is used or an asset is present without nested alt.",
                  validation: (rule: any) =>
                    rule.custom((val: string | undefined, ctx: any) => {
                      const parent = ctx.parent as any;
                      const usingExternal = parent?.source === "external" && parent?.externalUrl;
                      const usingAsset = parent?.source === "asset" && parent?.image?.asset?._ref;
                      if (usingExternal && !val) return "Alt text is required for external images";
                      const nestedAlt = parent?.image?.alt;
                      if (usingAsset && !nestedAlt && !val) {
                        return "Alt text is required (fill nested alt or this field)";
                      }
                      return true;
                    }),
                }),
                defineField({ name: "epigraph", title: "Epigraph", type: "string" }),
                // ✅ Minimal image attribution fields (Wikimedia Commons compliant)
                defineField({
                  name: "creditProvider",
                  title: "Credit Provider",
                  type: "string",
                  description: 'Optional. Example: "Wikimedia Commons", "Pexels".',
                }),
                defineField({
                  name: "creditAuthor",
                  title: "Credit Author",
                  type: "string",
                  description: "Optional. Photographer/creator name (e.g., Timothy Powaleny).",
                }),
                defineField({
                  name: "creditSourceUrl",
                  title: "Credit Source URL",
                  type: "url",
                  description: "Optional. Link to the photo page (Commons file page / Pexels photo page).",
                }),
                defineField({
                  name: "creditLicense",
                  title: "Credit License",
                  type: "string",
                  description: 'Optional. Example: "CC BY-SA 4.0", "CC BY 4.0", "Pexels", "Public Domain".',
                }),
              ],
            } as any),
          ],
          preview: {
            select: {
              hasText: "bodyText",
              hasImage: "bodyImage",
            },
            prepare({ hasText, hasImage }: any) {
              const textPreview = hasText && Array.isArray(hasText) && hasText.length > 0
                ? hasText[0]?.children?.[0]?.text || "Text content"
                : "No text";
              const imagePreview = hasImage ? "📷" : "";
              return {
                title: `Block: ${textPreview} ${imagePreview}`,
              };
            },
          },
        },
      ],
    } as any),
    defineField({ name: "date", title: "Date", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "status", title: "Status", type: "string", options: { list: ["draft", "scheduled", "published"] }, initialValue: "draft" }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime", description: 'Use for ordering/SEO. Keep "date" for legacy if needed.', initialValue: () => new Date().toISOString(), validation: (rule) => rule.custom((val, ctx) => (ctx.document as any)?.status === "published" && !val ? "publishedAt is required when status is published" : true) }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }] } as any),
    defineField({ name: "priority", title: "Priority", type: "number", description: "A higher number (0–10) boosts the article in curated rails (e.g., relevance-based search results).", validation: (rule) => rule.min(0).max(10) }),
    defineField({ name: "readTime", title: "Estimated read time (min)", type: "number" }),
    defineField({ name: "viewsAll", title: "Views (all time)", type: "number", initialValue: 0, readOnly: true }),
    defineField({ name: "views30d", title: "Views (30 days)", type: "number", initialValue: 0, readOnly: true }),
    defineField({ name: "views7d", title: "Views (7 days)", type: "number", initialValue: 0, readOnly: true }),
    defineField({ name: "labels", title: "Labels (internal)", type: "array", of: [{ type: "string" }], options: { layout: "tags", list: [{ title: "breaking", value: "breaking" }, { title: "analysis", value: "analysis" }, { title: "opinion", value: "opinion" }, { title: "exclusive", value: "exclusive" }, { title: "sponsored", value: "sponsored" }, { title: "live", value: "live" }] }, description: "Internal flags for curation/badges; not used for public search." } as any),
    defineField({ name: "bodyRich", title: "Body (rich, portable text)", type: "blockContent" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      mediaCoverAsset: "cover.image",
      featured: "featured",
      date: "publishedAt",
    },
    prepare(selection) {
      const { author, featured, date, mediaCoverAsset } = selection as any;
      const bits: string[] = [];
      if (author) bits.push(`by ${author}`);
      if (date) bits.push(new Date(date).toLocaleDateString());
      if (featured) bits.push("★ Featured");
      const media = mediaCoverAsset || undefined;
      return { ...selection, media, subtitle: bits.join(" • ") };
    },
  },
});

