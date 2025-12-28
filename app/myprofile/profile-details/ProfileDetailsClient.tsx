"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileEditForm } from "../components/ProfileEditForm";

interface Profile {
  first_name?: string | null;
  last_name?: string | null;
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

  const getFullName = () => {
    const firstName = profile?.first_name?.trim() || "";
    const lastName = profile?.last_name?.trim() || "";
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return null;
  };

  const getWelcomeMessage = () => {
    const fullName = getFullName();
    return fullName ? `Welcome, ${fullName}!` : "Welcome";
  };

  const refreshProfile = async () => {
    // Re-runs the server component fetch
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <p className="text-lg font-medium text-muted-foreground font-sans">
            {getWelcomeMessage()}
          </p>
          <CardTitle className="font-sans text-2xl">Profile Details</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground font-sans">
              First Name
            </p>
            <p className="font-sans">{profile?.first_name || "Not set"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground font-sans">
              Last Name
            </p>
            <p className="font-sans">{profile?.last_name || "Not set"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground font-sans">
              Email
            </p>
            <p className="font-sans">{email ?? "Not available"}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold font-sans mb-4">Edit Name</h3>
            <ProfileEditForm
              userId={userId}
              initialFirstName={profile?.first_name}
              initialLastName={profile?.last_name}
              onUpdate={refreshProfile}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

