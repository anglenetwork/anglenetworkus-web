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
        <div className="bg-red-600 px-3 py-1 rounded flex items-center gap-2">
          <Image
            src="/angle-logo.svg"
            alt="The Angle Logo"
            width={30}
            height={18}
            className="flex-shrink-0"
          />
          <h1 className="font-bold text-white tracking-tight text-3xl font-sans">
            The Angle
          </h1>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-2">
      <div
        className={`bg-red-600 px-3 py-1 rounded flex items-center gap-2 transition-all duration-500 ease-out ${
          isScrolled ? "lg:px-2 lg:py-0.5" : ""
        }`}
      >
        <Image
          src="/angle-logo.svg"
          alt="The Angle Logo"
          width={isScrolled ? 20 : 40}
          height={isScrolled ? 12 : 24}
          className="flex-shrink-0 transition-all duration-500 ease-out"
        />
        <h1
          className={`font-bold text-white tracking-tight transition-all duration-500 ease-out font-sans ${
            isScrolled ? "lg:text-xl" : "lg:text-4xl"
          } text-4xl`}
        >
          The Angle
        </h1>
      </div>
    </Link>
  );
}
