"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SignInForm } from "@/app/myprofile/components/SignInForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is already logged in, redirect to profile
        router.push("/myprofile");
      } else {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.push("/myprofile");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  // Show nothing while checking or if redirecting
  if (loading) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}

