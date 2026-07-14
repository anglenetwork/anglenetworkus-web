import * as React from "react";
import { cn } from "@/lib/utils";

interface BreakingNewsLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

function BreakingNewsLabel({
  className,
  text,
  ...props
}: BreakingNewsLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center bg-news-primary px-2 py-2 font-sans text-[11px] font-bold uppercase leading-none tracking-[0.08em] text-white",
        className,
      )}
      {...props}
    >
      {text}
    </div>
  );
}

export { BreakingNewsLabel };
