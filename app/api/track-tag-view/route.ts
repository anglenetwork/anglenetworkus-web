import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import { token } from "@/sanity/lib/token";

// Create a client with write permissions
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Tag slug is required" },
        { status: 400 }
      );
    }

    // Find the tag by slug
    const tag = await writeClient.fetch(
      `*[_type == "tag" && slug.current == $slug][0] { _id, views }`,
      { slug }
    );

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    // Increment the views count
    const currentViews = tag.views || 0;
    const newViews = currentViews + 1;

    // Update the tag with the new views count
    await writeClient
      .patch(tag._id)
      .set({ views: newViews })
      .commit();

    return NextResponse.json({
      success: true,
      views: newViews,
    });
  } catch (error) {
    console.error("Error tracking tag view:", error);
    return NextResponse.json(
      { error: "Failed to track tag view" },
      { status: 500 }
    );
  }
}
