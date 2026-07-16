"use client";

import { Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import SocialShareButtons from "../SocialShareButtons";

interface PostShareDialogProps {
  title: string;
  url: string;
  className?: string;
}

export default function PostShareDialog({
  title,
  url,
  className,
}: PostShareDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="socialIcon"
          size="icon"
          className={cn("size-10 rounded-full", className)}
          aria-label="Share article"
        >
          <Share2 className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs gap-6 rounded-lg border [&>button]:hidden">
        <div className="flex items-center justify-between gap-3">
          <DialogTitle className="font-display text-lg leading-none">
            Share
          </DialogTitle>
          <DialogClose className="shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <SocialShareButtons title={title} url={url} variant="list" />
      </DialogContent>
    </Dialog>
  );
}
