import { defineField, defineType } from "sanity";

export default defineType({
  name: "videoEmbed",
  title: "Video Embed",
  type: "object",
  fields: [
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      initialValue: "generic",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
          { title: "Generic", value: "generic" },
        ],
      },
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
  ],
  preview: {
    select: {
      provider: "provider",
      title: "title",
      url: "url",
    },
    prepare({ provider, title, url }: any) {
      return {
        title: title || "Video Embed",
        subtitle: `${provider || "generic"} - ${url || ""}`,
      };
    },
  },
});
