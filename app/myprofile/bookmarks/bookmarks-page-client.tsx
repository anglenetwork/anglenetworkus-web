"use client";

import {
  BookmarksList,
  type BookmarkListItem,
} from "../components/BookmarksList";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";

export default function BookmarksPageClient({
  initialBookmarks,
}: {
  initialBookmarks: BookmarkListItem[];
}) {
  return (
    <div>
      <ProfileSectionHeader
        title="Bookmarks"
        description="Your saved articles in one place"
      />
      <BookmarksList initialBookmarks={initialBookmarks} />
    </div>
  );
}
