"use client";

import { useEffect, useState } from "react";
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

interface GalleryItem {
  id: string;
  title: string;
  slug: string | null;
  image: string;
  description: string;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignInPage() {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          cache: "no-store",
        });

        const json = (await res.json().catch(() => ({}))) as any;

        if (json?.authenticated && json?.user) {
          // User is already logged in, redirect to profile
          router.push("/myprofile");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes (still use client-side listener for real-time updates)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.push("/myprofile");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  // Fetch main headline posts for carousel
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const res = await fetch("/api/posts/main-headlines", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to fetch main headline posts");
          setGalleryItems([]);
          return;
        }

        const json = (await res.json().catch(() => ({}))) as any;
        const items: GalleryItem[] = json?.items || [];

        if (items.length > 0) {
          setGalleryItems(items);
          // Reset currentIndex if it's out of bounds
          setCurrentIndex(0);
        } else {
          setGalleryItems([]);
        }
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setGalleryItems([]);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  // Auto-scroll carousel every 10 seconds
  useEffect(() => {
    if (galleryItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [galleryItems.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // If validation passes, send the magic link
    setIsSending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/myprofile/profile-details&post_login=1`,
        },
      });

      if (error) {
        setEmailError(error.message);
        setIsSending(false);
      } else {
        // Show success state
        setIsSubmitted(true);
        setIsSending(false);
      }
    } catch (error) {
      setEmailError("An unexpected error occurred. Please try again.");
      setIsSending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/myprofile/profile-details&post_login=1`,
        },
      });

      if (error) {
        console.error("Error initiating Google OAuth:", error);
        setEmailError(error.message);
        setIsGoogleLoading(false);
      }
      // If successful, user will be redirected to Google, so we don't reset loading state
    } catch (error) {
      console.error("Unexpected error with Google OAuth:", error);
      setEmailError("An unexpected error occurred. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const currentItem =
    galleryItems.length > 0 ? galleryItems[currentIndex] : null;

  // Show nothing while checking or if redirecting
  if (loading) {
    return null;
  }

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

          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Google OAuth Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isSending}
                className="h-11 w-full border-2 font-sans"
              >
                <Chrome className="mr-2 h-4 w-4" />
                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    className={`w-full font-sans ${
                      emailError ? "border-red-500" : ""
                    }`}
                    disabled={isSending || isGoogleLoading}
                  />
                  {emailError && (
                    <p className="font-sans text-red-500 text-sm">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isSending || isGoogleLoading}
                  className="h-11 w-full bg-foreground font-sans text-background hover:bg-foreground/90"
                >
                  {isSending ? "Sending..." : "Send sign-in link"}
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
                  Check your inbox — we sent a secure sign-in link to{" "}
                  <strong>{email}</strong>. Click it to sign in.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent font-sans"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setEmailError("");
                }}
              >
                Try another email
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Gallery Carousel */}
      {!galleryLoading && galleryItems.length > 0 && currentItem && (
        <div className="relative hidden flex-1 bg-gradient-to-br from-orange-200 via-pink-300 to-emerald-200 lg:flex">
          {/* Gallery Content */}
          <div className="relative h-full w-full">
            {/* Image Container */}
            <div className="relative h-full w-full">
              {/* Image */}
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={currentItem.image || "/placeholder.svg"}
                  alt={currentItem.title}
                  fill
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
