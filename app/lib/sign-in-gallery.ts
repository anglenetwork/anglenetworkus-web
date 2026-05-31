import { sanityFetch } from "@/sanity/lib/fetch";
import { mainHeadlinesQuery } from "@/sanity/lib/queries";
import { getCoverImage } from "@/sanity/lib/utils";

export type SignInGalleryItem = {
  id: string;
  title: string;
  slug: string | null;
  image: string;
  description: string;
};

export async function getSignInGalleryItems(): Promise<SignInGalleryItem[]> {
  try {
    const posts = await sanityFetch({
      query: mainHeadlinesQuery,
    });

    if (!Array.isArray(posts)) return [];

    return (posts as unknown[])
      .map((post) => {
        if (!post || typeof post !== "object") return null;
        const row = post as {
          _id?: string;
          title?: string | null;
          slug?: string | null;
          cover?: Parameters<typeof getCoverImage>[0];
        };
        if (!row._id || !row.title) return null;

        const coverImage = getCoverImage(row.cover, row.title);

        return {
          id: row._id,
          title: row.title,
          slug: row.slug ?? null,
          image: coverImage?.src ?? "/placeholder.svg",
          description: "",
        };
      })
      .filter((item): item is SignInGalleryItem => item !== null);
  } catch (error) {
    console.error("Error fetching main headline posts:", error);
    return [];
  }
}
