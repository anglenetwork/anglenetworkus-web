import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { mainHeadlinesQuery } from "@/sanity/lib/queries";
import { getCoverImage } from "@/sanity/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await sanityFetch({
      query: mainHeadlinesQuery,
    });

    if (!Array.isArray(posts)) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const galleryItems = posts
      .map((post: any) => {
        if (!post?._id || !post?.title) {
          return null;
        }

        const coverImage = getCoverImage(post.cover, post.title);

        return {
          id: post._id,
          title: post.title,
          slug: post.slug || null,
          image: coverImage?.src || "/placeholder.svg",
          description: "", // Optional, can be empty
        };
      })
      .filter(
        (
          item,
        ): item is {
          id: string;
          title: string;
          slug: string | null;
          image: string;
          description: string;
        } => item !== null,
      );

    return NextResponse.json({ items: galleryItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching main headline posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch main headline posts", items: [] },
      { status: 500 },
    );
  }
}
