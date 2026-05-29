"use client";

import { useState, Suspense } from "react";
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

function ProfileDetailsClientContent({
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
  const { replace, refresh } = useRouter();
  const { get } = useSearchParams();
  const postLogin = get("post_login");
  const isProfileIncomplete =
    !profile?.first_name || !profile?.last_name || !profile?.date_of_birth;
  const [showRequiredModal, setShowRequiredModal] = useState(
    () => postLogin === "1" && isProfileIncomplete,
  );
  const [showEditModal, setShowEditModal] = useState(false); // For edit button

  const handleRequiredModalClose = async () => {
    setShowRequiredModal(false);
    // Remove post_login=1 from URL
    const params = new URLSearchParams(window.location.search);
    params.delete("post_login");
    const newSearch = params.toString();
    const newPath = newSearch
      ? `/myprofile/profile-details?${newSearch}`
      : `/myprofile/profile-details`;
    replace(newPath);
    refresh();
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    refresh();
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
            <p className="mb-3 block font-sans font-semibold text-slate-900 text-sm">
              First Name
            </p>
            <p className="font-sans text-slate-900">
              {profile?.first_name && profile.first_name.trim()
                ? profile.first_name
                : "Not set"}
            </p>
          </div>

          <div>
            <p className="mb-3 block font-sans font-semibold text-slate-900 text-sm">
              Last Name
            </p>
            <p className="font-sans text-slate-900">
              {profile?.last_name && profile.last_name.trim()
                ? profile.last_name
                : "Not set"}
            </p>
          </div>

          <div>
            <p className="mb-3 block font-sans font-semibold text-slate-900 text-sm">
              Date of Birth
            </p>
            <p className="font-sans text-slate-900">
              {profile?.date_of_birth
                ? formatDateOfBirth(profile.date_of_birth)
                : "Not set"}
            </p>
          </div>

          <div>
            <p className="mb-3 block font-sans font-semibold text-slate-900 text-sm">
              Email Address
            </p>
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

export default function ProfileDetailsClient(
  props: {
    userId: string;
    email: string | null;
    profile: Profile | null;
    namePrefill?: { firstName: string | null; lastName: string | null };
  },
) {
  return (
    <Suspense fallback={null}>
      <ProfileDetailsClientContent {...props} />
    </Suspense>
  );
}
