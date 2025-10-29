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
    const { categorySlug } = await request.json();

    if (!categorySlug) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 }
      );
    }

    // Find the category by slug
    const category = await writeClient.fetch(
      `*[_type == "category" && slug.current == $categorySlug][0] { _id, views }`,
      { categorySlug }
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Increment the views count
    const currentViews = category.views || 0;
    const newViews = currentViews + 1;

    // Update the category with the new views count
    await writeClient
      .patch(category._id)
      .set({ views: newViews })
      .commit();

    return NextResponse.json({
      success: true,
      views: newViews,
    });
  } catch (error) {
    console.error("Error tracking category view:", error);
    return NextResponse.json(
      { error: "Failed to track category view" },
      { status: 500 }
    );
  }
}
