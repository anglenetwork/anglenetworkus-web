import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  variant?: "default" | "gradient";
}

export function SectionHeader({
  title,
  href,
  variant = "gradient",
}: SectionHeaderProps) {
  if (variant === "gradient") {
    const content = (
      <div className="flex flex-col items-start gap-1.5 w-full mb-6">
        <h2 className="text-sm font-sans font-medium uppercase tracking-wide text-foreground">
          {title}
        </h2>
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 to-transparent" />
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

  // Default variant (dot + border)
  const content = (
    <div className="flex items-center mb-4">
      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
      <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-sans">
        {title}
      </h2>
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
