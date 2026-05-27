import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "mobile" | "desktop" | "logo-only";
}

export function Logo({ variant = "mobile" }: LogoProps) {
  if (variant === "logo-only") {
    return (
      <Link href="/" className="flex items-center">
        <Image
          src="/black-logo.svg"
          alt="The Angle Logo"
          width={50}
          height={50}
          className="flex-shrink-0"
        />
      </Link>
    );
  }

  if (variant === "mobile") {
    return (
      <Link
        href="/"
        className="flex min-w-0 items-center justify-center gap-2 px-1"
      >
        <Image
          src="/black-logo.svg"
          alt="The Angle Logo"
          width={30}
          height={30}
          className="shrink-0"
        />
        <h1 className="truncate font-bold font-sans text-2xl text-neutral-900 tracking-tight sm:text-3xl">
          The Angle
        </h1>
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 transition-all duration-500 ease-out">
        <Image
          src="/black-logo.svg"
          alt="The Angle Logo"
          width={24}
          height={24}
          className="flex-shrink-0 transition-all duration-500 ease-out"
        />
        <h1 className="font-bold font-sans text-4xl text-neutral-900 tracking-tight transition-all duration-500 ease-out lg:text-xl">
          The Angle
        </h1>
      </div>
    </Link>
  );
}
