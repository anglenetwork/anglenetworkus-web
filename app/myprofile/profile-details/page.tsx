"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProfileEditForm } from "../components/ProfileEditForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@supabase/supabase-js";

interface Profile {
  first_name?: string | null;
  last_name?: string | null;
}

export default function ProfileDetailsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      // Fetch profile data using the user's UUID to find the matching row in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        console.error("User ID:", session.user.id);
        setProfile(null);
      } else {
        setProfile(profileData || null);
      }
      setLoading(false);
    };

    loadUserData();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);

        // Fetch profile data using the user's UUID to find the matching row in profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          console.error("User ID:", session.user.id);
          setProfile(null);
        } else {
          setProfile(profileData || null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const refreshProfile = async () => {
    if (!user) return;

    // Fetch profile data using the user's UUID to find the matching row in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error refreshing profile:", profileError);
      console.error("User ID:", user.id);
      setProfile(null);
    } else {
      setProfile(profileData || null);
    }
  };

  // Helper function to format full name safely
  const getFullName = () => {
    const firstName = profile?.first_name?.trim() || "";
    const lastName = profile?.last_name?.trim() || "";
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    return null;
  };

  // Helper function to get welcome message
  const getWelcomeMessage = () => {
    const fullName = getFullName();
    if (fullName) {
      return `Welcome, ${fullName}!`;
    }
    return "Welcome";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

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
            <p className="font-sans">{user.email}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold font-sans mb-4">Edit Name</h3>
            <ProfileEditForm
              userId={user.id}
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
