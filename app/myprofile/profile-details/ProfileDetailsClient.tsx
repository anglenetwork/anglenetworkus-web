"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileEditForm } from "../components/ProfileEditForm";

interface Profile {
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null; // "YYYY-MM-DD" from Supabase (date column)
  email?: string | null;
  avatar_url?: string | null;
}

// Safe formatter for YYYY-MM-DD without timezone shifting
function formatDateOfBirth(dob: string) {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return dob;

  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ProfileDetailsClient({
  userId,
  email,
  profile,
}: {
  userId: string;
  email: string | null;
  profile: Profile | null;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
    dateOfBirth: profile?.date_of_birth ?? "",
    email: email ?? "",
  });

  useEffect(() => {
    setFormData({
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      dateOfBirth: profile?.date_of_birth ?? "",
      email: email ?? "",
    });
  }, [profile, email]);

  const refreshProfile = async () => {
    // Re-runs the server component fetch
    router.refresh();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      dateOfBirth: profile?.date_of_birth ?? "",
      email: email ?? "",
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div>
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2 font-sans">
            Profile
          </h1>
          <p className="text-slate-600 font-sans">
            Manage your personal information
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3 font-sans">
              First Name
            </label>
            <p className="text-slate-900 font-sans">
              {profile?.first_name || "Not set"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3 font-sans">
              Last Name
            </label>
            <p className="text-slate-900 font-sans">
              {profile?.last_name || "Not set"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3 font-sans">
              Date of Birth
            </label>
            <p className="text-slate-900 font-sans">
              {profile?.date_of_birth
                ? formatDateOfBirth(profile.date_of_birth)
                : "Not set"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3 font-sans">
              Email Address
            </label>
            <p className="text-slate-900 font-sans">
              {email ?? "Not available"}
            </p>
          </div>

          <div className="pt-4">
            <Button
              className="bg-slate-900 text-white hover:bg-slate-800 font-sans"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2 font-sans">
          Profile
        </h1>
        <p className="text-slate-600 font-sans">
          Manage your personal information
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-slate-900 mb-3 block font-sans"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            className="w-full max-w-xl font-sans"
            disabled
          />
        </div>

        <ProfileEditForm
          userId={userId}
          initialFirstName={formData.firstName}
          initialLastName={formData.lastName}
          initialDateOfBirth={formData.dateOfBirth || null}
          onUpdate={refreshProfile}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
