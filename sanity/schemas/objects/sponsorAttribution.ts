import { defineField, defineType } from "sanity";

export default defineType({
  name: "sponsorAttribution",
  title: "Sponsor Attribution",
  type: "object",
  fields: [
    defineField({
      name: "sponsorName",
      title: "Sponsor Name",
      type: "string",
      description:
        "Brand or organization paying for or partnering on this content (shown in bylines and listings).",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "sponsorUrl",
      title: "Sponsor URL",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }).custom((value) => {
          if (value === undefined || value === null || value === "")
            return true;
          return true;
        }),
    }),
    defineField({
      name: "disclosure",
      title: "Disclosure",
      type: "text",
      rows: 3,
      description:
        "Visible to readers: clearly state paid/partner/sponsored nature and any material relationships. Required for compliance and trust; keep plain language.",
      validation: (rule) => rule.required().max(300),
    }),
  ],
});
