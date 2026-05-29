import type { Metadata } from "next";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import MyProfilePageClient from "./my-profile-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
  "My Profile",
  "Manage your The Angle account, bookmarks, and newsletter preferences.",
  "/myprofile",
  { private: true },
);
}

export default function MyProfilePage() {
  return <MyProfilePageClient />;
}
