"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { BelowFoldSectionPlaceholder } from "./below-fold-placeholder";
import TestSection from "./TestSection/testSection";
import SecondSectionAlternative from "./SecondSection/secondSectionAlternative";

const SecondSection = dynamic(() => import("./SecondSection/secondSection"), {
  ssr: false,
  loading: () => <BelowFoldSectionPlaceholder />,
});

const ThirdSection = dynamic(() => import("./ThirdSection/thirdSection"), {
  ssr: false,
  loading: () => <BelowFoldSectionPlaceholder />,
});

const FourthSection = dynamic(() => import("./FourthSection/fourthSection"), {
  ssr: false,
  loading: () => <BelowFoldSectionPlaceholder />,
});

const FifthSection = dynamic(() => import("./FifthSection/fifthSection"), {
  ssr: false,
  loading: () => <BelowFoldSectionPlaceholder />,
});

type SecondSectionProps = ComponentProps<typeof SecondSection>;
type ThirdSectionProps = ComponentProps<typeof ThirdSection>;
type FourthSectionProps = ComponentProps<typeof FourthSection>;
type FifthSectionProps = ComponentProps<typeof FifthSection>;

/** Below-fold homepage sections in scroll order (matches section N file names). */
export type HomepageBelowFoldSectionsProps = {
  secondSection: SecondSectionProps;
  thirdSection: ThirdSectionProps;
  fourthSection: FourthSectionProps | null;
  fifthSection: FifthSectionProps;
};

export function HomepageBelowFoldSections({
  secondSection,
  thirdSection,
  fourthSection,
  fifthSection,
}: HomepageBelowFoldSectionsProps) {
  return (
    <>
      <SecondSection {...secondSection} />
      <TestSection />
      <SecondSectionAlternative />
      <ThirdSection {...thirdSection} />
      {fourthSection ? <FourthSection {...fourthSection} /> : null}
      <FifthSection {...fifthSection} />
    </>
  );
}

export type HomepageBelowFoldTopProps = Pick<
  HomepageBelowFoldSectionsProps,
  "secondSection" | "thirdSection" | "fourthSection"
>;

export type HomepageBelowFoldBottomProps = Pick<
  HomepageBelowFoldSectionsProps,
  "fifthSection"
>;
