"use client";

import { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Logo } from "@/app/components/layout/navbar/logo";
import { Chrome } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { signInGalleryTitle } from "@/app/lib/typography/sign-in-page";
import type { SignInGalleryItem } from "@/app/lib/sign-in-gallery";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

type SignInState = {
  currentIndex: number;
  email: string;
  isSubmitted: boolean;
  emailError: string;
  isSending: boolean;
  isGoogleLoading: boolean;
};

type SignInAction =
  | { type: "set_email"; email: string }
  | { type: "clear_email_error" }
  | { type: "submit_start" }
  | { type: "submit_success" }
  | { type: "submit_error"; message: string }
  | { type: "google_start" }
  | { type: "google_error"; message: string }
  | { type: "reset_form" }
  | { type: "advance_carousel"; count: number };

const initialState: SignInState = {
  currentIndex: 0,
  email: "",
  isSubmitted: false,
  emailError: "",
  isSending: false,
  isGoogleLoading: false,
};

function signInReducer(state: SignInState, action: SignInAction): SignInState {
  switch (action.type) {
    case "set_email":
      return { ...state, email: action.email, emailError: "" };
    case "clear_email_error":
      return { ...state, emailError: "" };
    case "submit_start":
      return { ...state, isSending: true, emailError: "" };
    case "submit_success":
      return { ...state, isSubmitted: true, isSending: false };
    case "submit_error":
      return { ...state, emailError: action.message, isSending: false };
    case "google_start":
      return { ...state, isGoogleLoading: true, emailError: "" };
    case "google_error":
      return { ...state, emailError: action.message, isGoogleLoading: false };
    case "reset_form":
      return {
        ...state,
        isSubmitted: false,
        email: "",
        emailError: "",
      };
    case "advance_carousel":
      return {
        ...state,
        currentIndex: (state.currentIndex + 1) % action.count,
      };
    default:
      return state;
  }
}

export default function SignInPageClient({
  initialGalleryItems,
}: {
  initialGalleryItems: SignInGalleryItem[];
}) {
  const galleryItems = initialGalleryItems;
  const [state, dispatch] = useReducer(signInReducer, initialState);
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

  const currentItem =
    galleryItems.length > 0 ? galleryItems[state.currentIndex] : null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side - Sign In Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo variant="logo-only" />
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-center font-bold font-sans text-2xl">
            Sign in to continue
          </h1>
          <p className="mb-8 text-center font-sans text-muted-foreground text-sm">
            Enter your email and we’ll send a secure link to sign in or create
            your account.
          </p>

          {!state.isSubmitted ? (
            <div className="space-y-6">
              {/* Google OAuth Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={state.isGoogleLoading || state.isSending}
                className="h-11 w-full border-2 font-sans"
              >
                <Chrome className="mr-2 size-4" />
                {state.isGoogleLoading ? "Connecting..." : "Continue with Google"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 font-sans text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="font-medium font-sans text-foreground text-sm"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={state.email}
                    onChange={(e) =>
                      dispatch({ type: "set_email", email: e.target.value })
                    }
                    className={`w-full font-sans ${
                      state.emailError ? "border-red-500" : ""
                    }`}
                    disabled={state.isSending || state.isGoogleLoading}
                  />
                  {state.emailError && (
                    <p className="font-sans text-red-500 text-sm">
                      {state.emailError}
                    </p>
                  )}
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={state.isSending || state.isGoogleLoading}
                  className="h-11 w-full bg-foreground font-sans text-background hover:bg-foreground/90"
                >
                  {state.isSending ? "Sending..." : "Send sign-in link"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="fade-in animate-in space-y-4 duration-500">
              <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                <h2 className="mb-2 font-sans font-semibold text-green-900 text-lg">
                  Check your email
                </h2>
                <p className="font-sans text-green-700">
                  Check your inbox. We sent a secure sign-in link to{" "}
                  <strong>{state.email}</strong>. Click it to sign in.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent font-sans"
                onClick={() => dispatch({ type: "reset_form" })}
              >
                Try another email
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Gallery Carousel */}
      {galleryItems.length > 0 && currentItem && (
        <div className="relative hidden flex-1 bg-gradient-to-br from-orange-200 via-pink-300 to-emerald-200 lg:flex">
          {/* Gallery Content */}
          <div className="relative size-full">
            {/* Image Container */}
            <div className="relative size-full">
              {/* Image */}
              <div className="relative size-full overflow-hidden">
                <Image
                  src={currentItem.image || "/placeholder.svg"}
                  alt={currentItem.title}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute right-0 bottom-20 left-0 px-8 py-6">
                  {currentItem.slug ? (
                    <Link href={`/post/${currentItem.slug}`}>
                      <h2 className={signInGalleryTitle}>
                        {currentItem.title}
                      </h2>
                    </Link>
                  ) : (
                    <h2 className="mb-4 font-bold font-sans text-4xl text-shadow text-white">
                      {currentItem.title}
                    </h2>
                  )}
                  {currentItem.slug && (
                    <Link
                      href={`/post/${currentItem.slug}`}
                      className="inline-block font-medium font-sans text-base text-white underline-offset-4 transition-all hover:underline"
                    >
                      Read Article
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
