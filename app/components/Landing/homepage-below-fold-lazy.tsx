"use client";

import dynamic from "next/dynamic";
import { DeferUntilNearViewport } from "@/app/components/ui/defer-until-near-viewport";
import { SecondSectionSkeleton } from "./below-fold-placeholder";
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
  { ssr: false, loading: () => <SecondSectionSkeleton /> },
);

type HomepageBelowFoldLazyProps = HomepageBelowFoldSectionsProps;

/** Defers below-fold chunk download until the user scrolls near these sections. */
export function HomepageBelowFoldLazy(props: HomepageBelowFoldLazyProps) {
  return (
    <DeferUntilNearViewport fallback={<SecondSectionSkeleton />}>
      <div className={HOMEPAGE_BELOW_FOLD_SECTION_GAP}>
        <HomepageBelowFoldSectionsLazy {...props} />
      </div>
    </DeferUntilNearViewport>
  );
}
