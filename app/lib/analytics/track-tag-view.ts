import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import { writeToken } from "@/sanity/lib/token";

function getWriteClient() {
  if (!writeToken) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN for analytics mutations");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: writeToken,
    useCdn: false,
  });
}

export async function trackTagView(tagSlug: string): Promise<void> {
  if (!tagSlug.trim()) return;

  const writeClient = getWriteClient();
  const tag = await writeClient.fetch<{ _id: string; views?: number } | null>(
    `*[_type == "tag" && slug.current == $slug][0] { _id, views }`,
    { slug: tagSlug },
  );

  if (!tag) return;

  const newViews = (tag.views ?? 0) + 1;
  await writeClient.patch(tag._id).set({ views: newViews }).commit();
}
