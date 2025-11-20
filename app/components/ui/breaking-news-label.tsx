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
        "font-secondary inline-flex items-center justify-center rounded-xs bg-gradient-to-r from-red-500 to-red-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white",
        className
      )}
      {...props}
    >
      {text}
    </div>
  );
}

export { BreakingNewsLabel };
