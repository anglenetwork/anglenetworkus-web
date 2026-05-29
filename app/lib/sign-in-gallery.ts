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

    return posts
      .map((post: {
        _id?: string;
        title?: string;
        slug?: string | null;
        cover?: Parameters<typeof getCoverImage>[0];
      }) => {
        if (!post?._id || !post?.title) return null;

        const coverImage = getCoverImage(post.cover, post.title);

        return {
          id: post._id,
          title: post.title,
          slug: post.slug ?? null,
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
