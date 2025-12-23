import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string; // For lowercase-elegant style
  href?: string;
  variant?: "light" | "dark";
  size?: "regular" | "large";
  accentStyle?:
    | "red-gradient"
    | "left-border"
    | "geometric-square"
    | "lowercase-elegant"
    | "gradient-fade"
    | "dot-separator"
    | "vertical-bar";
}

export function SectionHeader({
  title,
  subtitle,
  href,
  variant = "light",
  size = "regular",
  accentStyle = "red-gradient",
}: SectionHeaderProps) {
  const textColor = variant === "dark" ? "text-white" : "text-foreground";
  const fontSize = size === "large" ? "text-xl" : "text-base";

  const renderAccent = () => {
    switch (accentStyle) {
      case "left-border":
        return null; // Handled in container className
      case "geometric-square":
        return <div className="w-2 h-2 bg-slate-900 dark:bg-slate-100" />;
      case "lowercase-elegant":
        return null; // Special layout handled separately
      case "gradient-fade":
        return (
          <div className="h-1 w-24 bg-gradient-to-r from-slate-900 to-slate-900/0 dark:from-slate-100 dark:to-slate-100/0" />
        );
      case "dot-separator":
        return (
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-slate-400" />
            <div className="w-1 h-1 rounded-full bg-slate-400" />
            <div className="w-1 h-1 rounded-full bg-slate-400" />
          </div>
        );
      case "vertical-bar":
        return null; // Handled in container className
      case "red-gradient":
      default:
        return (
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 to-transparent" />
        );
    }
  };

  // Special handling for lowercase-elegant style
  if (accentStyle === "lowercase-elegant") {
    const content = (
      <div className="flex flex-col items-start gap-2 w-full mb-6">
        {subtitle && (
          <h2 className="text-sm font-secondary font-medium lowercase text-foreground/70 tracking-widest">
            {subtitle}
          </h2>
        )}
        <p className={`${fontSize} font-secondary font-bold text-foreground`}>
          {title}
        </p>
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

  // Special handling for vertical-bar style
  if (accentStyle === "vertical-bar") {
    const content = (
      <div className="flex items-start gap-4 w-full mb-6">
        <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent rounded-full" />
        <div className="flex flex-col justify-center">
          <h2
            className={`${fontSize} font-secondary font-bold uppercase tracking-wide ${textColor}`}
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

  // Special handling for geometric-square style
  if (accentStyle === "geometric-square") {
    const content = (
      <div className="flex flex-col items-start gap-3 w-full mb-6">
        <div className="flex items-center gap-3">
          {renderAccent()}
          <h2
            className={`${fontSize} font-secondary font-bold uppercase tracking-wide ${textColor}`}
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
    accentStyle === "left-border"
      ? "flex flex-col items-start gap-3 w-full mb-6 pl-4 border-l-4 border-l-green-500"
      : accentStyle === "dot-separator" || accentStyle === "gradient-fade"
        ? "flex flex-col items-start gap-3 w-full mb-6"
        : "flex flex-col items-start gap-1.5 w-full mb-6";

  const content = (
    <div className={containerClassName}>
      <h2
        className={`${fontSize} font-secondary font-bold uppercase tracking-wide ${textColor}`}
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
