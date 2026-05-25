"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
        className={`sm:max-w-[600px] ${isRequired ? "[&_button[aria-label='Close']]:hidden" : ""}`}
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
        <DialogHeader>
          <DialogTitle className="font-sans font-semibold text-2xl text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="font-sans text-slate-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <ProfileEditForm
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
