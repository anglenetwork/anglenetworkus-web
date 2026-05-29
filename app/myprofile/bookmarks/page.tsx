import type { Metadata } from "next";
import { listUserBookmarks } from "@/app/lib/bookmarks/list-user-bookmarks";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import BookmarksPageClient from "./bookmarks-page-client";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Bookmarks",
    "Your saved articles and reading list on The Angle.",
    "/myprofile/bookmarks",
    { private: true },
  );
}

export default async function BookmarksPage() {
  const initialBookmarks = await listUserBookmarks();
  return <BookmarksPageClient initialBookmarks={initialBookmarks} />;
}
