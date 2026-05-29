"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyProfilePage() {
  const { replace } = useRouter();

  useEffect(() => {
    // Redirect to profile-details by default
    replace("/myprofile/profile-details");
  }, [replace]);

  return null;
}
