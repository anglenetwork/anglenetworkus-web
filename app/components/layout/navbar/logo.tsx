import Link from "next/link";

interface LogoProps {
  isScrolled?: boolean;
  variant?: "mobile" | "desktop";
}

export function Logo({ isScrolled = false, variant = "mobile" }: LogoProps) {
  if (variant === "mobile") {
    return (
      <Link href="/">
        <h1 className="font-bold text-blue-600 tracking-tight text-3xl font-sans">
          CURRENTS
        </h1>
      </Link>
    );
  }

  return (
    <Link href="/">
      <h1
        className={`font-bold text-blue-600 tracking-tight transition-all duration-500 ease-out font-sans ${
          isScrolled ? "lg:text-xl" : "lg:text-4xl"
        } text-4xl`}
      >
        CURRENTS
      </h1>
    </Link>
  );
}
