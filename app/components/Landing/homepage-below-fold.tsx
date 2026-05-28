"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { DeferUntilNearViewport } from "@/app/components/ui/defer-until-near-viewport";

function BelowFoldSectionPlaceholder() {
  return (
    <div
      className="min-h-[280px] w-full animate-pulse rounded-md bg-neutral-100"
      aria-hidden
    />
  );
}

const SecondSection = dynamic(
  () => import("./FourthSection/fourthSection"),
  { ssr: false, loading: () => <BelowFoldSectionPlaceholder /> },
);

const ThirdSection = dynamic(
  () => import("./ThirdSection/thirdSection"),
  { ssr: false, loading: () => <BelowFoldSectionPlaceholder /> },
);

const FourthSection = dynamic(
  () => import("./ThirdSection/fifthSection"),
  { ssr: false, loading: () => <BelowFoldSectionPlaceholder /> },
);

const SixthSection = dynamic(
  () => import("./SecondSection/sixthSection"),
  { ssr: false, loading: () => <BelowFoldSectionPlaceholder /> },
);

type SecondSectionProps = ComponentProps<typeof SecondSection>;
type ThirdSectionProps = ComponentProps<typeof ThirdSection>;
type FourthSectionProps = ComponentProps<typeof FourthSection>;
type SixthSectionProps = ComponentProps<typeof SixthSection>;

export type HomepageBelowFoldTopProps = {
  secondSection: SecondSectionProps;
  thirdSection: ThirdSectionProps | null;
};

export type HomepageBelowFoldBottomProps = {
  fourthSection: FourthSectionProps;
  sixthSection: SixthSectionProps;
};

/** Category grids + US/Politics columns — loaded when scrolled near. */
export function HomepageBelowFoldTop({
  secondSection,
  thirdSection,
}: HomepageBelowFoldTopProps) {
  return (
    <DeferUntilNearViewport
      fallback={
        <>
          <BelowFoldSectionPlaceholder />
          {thirdSection ? <BelowFoldSectionPlaceholder /> : null}
        </>
      }
    >
      <SecondSection {...secondSection} />
      {thirdSection ? <ThirdSection {...thirdSection} /> : null}
    </DeferUntilNearViewport>
  );
}

/** Fifth + sixth sections — loaded when scrolled near. */
export function HomepageBelowFoldBottom({
  fourthSection,
  sixthSection,
}: HomepageBelowFoldBottomProps) {
  return (
    <DeferUntilNearViewport
      fallback={
        <>
          <BelowFoldSectionPlaceholder />
          <BelowFoldSectionPlaceholder />
        </>
      }
    >
      <FourthSection {...fourthSection} />
      <SixthSection {...sixthSection} />
    </DeferUntilNearViewport>
  );
}
