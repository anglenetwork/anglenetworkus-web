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
}

export function ProfileEditForm({
  userId,
  initialFirstName,
  initialLastName,
  onUpdate,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="font-sans">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            className="font-sans"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="font-sans">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            className="font-sans"
          />
        </div>
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

      <Button type="submit" disabled={loading} className="font-sans">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
