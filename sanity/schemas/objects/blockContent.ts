import { defineType, defineArrayMember } from "sanity";

export default defineType({
  name: "blockContent",
  title: "Article Body Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", title: "URL" }],
          },
        ],
      },
      lists: [
        { title: "Bulleted List", value: "bullet" },
        { title: "Numbered List", value: "number" },
      ],
    }),
    defineArrayMember({
      type: "editorialImage",
    }),
    defineArrayMember({ type: "pullQuote" }),
    defineArrayMember({ type: "articleDivider" }),
    defineArrayMember({ type: "videoEmbed" }),
  ],
});
