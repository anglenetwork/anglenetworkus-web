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
}

export function CompleteProfileModal({
  open,
  onClose,
  initialFirstName,
  initialLastName,
  initialDateOfBirth,
  userId,
}: CompleteProfileModalProps) {
  // Prevent closing the modal via ESC key
  useEffect(() => {
    if (open) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Prevent closing - always keep it open if trying to close
        if (!isOpen) {
          // Do nothing - modal stays open
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] [&_button[aria-label='Close']]:hidden"
        onEscapeKeyDown={(e) => {
          // Prevent ESC from closing
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // Prevent clicking outside from closing
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-900 font-sans">
            Complete your profile
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-sans">
            Please provide your first name, last name, and date of birth to continue. This information
            helps us personalize your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <ProfileEditForm
            userId={userId}
            initialFirstName={initialFirstName}
            initialLastName={initialLastName}
            initialDateOfBirth={initialDateOfBirth ?? null}
            requireNames={true}
            hideDateOfBirth={false}
            submitLabel="Complete Profile"
            onUpdate={() => {
              // Close modal and remove post_login from URL
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

