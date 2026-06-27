import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";

export async function GET() {
  const draft = await draftMode();
  if (draft.isEnabled) {
    draft.disable();
  }
  return NextResponse.redirect(new URL("/", getPublicSiteUrl()));
}
