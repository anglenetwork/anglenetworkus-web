"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/app/components/layout/navbar/logo";
import { Chrome } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Dispatch } from "react";
import type { SignInAction, SignInState } from "./sign-in-state";

interface SignInFormPanelProps {
  state: SignInState;
  dispatch: Dispatch<SignInAction>;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
}

export function SignInFormPanel({
  state,
  dispatch,
  onSubmit,
  onGoogleSignIn,
}: SignInFormPanelProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo variant="logo-only" />
        </div>

        <h1 className="mb-2 text-center font-bold font-display text-2xl">
          Sign in to continue
        </h1>
        <p className="mb-8 text-center font-sans text-muted-foreground text-sm">
          Enter your email and we’ll send a secure link to sign in or create
          your account.
        </p>

        {!state.isSubmitted ? (
          <div className="space-y-6">
            <Button
              type="button"
              variant="outline"
              onClick={onGoogleSignIn}
              disabled={state.isGoogleLoading || state.isSending}
              className="h-11 w-full border-2 font-sans"
            >
              <Chrome className="mr-2 size-4" />
              {state.isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </Button>

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

            <form onSubmit={onSubmit} className="space-y-6">
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
  );
}
