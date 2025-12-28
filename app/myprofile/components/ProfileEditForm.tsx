"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface ProfileEditFormProps {
  userId: string;
  initialFirstName?: string | null;
  initialLastName?: string | null;
  onUpdate?: () => void;
  onCancel?: () => void;
}

export function ProfileEditForm({
  userId,
  initialFirstName,
  initialLastName,
  onUpdate,
  onCancel,
}: ProfileEditFormProps) {
  const [firstName, setFirstName] = useState(initialFirstName ?? "");
  const [lastName, setLastName] = useState(initialLastName ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setFirstName(initialFirstName ?? "");
    setLastName(initialLastName ?? "");
  }, [initialFirstName, initialLastName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Use upsert to create profile if it doesn't exist, or update if it does
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            first_name: firstName.trim() || null,
            last_name: lastName.trim() || null,
          },
          {
            onConflict: "id",
          }
        )
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        console.error("User ID:", userId);
        console.error("First Name:", firstName.trim() || null);
        console.error("Last Name:", lastName.trim() || null);
        throw error;
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      // Call onUpdate callback if provided, otherwise refresh
      if (onUpdate) {
        setTimeout(() => {
          onUpdate();
        }, 500);
      } else {
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    } catch (error: any) {
      console.error("Exception in handleSubmit:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
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
