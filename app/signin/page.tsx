"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Logo } from "@/app/components/layout/navbar/logo";

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
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/myprofile`,
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

  const currentItem =
    galleryItems.length > 0 ? galleryItems[currentIndex] : null;

  // Show nothing while checking or if redirecting
  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo variant="logo-only" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-center mb-2 font-sans">
            Sign in to continue
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-8 font-sans">
            Enter your email and we’ll send a secure link to sign in or create
            your account.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground font-sans"
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
                  disabled={isSending}
                />
                {emailError && (
                  <p className="text-sm text-red-500 font-sans">{emailError}</p>
                )}
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isSending}
                className="w-full bg-foreground text-background hover:bg-foreground/90 h-11 font-sans"
              >
                {isSending ? "Sending..." : "Send sign-in link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-green-900 mb-2 font-sans">
                  Check your email
                </h2>
                <p className="text-green-700 font-sans">
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
        <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-orange-200 via-pink-300 to-emerald-200">
          {/* Gallery Content */}
          <div className="w-full h-full relative">
            {/* Image Container */}
            <div className="w-full h-full relative">
              {/* Image */}
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src={currentItem.image || "/placeholder.svg"}
                  alt={currentItem.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-20 left-0 right-0 px-8 py-6">
                  {currentItem.slug ? (
                    <Link href={`/post/${currentItem.slug}`}>
                      <h2 className="text-white text-5xl font-bold text-shadow font-sans mb-4 hover:underline cursor-pointer">
                        {currentItem.title}
                      </h2>
                    </Link>
                  ) : (
                    <h2 className="text-white text-4xl font-bold text-shadow font-sans mb-4">
                      {currentItem.title}
                    </h2>
                  )}
                  {currentItem.slug && (
                    <Link
                      href={`/post/${currentItem.slug}`}
                      className="inline-block text-white text-base font-medium hover:underline underline-offset-4 transition-all font-sans"
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
