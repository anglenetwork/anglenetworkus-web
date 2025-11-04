import * as React from "react";
import { cn } from "@/lib/utils";

interface BreakingNewsLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "shimmer";
  text: string;
}

function BreakingNewsLabel({
  className,
  variant = "default",
  text,
  ...props
}: BreakingNewsLabelProps) {
  return (
    <div
      className={cn(
        "font-secondary relative inline-flex items-center justify-center rounded-xs bg-red-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white overflow-hidden",
        variant === "shimmer" && "shimmer-container",
        className
      )}
      {...props}
    >
      {variant === "shimmer" && (
        <div className="absolute inset-0 shimmer-sweep" />
      )}
      <span className="relative z-10">{text}</span>
    </div>
  );
}

export { BreakingNewsLabel };
