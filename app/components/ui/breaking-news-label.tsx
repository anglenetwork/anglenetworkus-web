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
        "inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-red-500 to-red-800 px-4 py-1.5 font-sans font-semibold text-white text-xs uppercase tracking-wide",
        className,
      )}
      {...props}
    >
      {text}
    </div>
  );
}

export { BreakingNewsLabel };
