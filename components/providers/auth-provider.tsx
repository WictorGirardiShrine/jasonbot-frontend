"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { useSubscriptionStore } from "@/lib/store/subscription-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const refreshSubscription = useSubscriptionStore((s) => s.refresh);
  const resetSubscription = useSubscriptionStore((s) => s.reset);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setInitialized(true);
      if (data.session) void refreshSubscription();
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) void refreshSubscription();
      else resetSubscription();
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [setSession, setInitialized, refreshSubscription, resetSubscription]);

  return <>{children}</>;
}
