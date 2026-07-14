"use client";

import { useEffect, useMemo, useReducer } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

const authLinkClass =
  "shrink-0 font-sans text-[13px] font-semibold text-news-text no-underline transition-colors duration-150 hover:text-news-primary";

type AuthState = { user: User | null; loading: boolean };

type AuthAction =
  | { type: "resolved"; user: User | null }
  | { type: "auth_change"; user: User | null };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "resolved":
      return { user: action.user, loading: false };
    case "auth_change":
      return { ...state, user: action.user, loading: false };
    default:
      return state;
  }
}

const initialAuthState: AuthState = { user: null, loading: true };

export function NavbarAuthLink() {
  const supabase = useMemo(() => createClient(), []);
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      dispatch({ type: "resolved", user: session?.user ?? null });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted || event === "INITIAL_SESSION") return;
      dispatch({ type: "auth_change", user: session?.user ?? null });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (state.loading) {
    return (
      <span className={cn(authLinkClass, "invisible")} aria-hidden>
        Sign in
      </span>
    );
  }

  if (state.user) {
    return (
      <Link href="/myprofile" className={authLinkClass}>
        Account
      </Link>
    );
  }

  return (
    <Link href="/signin" className={authLinkClass}>
      Sign in
    </Link>
  );
}
