"use client";

import { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SignInGalleryItem } from "@/app/lib/sign-in-gallery";
import { SignInFormPanel } from "./sign-in-form-panel";
import { SignInGalleryPanel } from "./sign-in-gallery-panel";
import {
  initialSignInState,
  isValidEmail,
  signInReducer,
} from "./sign-in-state";

export default function SignInPageClient({
  initialGalleryItems,
}: {
  initialGalleryItems: SignInGalleryItem[];
}) {
  const galleryItems = initialGalleryItems;
  const [state, dispatch] = useReducer(signInReducer, initialSignInState);
  const { push } = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        push("/myprofile");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, push]);

  useEffect(() => {
    if (galleryItems.length === 0) return;

    const interval = setInterval(() => {
      dispatch({ type: "advance_carousel", count: galleryItems.length });
    }, 10000);

    return () => clearInterval(interval);
  }, [galleryItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.email.trim()) {
      dispatch({ type: "submit_error", message: "Please enter your email" });
      return;
    }

    if (!isValidEmail(state.email)) {
      dispatch({
        type: "submit_error",
        message: "Please enter a valid email address",
      });
      return;
    }

    dispatch({ type: "submit_start" });

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: state.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/myprofile/profile-details&post_login=1`,
        },
      });

      if (error) {
        dispatch({ type: "submit_error", message: error.message });
      } else {
        dispatch({ type: "submit_success" });
      }
    } catch {
      dispatch({
        type: "submit_error",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    dispatch({ type: "google_start" });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/myprofile/profile-details&post_login=1`,
        },
      });

      if (error) {
        console.error("Error initiating Google OAuth:", error);
        dispatch({ type: "google_error", message: error.message });
      }
    } catch (error) {
      console.error("Unexpected error with Google OAuth:", error);
      dispatch({
        type: "google_error",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SignInFormPanel
        state={state}
        dispatch={dispatch}
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
      />
      <SignInGalleryPanel
        galleryItems={galleryItems}
        currentIndex={state.currentIndex}
      />
    </div>
  );
}
