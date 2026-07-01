import Link from "next/link";
import { cn } from "@/lib/utils";

type WordmarkProps = {
  theme?: "light" | "dark";
  className?: string;
  titleClassName?: string;
};

export function Wordmark({
  theme = "light",
  className,
  titleClassName,
}: WordmarkProps) {
  const textColor = theme === "light" ? "text-neutral-900" : "text-white";

  return (
    <span
      className={cn(
        "font-bold font-display uppercase leading-none tracking-tight",
        textColor,
        className,
        titleClassName,
      )}
    >
      The Angle
    </span>
  );
}

interface LogoProps {
  variant?: "mobile" | "desktop" | "logo-only";
}

export function Logo({ variant = "mobile" }: LogoProps) {
  if (variant === "logo-only") {
    return (
      <Link href="/" className="flex items-center">
        <Wordmark titleClassName="text-3xl" />
      </Link>
    );
  }

  if (variant === "mobile") {
    return (
      <Link href="/" className="flex min-w-0 items-center justify-center px-1">
        <Wordmark titleClassName="truncate text-xl sm:text-2xl" />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center">
      <Wordmark titleClassName="text-lg transition-all duration-500 ease-out lg:text-xl" />
    </Link>
  );
}
