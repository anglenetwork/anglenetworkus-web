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
}

export function ProfileEditForm({
  userId,
  initialFirstName,
  initialLastName,
  initialDateOfBirth,
  onUpdate,
  onCancel,
}: ProfileEditFormProps) {
  const [firstName, setFirstName] = useState(initialFirstName ?? "");
  const [lastName, setLastName] = useState(initialLastName ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(initialDateOfBirth ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
          dateOfBirth: dateOfBirth ? dateOfBirth : null,
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
          className="text-sm font-semibold text-slate-900 mb-3 block font-sans"
        >
          First Name
        </Label>
        <Input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
          className="w-full max-w-xl font-sans"
        />
      </div>

      <div>
        <Label
          htmlFor="lastName"
          className="text-sm font-semibold text-slate-900 mb-3 block font-sans"
        >
          Last Name
        </Label>
        <Input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={loading}
          className="w-full max-w-xl font-sans"
        />
      </div>

      <div>
        <Label
          htmlFor="dateOfBirth"
          className="text-sm font-semibold text-slate-900 mb-3 block font-sans"
        >
          Date of Birth
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          name="dateOfBirth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          disabled={loading}
          className="w-full max-w-xl font-sans"
        />
      </div>

      {message && (
        <div
          className={`text-sm font-sans ${
            message.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white hover:bg-slate-800 font-sans"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={loading}
            className="border-slate-900 text-slate-900 hover:bg-slate-50 bg-transparent font-sans"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
