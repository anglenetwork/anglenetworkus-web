"use client";

import { Facebook, Twitter, Mail, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareButtonsProps {
  title: string;
  url: string;
  variant?: "default" | "compact";
}

export default function SocialShareButtons({
  title,
  url,
  variant = "default",
}: SocialShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const isCompact = variant === "compact";
  const buttonClass = isCompact
    ? "h-6 w-6 rounded-sm bg-white border border-gray-200 hover:bg-gray-50 text-black shadow-none"
    : "h-10 w-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-black shadow-sm";
  const iconClass = isCompact ? "h-3 w-3" : "h-5 w-5";
  const xIconClass = isCompact ? "h-3 w-3 fill-current" : "h-4 w-4 fill-current";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here if you want
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={buttonClass}
        aria-label="Share on Facebook"
        onClick={() =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            "_blank"
          )
        }
      >
        <Facebook className={`${iconClass} fill-current`} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={buttonClass}
        aria-label="Share on X"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            "_blank"
          )
        }
      >
        <svg className={xIconClass} viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={buttonClass}
        aria-label="Share via Email"
        onClick={() =>
          window.open(
            `mailto:?subject=${encodedTitle}&body=${encodedTitle}%20${encodedUrl}`,
            "_blank"
          )
        }
      >
        <Mail className={iconClass} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={buttonClass}
        aria-label="Copy Link"
        onClick={handleCopyLink}
      >
        <LinkIcon className={iconClass} />
      </Button>
    </div>
  );
}
