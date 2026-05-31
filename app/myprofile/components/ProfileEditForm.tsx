"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  createInitialProfileEditFormState,
  profileEditFormReducer,
  type ProfileFieldErrors,
} from "./profile-edit-form-state";

const profileInputClassName = (hasError: boolean) =>
  cn(
    "w-full max-w-xl font-sans focus-visible:border-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0",
    hasError && "border-red-500 focus-visible:border-red-500",
  );

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
  userId: _userId,
  initialFirstName,
  initialLastName,
  initialDateOfBirth,
  onUpdate,
  onCancel,
  requireNames = false,
  hideDateOfBirth = false,
  submitLabel = "Save Changes",
}: ProfileEditFormProps) {
  const [state, dispatch] = useReducer(
    profileEditFormReducer,
    {
      initialFirstName,
      initialLastName,
      initialDateOfBirth,
    },
    createInitialProfileEditFormState,
  );
  const { firstName, lastName, dateOfBirth, loading, message, fieldErrors } =
    state;

  const { refresh } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "submit_start" });

    if (requireNames) {
      const errors: ProfileFieldErrors = {};
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
        dispatch({ type: "submit_validation_failed", fieldErrors: errors });
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
          firstName,
          lastName,
          dateOfBirth: hideDateOfBirth
            ? null
            : dateOfBirth
              ? dateOfBirth
              : null,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.status === 401) {
        dispatch({
          type: "submit_error",
          message: {
            type: "error",
            text: "You're not signed in anymore. Please sign in again.",
          },
        });
        return;
      }

      if (!res.ok) {
        dispatch({
          type: "submit_error",
          message: {
            type: "error",
            text: json?.error || "Failed to update profile. Please try again.",
          },
        });
        return;
      }

      dispatch({
        type: "submit_success",
        message: {
          type: "success",
          text: "Profile updated successfully!",
        },
      });

      if (onUpdate) {
        setTimeout(() => onUpdate(), 500);
      } else {
        setTimeout(() => refresh(), 1000);
      }
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      const isAbort =
        err?.name === "AbortError" ||
        String(err?.message || "")
          .toLowerCase()
          .includes("aborted");

      dispatch({
        type: "submit_error",
        message: {
          type: "error",
          text: isAbort
            ? "Request timed out. Please try again."
            : err?.message || "Failed to update profile. Please try again.",
        },
      });
    } finally {
      clearTimeout(timeout);
      dispatch({ type: "submit_end" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-1">
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
              dispatch({ type: "set_first_name", value: e.target.value });
              if (fieldErrors.firstName) {
                dispatch({ type: "clear_field_error", field: "firstName" });
              }
            }}
            disabled={loading}
            className={profileInputClassName(Boolean(fieldErrors.firstName))}
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
              dispatch({ type: "set_last_name", value: e.target.value });
              if (fieldErrors.lastName) {
                dispatch({ type: "clear_field_error", field: "lastName" });
              }
            }}
            disabled={loading}
            className={profileInputClassName(Boolean(fieldErrors.lastName))}
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
                dispatch({ type: "set_date_of_birth", value: e.target.value });
                if (fieldErrors.dateOfBirth) {
                  dispatch({ type: "clear_field_error", field: "dateOfBirth" });
                }
              }}
              disabled={loading}
              className={profileInputClassName(
                Boolean(fieldErrors.dateOfBirth),
              )}
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
      </div>

      <div className="mt-auto flex w-full shrink-0 flex-col gap-3 pt-4">
        <Button
          type="submit"
          disabled={
            loading ||
            (requireNames &&
              (!firstName.trim() ||
                !lastName.trim() ||
                (!hideDateOfBirth && !dateOfBirth.trim())))
          }
          className="w-full bg-slate-900 font-sans text-white hover:bg-slate-800"
        >
          {loading ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={loading}
            className="w-full border-slate-900 bg-transparent font-sans text-slate-900 hover:bg-slate-50"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
