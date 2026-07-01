import Link from "next/link";
import { cn } from "@/lib/utils";

type WordmarkProps = {
  theme?: "light" | "dark";
  className?: string;
  titleClassName?: string;
  showDot?: boolean;
};

export function Wordmark({
  theme = "light",
  className,
  titleClassName,
  showDot = true,
}: WordmarkProps) {
  const textColor = theme === "light" ? "text-zinc-900" : "text-white";

  return (
    <span
      className={cn(
        "font-bold font-display text-[22px] uppercase leading-none tracking-[-0.01em]",
        textColor,
        className,
        titleClassName,
      )}
    >
      The Angle
      {showDot ? (
        <span
          className="ml-px inline-block size-1.5 translate-y-[-6px] rounded-full bg-blue-600"
          aria-hidden
        />
      ) : null}
    </span>
  );
}

interface LogoProps {
  variant?: "default" | "logo-only";
}

export function Logo({ variant = "default" }: LogoProps) {
  if (variant === "logo-only") {
    return (
      <Link href="/" className="flex items-center">
        <Wordmark titleClassName="text-3xl" />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex shrink-0 items-center">
      <Wordmark />
    </Link>
  );
}
