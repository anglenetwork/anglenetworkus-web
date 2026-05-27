"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CompleteProfileModal } from "../components/CompleteProfileModal";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";

interface Profile {
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null; // "YYYY-MM-DD" from Supabase (date column)
  email?: string | null;
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
  namePrefill,
}: {
  userId: string;
  email: string | null;
  profile: Profile | null;
  namePrefill?: { firstName: string | null; lastName: string | null };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRequiredModal, setShowRequiredModal] = useState(false); // For first login
  const [showEditModal, setShowEditModal] = useState(false); // For edit button

  // Check for post_login=1 and show modal if profile is incomplete
  useEffect(() => {
    const postLogin = searchParams.get("post_login");
    const isProfileIncomplete =
      !profile?.first_name || !profile?.last_name || !profile?.date_of_birth;

    if (postLogin === "1" && isProfileIncomplete) {
      setShowRequiredModal(true);
    }
  }, [searchParams, profile]);

  const handleRequiredModalClose = async () => {
    setShowRequiredModal(false);
    // Remove post_login=1 from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("post_login");
    const newSearch = params.toString();
    const newPath = newSearch
      ? `/myprofile/profile-details?${newSearch}`
      : `/myprofile/profile-details`;
    router.replace(newPath);
    // Force server component re-fetch
    router.refresh();
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    // Refresh to get updated data
    router.refresh();
  };

  const handleEditModalCancel = () => {
    setShowEditModal(false);
  };

  return (
    <>
      {/* Required modal for first login */}
      <CompleteProfileModal
        open={showRequiredModal}
        onClose={handleRequiredModalClose}
        initialFirstName={namePrefill?.firstName ?? null}
        initialLastName={namePrefill?.lastName ?? null}
        initialDateOfBirth={profile?.date_of_birth ?? null}
        userId={userId}
        isRequired={true}
        title="Complete your profile"
        description="Please provide your first name, last name, and date of birth to continue. This information helps us personalize your experience."
        submitLabel="Complete Profile"
      />

      {/* Edit modal for regular editing */}
      <CompleteProfileModal
        open={showEditModal}
        onClose={handleEditModalClose}
        initialFirstName={profile?.first_name ?? null}
        initialLastName={profile?.last_name ?? null}
        initialDateOfBirth={profile?.date_of_birth ?? null}
        userId={userId}
        isRequired={false}
        title="Edit Profile"
        description="Update your personal information."
        submitLabel="Save Changes"
        onCancel={handleEditModalCancel}
      />

      <div>
        <ProfileSectionHeader
          title="Profile"
          description="Manage your personal information"
        />

        <div className="space-y-8">
          <div>
            <label className="mb-3 block font-sans font-semibold text-slate-900 text-sm">
              First Name
            </label>
            <p className="font-sans text-slate-900">
              {profile?.first_name && profile.first_name.trim()
                ? profile.first_name
                : "Not set"}
            </p>
          </div>

          <div>
            <label className="mb-3 block font-sans font-semibold text-slate-900 text-sm">
              Last Name
            </label>
            <p className="font-sans text-slate-900">
              {profile?.last_name && profile.last_name.trim()
                ? profile.last_name
                : "Not set"}
            </p>
          </div>

          <div>
            <label className="mb-3 block font-sans font-semibold text-slate-900 text-sm">
              Date of Birth
            </label>
            <p className="font-sans text-slate-900">
              {profile?.date_of_birth
                ? formatDateOfBirth(profile.date_of_birth)
                : "Not set"}
            </p>
          </div>

          <div>
            <label className="mb-3 block font-sans font-semibold text-slate-900 text-sm">
              Email Address
            </label>
            <p className="font-sans text-slate-900">
              {email ?? "Not available"}
            </p>
          </div>

          <div className="pt-4">
            <Button
              className="bg-slate-900 font-sans text-white hover:bg-slate-800"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
