import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  isScrolled?: boolean;
  variant?: "mobile" | "desktop";
}

export function Logo({ isScrolled = false, variant = "mobile" }: LogoProps) {
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
      <div
        className={`flex items-center gap-2 transition-all duration-500 ease-out ${
          isScrolled ? "lg:gap-1.5" : ""
        }`}
      >
        <Image
          src="/black-logo.svg"
          alt="The Angle Logo"
          width={isScrolled ? 24 : 48}
          height={isScrolled ? 24 : 48}
          className="flex-shrink-0 transition-all duration-500 ease-out"
        />
        <h1
          className={`font-bold text-neutral-900 tracking-tight transition-all duration-500 ease-out font-sans ${
            isScrolled ? "lg:text-xl" : "lg:text-xl"
          } text-4xl`}
        >
          The Angle
        </h1>
      </div>
    </Link>
  );
}
