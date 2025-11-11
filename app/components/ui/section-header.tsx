import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  variant?: "gradient";
}

export function SectionHeader({
  title,
  href,
  variant = "gradient",
}: SectionHeaderProps) {
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
