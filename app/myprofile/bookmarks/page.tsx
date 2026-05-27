"use client";

import { BookmarksList } from "../components/BookmarksList";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";

export default function BookmarksPage() {
  return (
    <div>
      <ProfileSectionHeader
        title="Bookmarks"
        description="Your saved articles in one place."
      />
      <BookmarksList />
    </div>
  );
}
