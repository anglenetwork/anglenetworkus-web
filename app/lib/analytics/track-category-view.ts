import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import { token } from "@/sanity/lib/token";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

export async function trackCategoryView(categorySlug: string): Promise<void> {
  if (!categorySlug.trim()) return;

  const category = await writeClient.fetch<{ _id: string; views?: number } | null>(
    `*[_type == "category" && slug.current == $categorySlug][0] { _id, views }`,
    { categorySlug },
  );

  if (!category) return;

  const newViews = (category.views ?? 0) + 1;
  await writeClient.patch(category._id).set({ views: newViews }).commit();
}
