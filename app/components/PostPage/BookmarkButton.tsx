import { getBookmarkStatus } from "@/app/lib/bookmarks/get-bookmark-status";
import BookmarkButtonClient from "./bookmark-button-client";

interface BookmarkButtonProps {
  articleId: string;
  articleSlug: string;
  articleTitle?: string;
  variant?: "default" | "compact";
}

export default async function BookmarkButton({
  articleId,
  articleSlug,
  articleTitle,
  variant = "default",
}: BookmarkButtonProps) {
  const { bookmarked } = await getBookmarkStatus(articleId);

  return (
    <BookmarkButtonClient
      articleId={articleId}
      articleSlug={articleSlug}
      articleTitle={articleTitle}
      initialBookmarked={bookmarked}
      variant={variant}
    />
  );
}
