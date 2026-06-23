import BookmarkButton from "../BookmarkButton";
import SocialShareButtons from "../SocialShareButtons";

interface ArticleActionsProps {
  articleId?: string;
  slug?: string;
  title: string;
  shareUrl: string;
}

export default function ArticleActions({
  articleId,
  slug,
  title,
  shareUrl,
}: ArticleActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {articleId && slug && (
        <BookmarkButton
          articleId={articleId}
          articleSlug={slug}
          articleTitle={title}
        />
      )}
      {slug && shareUrl && <SocialShareButtons title={title} url={shareUrl} />}
    </div>
  );
}
