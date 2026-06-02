"use client";

import dynamic from "next/dynamic";
import { DeferUntilNearViewport } from "@/app/components/ui/defer-until-near-viewport";
import { BelowFoldSectionPlaceholder } from "./below-fold-placeholder";
import {
  HomepageBelowFoldSections,
  type HomepageBelowFoldSectionsProps,
} from "./homepage-below-fold";
import { HOMEPAGE_BELOW_FOLD_SECTION_GAP } from "./homepage-below-fold-spacing";

const HomepageBelowFoldSectionsLazy = dynamic(
  () =>
    import("./homepage-below-fold").then((mod) => ({
      default: mod.HomepageBelowFoldSections,
    })),
  { ssr: false, loading: () => <BelowFoldSectionPlaceholder /> },
);

type HomepageBelowFoldLazyProps = HomepageBelowFoldSectionsProps;

function belowFoldPlaceholder(hasFourthSection: boolean) {
  return (
    <div className={HOMEPAGE_BELOW_FOLD_SECTION_GAP}>
      <BelowFoldSectionPlaceholder />
      <BelowFoldSectionPlaceholder />
      {hasFourthSection ? <BelowFoldSectionPlaceholder /> : null}
      <BelowFoldSectionPlaceholder />
    </div>
  );
}

/** Defers below-fold chunk download until the user scrolls near these sections. */
export function HomepageBelowFoldLazy(props: HomepageBelowFoldLazyProps) {
  const { secondSection, thirdSection, fourthSection, fifthSection, opinion } =
    props;

  return (
    <div className={HOMEPAGE_BELOW_FOLD_SECTION_GAP}>
      <DeferUntilNearViewport
        fallback={belowFoldPlaceholder(fourthSection != null)}
      >
        <div className={HOMEPAGE_BELOW_FOLD_SECTION_GAP}>
          <HomepageBelowFoldSectionsLazy
            secondSection={secondSection}
            thirdSection={thirdSection}
            fourthSection={fourthSection}
            fifthSection={fifthSection}
            opinion={opinion}
          />
        </div>
      </DeferUntilNearViewport>
    </div>
  );
}
