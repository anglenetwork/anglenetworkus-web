import { defineField, defineType } from "sanity";

export default defineType({
  name: "articleDivider",
  title: "Article Divider",
  type: "object",
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      initialValue: "line",
      options: {
        list: [
          { title: "Line", value: "line" },
          { title: "Spacer", value: "spacer" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      validation: (rule: any) => rule.required(),
    }),
  ],
  preview: {
    select: { style: "style" },
    prepare({ style }: any) {
      return { title: `Divider: ${style || "line"}` };
    },
  },
});
