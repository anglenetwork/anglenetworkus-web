"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { BelowFoldSectionPlaceholder } from "./below-fold-placeholder";

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

const SixthSection = dynamic(() => import("./SixthSection/sixthSection"), {
  ssr: false,
  loading: () => <BelowFoldSectionPlaceholder />,
});

const SeventhSection = dynamic(
  () => import("./SeventhSection/seventhSection"),
  {
    ssr: false,
    loading: () => <BelowFoldSectionPlaceholder />,
  },
);

type SecondSectionProps = ComponentProps<typeof SecondSection>;
type ThirdSectionProps = ComponentProps<typeof ThirdSection>;
type FourthSectionProps = ComponentProps<typeof FourthSection>;
type FifthSectionProps = ComponentProps<typeof FifthSection>;
type SixthSectionProps = ComponentProps<typeof SixthSection>;
type SeventhSectionProps = ComponentProps<typeof SeventhSection>;

/** Below-fold homepage sections in scroll order (matches section N file names). */
export type HomepageBelowFoldSectionsProps = {
  secondSection: SecondSectionProps;
  thirdSection: ThirdSectionProps;
  fourthSection: FourthSectionProps | null;
  fifthSection: FifthSectionProps;
  sixthSection: SixthSectionProps | null;
  seventhSection: SeventhSectionProps;
  opinion?: ReactNode;
};

export function HomepageBelowFoldSections({
  secondSection,
  thirdSection,
  fourthSection,
  fifthSection,
  sixthSection,
  seventhSection,
  opinion,
}: HomepageBelowFoldSectionsProps) {
  return (
    <>
      <div>
        <SecondSection {...secondSection} />
        <ThirdSection {...thirdSection} />
      </div>
      {fourthSection ? <FourthSection {...fourthSection} /> : null}
      <FifthSection {...fifthSection} />
      {opinion}
      {sixthSection ? <SixthSection {...sixthSection} /> : null}
      <SeventhSection {...seventhSection} />
    </>
  );
}
