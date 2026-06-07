"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Mail, Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  profileButtonPrimary,
  profileDetailsDisplayName,
  profileDetailsEmail,
  profileDetailsEmptyValue,
  profileDetailsFieldValue,
  profileSubscriptionEyebrow,
  profileSubscriptionStatLabel,
} from "@/app/lib/typography/myprofile-page";
import { CompleteProfileModal } from "../components/CompleteProfileModal";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { cn } from "@/lib/utils";

interface Profile {
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null;
  email?: string | null;
}

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

function getDisplayName(profile: Profile | null): string {
  const first = profile?.first_name?.trim();
  const last = profile?.last_name?.trim();
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (last) return last;
  return "Your profile";
}

type ProfileField = {
  label: string;
  value: string | null;
  icon: typeof User;
};

function ProfileFieldCard({ label, value, icon: Icon }: ProfileField) {
  const isEmpty = !value;

  return (
    <Card className="border border-border/60 bg-card/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={profileSubscriptionStatLabel}>{label}</p>
          <p
            className={cn(
              isEmpty ? profileDetailsEmptyValue : profileDetailsFieldValue,
            )}
          >
            {isEmpty ? "Not set" : value}
          </p>
        </div>
        <Icon className="mt-0.5 size-5 shrink-0 text-neutral-300" aria-hidden />
      </div>
    </Card>
  );
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
  const searchParams = useSearchParams();
  const postLogin = searchParams.get("post_login");
  const isProfileIncomplete =
    !profile?.first_name || !profile?.last_name || !profile?.date_of_birth;
  const [showRequiredModal, setShowRequiredModal] = useState(
    () => postLogin === "1" && isProfileIncomplete,
  );
  const [showEditModal, setShowEditModal] = useState(false);

  const handleRequiredModalClose = async () => {
    setShowRequiredModal(false);
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

  const firstName = profile?.first_name?.trim() || null;
  const lastName = profile?.last_name?.trim() || null;
  const dateOfBirth = profile?.date_of_birth
    ? formatDateOfBirth(profile.date_of_birth)
    : null;

  const fields: ProfileField[] = [
    { label: "First Name", value: firstName, icon: User },
    { label: "Last Name", value: lastName, icon: User },
    {
      label: "Date of Birth",
      value: dateOfBirth,
      icon: Calendar,
    },
    {
      label: "Email Address",
      value: email,
      icon: Mail,
    },
  ];

  return (
    <>
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
        onCancel={() => setShowEditModal(false)}
      />

      <div>
        <ProfileSectionHeader
          title="Profile"
          description="Manage your personal information"
        />

        <Card className="border border-neutral-200 bg-gradient-to-br from-neutral-50 to-transparent p-6 xl:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className={profileSubscriptionEyebrow}>Account</span>
              <h2 className={profileDetailsDisplayName}>
                {getDisplayName(profile)}
              </h2>
              {email && <p className={profileDetailsEmail}>{email}</p>}
            </div>
            <Button
              className={cn("shrink-0 gap-2", profileButtonPrimary)}
              onClick={() => setShowEditModal(true)}
            >
              <Pencil className="size-4" aria-hidden />
              Edit profile
            </Button>
          </div>

          {isProfileIncomplete && (
            <div className="mb-6 rounded-lg border border-red-600/20 bg-red-600/5 px-4 py-3">
              <p className="font-medium font-sans text-neutral-900 text-sm">
                Your profile is incomplete.{" "}
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="font-semibold text-red-600 underline-offset-2 hover:underline"
                >
                  Add your details
                </button>{" "}
                to personalize your experience.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <ProfileFieldCard key={field.label} {...field} />
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

export default function ProfileDetailsClient(props: {
  userId: string;
  email: string | null;
  profile: Profile | null;
  namePrefill?: { firstName: string | null; lastName: string | null };
}) {
  return (
    <Suspense fallback={null}>
      <ProfileDetailsClientContent {...props} />
    </Suspense>
  );
}
