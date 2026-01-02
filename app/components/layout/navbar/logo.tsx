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
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/black-logo.svg"
            alt="The Angle Logo"
            width={30}
            height={30}
            className="flex-shrink-0"
          />
          <h1 className="font-bold text-neutral-900 tracking-tight text-3xl font-sans">
            The Angle
          </h1>
        </div>
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
        <h1 className="font-bold text-neutral-900 tracking-tight transition-all duration-500 ease-out font-sans lg:text-xl text-4xl">
          The Angle
        </h1>
      </div>
    </Link>
  );
}
