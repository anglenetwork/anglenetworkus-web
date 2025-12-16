import { defineField, defineType } from "sanity";

export default defineType({
  name: "topic",
  title: "Topic / Entity",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r: any) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96, isUnique: (v: string, c: any) => c.defaultIsUnique(v, c) },
      validation: (r: any) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: ["person", "organization", "place", "event", "team"] },
      initialValue: "person",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt" }],
    } as any),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
});
