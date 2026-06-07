"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  profileButtonPrimary,
  profileFormMessageError,
  profileFormMessageSuccess,
  profileSignInLabel,
} from "@/app/lib/typography/myprofile-page";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/myprofile`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email for the sign-in link!",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className={profileSignInLabel}>
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full font-sans"
        />
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={
            message.type === "error"
              ? profileFormMessageError
              : profileFormMessageSuccess
          }
        >
          {message.text}
        </div>
      )}

      {/* Sign In Button */}
      <Button
        type="submit"
        disabled={loading}
        className={cn("h-11 w-full", profileButtonPrimary)}
      >
        {loading ? "Sending..." : "Send magic link"}
      </Button>
    </form>
  );
}
