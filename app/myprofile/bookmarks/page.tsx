"use client";

import { BookmarksList } from "../components/BookmarksList";

export default function BookmarksPage() {
  return (
    <div>
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2 font-sans">
          Bookmarks
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-sans">
          Your saved articles in one place.
        </p>
      </div>
      <BookmarksList />
    </div>
  );
}
