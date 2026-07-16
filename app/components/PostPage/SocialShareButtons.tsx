"use client";

import type { ReactNode } from "react";
import { Facebook, Mail, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialShareButtonsProps {
  title: string;
  url: string;
  variant?: "default" | "compact" | "large" | "list";
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function SocialShareButtons({
  title,
  url,
  variant = "default",
}: SocialShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const isList = variant === "list";

  const buttonClass = cn({
    "size-6 rounded-sm shadow-none": variant === "compact",
    "size-10 rounded-full": variant === "default",
    "size-12 rounded-full": variant === "large" || isList,
  });
  const iconClass = cn({
    "size-3": variant === "compact",
    "size-5": variant === "default",
    "size-6": variant === "large" || isList,
  });
  const xIconClass = cn("fill-current", {
    "size-3": variant === "compact",
    "size-4": variant === "default",
    "size-5": variant === "large" || isList,
  });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const actions: {
    label: string;
    ariaLabel: string;
    onClick: () => void;
    icon: ReactNode;
  }[] = [
    {
      label: "Facebook",
      ariaLabel: "Share on Facebook",
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank",
        ),
      icon: <Facebook className={`${iconClass} fill-current`} />,
    },
    {
      label: "X",
      ariaLabel: "Share on X",
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
          "_blank",
        ),
      icon: <XIcon className={xIconClass} />,
    },
    {
      label: "Email",
      ariaLabel: "Share via Email",
      onClick: () =>
        window.open(
          `mailto:?subject=${encodedTitle}&body=${encodedTitle}%20${encodedUrl}`,
          "_blank",
        ),
      icon: <Mail className={iconClass} />,
    },
    {
      label: "Copy link",
      ariaLabel: "Copy Link",
      onClick: handleCopyLink,
      icon: <LinkIcon className={iconClass} />,
    },
  ];

  if (isList) {
    return (
      <div className="flex w-full flex-col gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex w-full flex-row items-center gap-3 text-news-text transition-opacity hover:opacity-80"
            aria-label={action.ariaLabel}
            onClick={action.onClick}
          >
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center border border-news-border bg-white text-black shadow-md",
                buttonClass,
              )}
            >
              {action.icon}
            </span>
            <span className="font-sans text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center",
        variant === "large" ? "gap-3" : "gap-2",
      )}
    >
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="socialIcon"
          size="icon"
          className={buttonClass}
          aria-label={action.ariaLabel}
          onClick={action.onClick}
        >
          {action.icon}
        </Button>
      ))}
    </div>
  );
}
