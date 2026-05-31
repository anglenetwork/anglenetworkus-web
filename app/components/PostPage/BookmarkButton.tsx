import { getBookmarkStatus } from "@/app/lib/bookmarks/get-bookmark-status";
import BookmarkButtonClient from "./bookmark-button-client";

interface BookmarkButtonProps {
  articleId: string;
  articleSlug: string;
  variant?: "default" | "compact";
}

export default async function BookmarkButton({
  articleId,
  articleSlug,
  variant = "default",
}: BookmarkButtonProps) {
  const { bookmarked } = await getBookmarkStatus(articleId);

  return (
    <BookmarkButtonClient
      articleId={articleId}
      articleSlug={articleSlug}
      initialBookmarked={bookmarked}
      variant={variant}
    />
  );
}
