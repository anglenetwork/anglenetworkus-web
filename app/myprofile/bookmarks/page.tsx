"use client";

import { BookmarksList } from "../components/BookmarksList";

export default function BookmarksPage() {
  return (
    <div>
      <div className="mb-8 sm:mb-12">
        <h1 className="mb-2 font-sans font-semibold text-2xl text-slate-900 sm:text-3xl">
          Bookmarks
        </h1>
        <p className="font-sans text-slate-600 text-sm sm:text-base">
          Your saved articles in one place.
        </p>
      </div>
      <BookmarksList />
    </div>
  );
}
