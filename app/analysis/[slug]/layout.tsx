import type { ReactNode } from "react";
import { newsreader } from "@/app/lib/fonts/body";

export default function AnalysisArticleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className={newsreader.variable}>{children}</div>;
}
