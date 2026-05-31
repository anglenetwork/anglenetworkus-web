import type { ComponentProps } from "react";
import type { ArticleFamily } from "@/app/lib/article-family/types";
import PostBody from "@/app/components/PostPage/PostBody";
import { NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS } from "@/app/components/PostPage/PostBody/constants";
import {
  nonRegularPostAnalysisFocus,
  nonRegularPostDisclosure,
  nonRegularPostExcerpt,
  nonRegularPostTitle,
  nonRegularPostTypeLabel,
} from "@/app/lib/typography/posts";
import { cn } from "@/lib/utils";
import { ArticleTransparencySection } from "./article-transparency-section";

type EditorialArticleLayoutProps = {
  article: ArticleFamily;
  postBodyProps: ComponentProps<typeof PostBody>;
};

export function EditorialArticleLayout({
  article,
  postBodyProps,
}: EditorialArticleLayoutProps) {
  const showOpinionChrome = article._type === "opinion";
  const showAnalysisChrome = article._type === "analysis";

  return (
    <article className="mt-4 lg:mt-8">
      <header
        className={cn(
          "not-prose mb-2",
          NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS,
        )}
      >
        <div>
          <p className={cn("mb-2", nonRegularPostTypeLabel)}>
            {showOpinionChrome ? "Opinion" : "Analysis"}
          </p>
          <h1 className={nonRegularPostTitle}>{article.title || "Untitled"}</h1>
          {article.excerpt && (
            <p className={cn("mt-4 max-w-3xl", nonRegularPostExcerpt)}>
              {article.excerpt}
            </p>
          )}
        </div>

        {showAnalysisChrome && article.analysisFocus && (
          <p
            className={cn(
              "mt-3 max-w-3xl border-neutral-300 border-l-4 bg-neutral-100 py-2 pl-4",
              nonRegularPostAnalysisFocus,
            )}
          >
            {article.analysisFocus}
          </p>
        )}

        {showOpinionChrome && article.disclosure && (
          <aside
            className={cn(
              "mt-3 max-w-3xl border-neutral-300 border-l-4 bg-neutral-100 py-2 pl-4",
              nonRegularPostDisclosure,
            )}
          >
            {article.disclosure}
          </aside>
        )}
      </header>

      <PostBody {...postBodyProps} variant="editorial" />

      {showAnalysisChrome && (
        <ArticleTransparencySection
          methodologyNote={article.methodologyNote}
          sourcesNote={article.sourcesNote}
          className={NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS}
        />
      )}
    </article>
  );
}
