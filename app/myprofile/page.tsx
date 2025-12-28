"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MyProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Redirect to profile-details by default
    router.replace("/myprofile/profile-details");
  }, [router]);

  return null;
}

