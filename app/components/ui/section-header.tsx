import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  variant?: "light" | "dark";
  size?: "regular" | "large";
}

export function SectionHeader({
  title,
  href,
  variant = "light",
  size = "regular",
}: SectionHeaderProps) {
  const textColor = variant === "dark" ? "text-white" : "text-foreground";
  const fontSize = size === "large" ? "text-xl" : "text-sm";

  const content = (
    <div className="flex flex-col items-start gap-1.5 w-full mb-6">
      <h2
        className={`${fontSize} font-sans font-medium uppercase tracking-wide ${textColor}`}
      >
        {title}
      </h2>
      <div className="h-0.5 w-full bg-gradient-to-r from-red-600 to-transparent" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
