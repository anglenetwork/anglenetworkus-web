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

export async function trackCategoryView(categorySlug: string): Promise<void> {
  if (!categorySlug.trim()) return;

  const writeClient = getWriteClient();
  const category = await writeClient.fetch<{
    _id: string;
    views?: number;
  } | null>(
    `*[_type == "category" && slug.current == $categorySlug][0] { _id, views }`,
    { categorySlug },
  );

  if (!category) return;

  const newViews = (category.views ?? 0) + 1;
  await writeClient.patch(category._id).set({ views: newViews }).commit();
}
