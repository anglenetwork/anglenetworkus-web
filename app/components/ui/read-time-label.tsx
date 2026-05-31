import { cn } from "@/lib/utils";
import {
  formatReadTimeLabel,
  tagReadTimeLabel,
} from "@/app/lib/typography/tag-page";

interface ReadTimeLabelProps {
  minutes?: number | null;
  variant?: "light" | "dark";
  className?: string;
}

export function ReadTimeLabel({
  minutes,
  variant = "light",
  className,
}: ReadTimeLabelProps) {
  return (
    <p
      className={cn(
        tagReadTimeLabel,
        variant === "dark" ? "text-neutral-400" : "text-neutral-400",
        className,
      )}
    >
      {formatReadTimeLabel(minutes)}
    </p>
  );
}
