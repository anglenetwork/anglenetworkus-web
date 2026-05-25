"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileEditFormProps {
  userId: string;
  initialFirstName?: string | null;
  initialLastName?: string | null;
  initialDateOfBirth?: string | null; // "YYYY-MM-DD"
  onUpdate?: () => void;
  onCancel?: () => void;
  requireNames?: boolean; // Default: false
  hideDateOfBirth?: boolean; // Default: false
  submitLabel?: string; // Default: "Save Changes"
}

export function ProfileEditForm({
  userId,
  initialFirstName,
  initialLastName,
  initialDateOfBirth,
  onUpdate,
  onCancel,
  requireNames = false,
  hideDateOfBirth = false,
  submitLabel = "Save Changes",
}: ProfileEditFormProps) {
  const [firstName, setFirstName] = useState(initialFirstName ?? "");
  const [lastName, setLastName] = useState(initialLastName ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(initialDateOfBirth ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }>({});

  const router = useRouter();

  useEffect(() => {
    setFirstName(initialFirstName ?? "");
    setLastName(initialLastName ?? "");
    setDateOfBirth(initialDateOfBirth ?? "");
  }, [initialFirstName, initialLastName, initialDateOfBirth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setFieldErrors({});

    // Validate required fields if requireNames is true
    if (requireNames) {
      const errors: {
        firstName?: string;
        lastName?: string;
        dateOfBirth?: string;
      } = {};
      if (!firstName.trim()) {
        errors.firstName = "First name is required";
      }
      if (!lastName.trim()) {
        errors.lastName = "Last name is required";
      }
      if (!hideDateOfBirth && !dateOfBirth.trim()) {
        errors.dateOfBirth = "Date of birth is required";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setLoading(false);
        return;
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({
          // userId kept in component but NOT needed/sent; server uses auth user id.
          firstName,
          lastName,
          dateOfBirth: hideDateOfBirth
            ? null
            : dateOfBirth
              ? dateOfBirth
              : null,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as any;

      if (res.status === 401) {
        setMessage({
          type: "error",
          text: "You're not signed in anymore. Please sign in again.",
        });
        return;
      }

      if (!res.ok) {
        setMessage({
          type: "error",
          text: json?.error || "Failed to update profile. Please try again.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      // Call onUpdate callback if provided, otherwise refresh
      if (onUpdate) {
        setTimeout(() => onUpdate(), 500);
      } else {
        setTimeout(() => router.refresh(), 1000);
      }
    } catch (error: any) {
      const isAbort =
        error?.name === "AbortError" ||
        String(error?.message || "")
          .toLowerCase()
          .includes("aborted");

      setMessage({
        type: "error",
        text: isAbort
          ? "Request timed out. Please try again."
          : error?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <Label
          htmlFor="firstName"
          className="mb-3 block font-sans font-semibold text-slate-900 text-sm"
        >
          First Name {requireNames && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            if (fieldErrors.firstName) {
              setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
            }
          }}
          disabled={loading}
          className={`w-full max-w-xl font-sans ${
            fieldErrors.firstName ? "border-red-500" : ""
          }`}
        />
        {fieldErrors.firstName && (
          <p className="mt-1 font-sans text-red-500 text-sm">
            {fieldErrors.firstName}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="lastName"
          className="mb-3 block font-sans font-semibold text-slate-900 text-sm"
        >
          Last Name {requireNames && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            if (fieldErrors.lastName) {
              setFieldErrors((prev) => ({ ...prev, lastName: undefined }));
            }
          }}
          disabled={loading}
          className={`w-full max-w-xl font-sans ${
            fieldErrors.lastName ? "border-red-500" : ""
          }`}
        />
        {fieldErrors.lastName && (
          <p className="mt-1 font-sans text-red-500 text-sm">
            {fieldErrors.lastName}
          </p>
        )}
      </div>

      {!hideDateOfBirth && (
        <div>
          <Label
            htmlFor="dateOfBirth"
            className="mb-3 block font-sans font-semibold text-slate-900 text-sm"
          >
            Date of Birth{" "}
            {requireNames && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              if (fieldErrors.dateOfBirth) {
                setFieldErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
              }
            }}
            disabled={loading}
            className={`w-full max-w-xl font-sans ${
              fieldErrors.dateOfBirth ? "border-red-500" : ""
            }`}
          />
          {fieldErrors.dateOfBirth && (
            <p className="mt-1 font-sans text-red-500 text-sm">
              {fieldErrors.dateOfBirth}
            </p>
          )}
        </div>
      )}

      {message && (
        <div
          className={`font-sans text-sm ${
            message.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={
            loading ||
            (requireNames &&
              (!firstName.trim() ||
                !lastName.trim() ||
                (!hideDateOfBirth && !dateOfBirth.trim())))
          }
          className="bg-slate-900 font-sans text-white hover:bg-slate-800"
        >
          {loading ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={loading}
            className="border-slate-900 bg-transparent font-sans text-slate-900 hover:bg-slate-50"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
