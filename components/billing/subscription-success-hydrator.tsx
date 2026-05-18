"use client";

import { useEffect } from "react";
import { useSubscriptionStore } from "@/lib/store/subscription-store";

export function SubscriptionSuccessHydrator() {
  const refresh = useSubscriptionStore((s) => s.refresh);
  useEffect(() => {
    // Webhook may land slightly after the redirect — retry a couple times.
    let attempts = 0;
    const tick = async () => {
      attempts++;
      await refresh();
      const snap = useSubscriptionStore.getState().snapshot;
      if ((!snap || !snap.isPaid) && attempts < 5) {
        setTimeout(() => void tick(), 1500);
      }
    };
    void tick();
  }, [refresh]);
  return null;
}
