"use client";

import { create } from "zustand";
import { getSubscription } from "@/lib/api/client";
import type { SubscriptionSnapshot } from "@/lib/types/billing";

type SubscriptionState = {
  snapshot: SubscriptionSnapshot | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  reset: () => void;
  // Optimistic local bump after a successful sendMessage — keeps the header
  // counter snappy without waiting for the next refresh.
  bumpUsage: () => void;
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  snapshot: null,
  loading: false,
  error: null,
  async refresh() {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const snapshot = await getSubscription();
      set({ snapshot, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Couldn't load subscription",
      });
    }
  },
  reset() {
    set({ snapshot: null, loading: false, error: null });
  },
  bumpUsage() {
    const snap = get().snapshot;
    if (!snap || snap.isPaid) return;
    const usageToday = snap.usageToday + 1;
    set({
      snapshot: {
        ...snap,
        usageToday,
        remainingToday: Math.max(0, snap.dailyLimit - usageToday),
      },
    });
  },
}));
