"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ProfileEditForm } from "./ProfileEditForm";

interface CompleteProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialFirstName?: string | null;
  initialLastName?: string | null;
  initialDateOfBirth?: string | null;
  userId: string;
  // New props to make modal flexible
  isRequired?: boolean; // If true, modal cannot be closed (first login). If false, can be closed (editing)
  title?: string; // Custom title
  description?: string; // Custom description
  submitLabel?: string; // Custom submit label
  onCancel?: () => void; // Cancel handler for edit mode
}

export function CompleteProfileModal({
  open,
  onClose,
  initialFirstName,
  initialLastName,
  initialDateOfBirth,
  userId,
  isRequired = false, // Default to false (editable/dismissible)
  title = "Edit Profile",
  description = "Update your personal information.",
  submitLabel = "Save Changes",
  onCancel,
}: CompleteProfileModalProps) {
  // Only prevent closing if isRequired is true (first login scenario)
  useEffect(() => {
    if (open && isRequired) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, isRequired]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Only prevent closing if isRequired is true
        if (isRequired && !isOpen) {
          // Do nothing - modal stays open
        } else if (!isRequired && !isOpen) {
          // Allow closing for edit mode
          onClose();
        }
      }}
    >
      <DialogContent
        className={cn(
          "top-0 left-0 flex max-h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-y-auto rounded-none border-0 p-6 shadow-none",
          "h-[100dvh]",
          "xl:top-[50%] xl:left-[50%] xl:h-auto xl:max-h-[85vh] xl:max-w-[600px] xl:translate-x-[-50%] xl:translate-y-[-50%] xl:rounded-lg xl:border xl:shadow-lg",
          isRequired && "[&_button[aria-label='Close']]:hidden",
        )}
        onEscapeKeyDown={(e) => {
          // Only prevent ESC if required
          if (isRequired) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          // Only prevent clicking outside if required
          if (isRequired) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="font-sans font-semibold text-2xl text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="font-sans text-slate-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <ProfileEditForm
            key={`${userId}:${initialFirstName ?? ""}:${initialLastName ?? ""}:${initialDateOfBirth ?? ""}`}
            userId={userId}
            initialFirstName={initialFirstName}
            initialLastName={initialLastName}
            initialDateOfBirth={initialDateOfBirth ?? null}
            requireNames={isRequired} // Only require names if it's the required modal
            hideDateOfBirth={false}
            submitLabel={submitLabel}
            onUpdate={() => {
              onClose();
            }}
            onCancel={onCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
