"use client";

import { BookmarksList } from "../components/BookmarksList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookmarksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans text-2xl">Bookmarks</CardTitle>
      </CardHeader>
      <CardContent>
        <BookmarksList />
      </CardContent>
    </Card>
  );
}
