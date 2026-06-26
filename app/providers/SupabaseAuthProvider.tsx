"use client";

import React, {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getSupabaseBrowserClient,
  resetSupabaseBrowserClient,
} from "@/lib/supabase/client";

type AuthCtx = {
  userId: string | null;
  ready: boolean;
};

const Ctx = createContext<AuthCtx>({ userId: null, ready: false });

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`${label} timed out`)), ms),
    ),
  ]);
}

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // 1) Subscribe FIRST (so we don't miss events)
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted.current) return;
      setUserId(session?.user?.id ?? null);
      setReady(true);
    });

    // 2) Initial read (but hard-timeout; if auth is locked, we recover)
    (async () => {
      try {
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          3000,
          "auth.getSession",
        );
        if (!mounted.current) return;
        setUserId(data.session?.user?.id ?? null);
        setReady(true);
      } catch (e) {
        // Silently recover from timeout (common in dev/HMR scenarios)
        // Recover from locked state (dev/HMR)
        resetSupabaseBrowserClient();
        const fresh = getSupabaseBrowserClient();
        try {
          const { data } = await fresh.auth.getSession();
          if (!mounted.current) return;
          setUserId(data.session?.user?.id ?? null);
          setReady(true);
        } catch (retryError) {
          // If retry also fails, just set ready to true to unblock UI
          if (!mounted.current) return;
          setReady(true);
        }
      }
    })();

    return () => {
      sub.subscription.unsubscribe();
      void supabase.auth.dispose();
    };
  }, []);

  const value = useMemo(() => ({ userId, ready }), [userId, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSupabaseAuth() {
  return use(Ctx);
}
