import BookmarkButton from "../BookmarkButton";
import SocialShareButtons from "../SocialShareButtons";
import PostShareDialog from "../StandardPost/PostShareDialog";

const AUTHOR_ACTION_ICON_CLASS = "border border-news-border shadow-md";

interface ArticleActionsProps {
  articleId?: string;
  slug?: string;
  title: string;
  shareUrl: string;
  /** Collapse share icons into a dialog trigger below `lg` */
  shareInDialogBelowLg?: boolean;
}

export default function ArticleActions({
  articleId,
  slug,
  title,
  shareUrl,
  shareInDialogBelowLg = false,
}: ArticleActionsProps) {
  const showShare = Boolean(slug && shareUrl);

  return (
    <div className="flex items-center gap-2">
      {articleId && slug && (
        <BookmarkButton
          articleId={articleId}
          articleSlug={slug}
          articleTitle={title}
          className={shareInDialogBelowLg ? AUTHOR_ACTION_ICON_CLASS : undefined}
        />
      )}
      {showShare && shareInDialogBelowLg ? (
        <>
          <div className="hidden lg:block">
            <SocialShareButtons title={title} url={shareUrl} />
          </div>
          <PostShareDialog
            className={`lg:hidden ${AUTHOR_ACTION_ICON_CLASS}`}
            title={title}
            url={shareUrl}
          />
        </>
      ) : (
        showShare && <SocialShareButtons title={title} url={shareUrl} />
      )}
    </div>
  );
}
