import { getPublishedId } from "sanity";

import { apiVersion } from "@/sanity/lib/api";

type SlugValue = string | { current?: string } | undefined;

export async function isUniqueSlugByType(
  slug: SlugValue,
  context: any,
): Promise<boolean> {
  const current = typeof slug === "string" ? slug : slug?.current;
  const document = context?.document;

  if (!document?._type || !current) {
    return true;
  }

  const publishedId = document._id ? getPublishedId(document._id) : "";
  const draftId = publishedId ? `drafts.${publishedId}` : "";
  const client = context.getClient({ apiVersion });

  const query = `
    !defined(*[
      _type == $type &&
      slug.current == $slug &&
      !(_id in [$publishedId, $draftId])
    ][0]._id)
  `;

  return client.fetch(query, {
    type: document._type,
    slug: current,
    publishedId,
    draftId,
  });
}
