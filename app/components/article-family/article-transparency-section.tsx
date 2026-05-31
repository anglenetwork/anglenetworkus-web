import {
  nonRegularPostTransparencyBody,
  nonRegularPostTransparencyHeading,
  nonRegularPostTransparencySubheading,
} from "@/app/lib/typography/posts";
import { cn } from "@/lib/utils";

type ArticleTransparencySectionProps = {
  methodologyNote?: string | null;
  sourcesNote?: string | null;
  className?: string;
};

export function ArticleTransparencySection({
  methodologyNote,
  sourcesNote,
  className,
}: ArticleTransparencySectionProps) {
  if (!methodologyNote && !sourcesNote) return null;

  return (
    <section
      className={cn(
        "not-prose mt-10 border-neutral-200 border-t pt-8",
        className,
      )}
      aria-labelledby="transparency-heading"
    >
      <h2
        id="transparency-heading"
        className={cn("mb-4", nonRegularPostTransparencyHeading)}
      >
        Context and transparency
      </h2>
      {methodologyNote && (
        <div className="mb-4">
          <h3 className={cn("mb-1", nonRegularPostTransparencySubheading)}>
            Methodology
          </h3>
          <p
            className={cn("whitespace-pre-wrap", nonRegularPostTransparencyBody)}
          >
            {methodologyNote}
          </p>
        </div>
      )}
      {sourcesNote && (
        <div>
          <h3 className={cn("mb-1", nonRegularPostTransparencySubheading)}>
            Sources
          </h3>
          <p
            className={cn("whitespace-pre-wrap", nonRegularPostTransparencyBody)}
          >
            {sourcesNote}
          </p>
        </div>
      )}
    </section>
  );
}
