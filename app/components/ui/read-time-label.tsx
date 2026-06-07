import { cn } from "@/lib/utils";
import {
  formatReadTimeLabel,
  readTimeLabelClassName,
  resolveReadTimeLabelVariant,
  type ReadTimeLabelVariant,
} from "@/app/lib/typography/read-time";

interface ReadTimeLabelProps {
  minutes?: number | null;
  variant?: ReadTimeLabelVariant | "light";
  className?: string;
  as?: "p" | "span";
}

export function ReadTimeLabel({
  minutes,
  variant = "default",
  className,
  as: Component = "p",
}: ReadTimeLabelProps) {
  return (
    <Component
      className={cn(
        readTimeLabelClassName(resolveReadTimeLabelVariant(variant)),
        className,
      )}
    >
      {formatReadTimeLabel(minutes)}
    </Component>
  );
}
