import { defineField, defineType } from "sanity";

export default defineType({
  name: "pullQuote",
  title: "Pull Quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
    }),
    defineField({
      name: "sourceLabel",
      title: "Role / Source Label",
      type: "string",
    }),
  ],
  preview: {
    select: {
      quote: "quote",
      attribution: "attribution",
    },
    prepare({ quote, attribution }: any) {
      return {
        title: quote || "Pull Quote",
        subtitle: attribution ? `- ${attribution}` : undefined,
      };
    },
  },
});
