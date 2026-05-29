import type { Metadata } from "next";
import { getSignInGalleryItems } from "@/app/lib/sign-in-gallery";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import SignInPageClient from "./sign-in-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Sign In",
    "Sign in to your The Angle account to manage bookmarks, subscriptions, and profile settings.",
    "/signin",
    { private: true },
  );
}

export default async function SignInPage() {
  const initialGalleryItems = await getSignInGalleryItems();
  return <SignInPageClient initialGalleryItems={initialGalleryItems} />;
}
