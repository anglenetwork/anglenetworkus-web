import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  variant?: "light" | "dark";
  size?: "regular" | "large";
  accentStyle?: "red-gradient" | "geometric-square" | "gradient-fade";
}

export function SectionHeader({
  title,
  subtitle,
  href,
  variant = "light",
  size = "regular",
  accentStyle = "gradient-fade",
}: SectionHeaderProps) {
  const textColor = variant === "dark" ? "text-white" : "text-foreground";
  const fontSize = size === "large" ? "text-lg" : "text-base";

  const renderAccent = () => {
    switch (accentStyle) {
      case "geometric-square":
        return <div className="w-2 h-2 bg-red-600 dark:bg-slate-100" />;
      case "red-gradient":
        return (
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 to-transparent" />
        );
      case "gradient-fade":
      default:
        return (
          <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-slate-900/0 dark:from-slate-100 dark:to-slate-100/0" />
        );
    }
  };

  // Special handling for geometric-square style
  if (accentStyle === "geometric-square") {
    const content = (
      <div className="flex flex-col items-start gap-3 w-full mb-6">
        <div className="flex items-center gap-3">
          {renderAccent()}
          <h2
            className={`${fontSize} font-sans font-bold uppercase tracking-wide ${textColor}`}
          >
            {title}
          </h2>
        </div>
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

  // Default container className
  const containerClassName =
    accentStyle === "gradient-fade"
      ? "flex flex-col items-start gap-3 w-full mb-6"
      : "flex flex-col items-start gap-1.5 w-full mb-6";

  const content = (
    <div className={containerClassName}>
      <h2
        className={`${fontSize} font-sans font-bold uppercase tracking-wide ${textColor}`}
      >
        {title}
      </h2>
      {renderAccent()}
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
