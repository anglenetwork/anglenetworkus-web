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
        "inline-flex items-center justify-center rounded-full bg-angle-red px-3.5 py-[7px] font-bold font-mono text-[11px] text-white uppercase tracking-wide shadow-[0_2px_6px_rgba(20,24,28,0.18)]",
        className,
      )}
      {...props}
    >
      {text}
    </div>
  );
}

export { BreakingNewsLabel };
