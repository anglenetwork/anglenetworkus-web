import { NextResponse } from "next/server";
import { getSignInGalleryItems } from "@/app/lib/sign-in-gallery";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getSignInGalleryItems();
  return NextResponse.json({ items }, { status: 200 });
}
