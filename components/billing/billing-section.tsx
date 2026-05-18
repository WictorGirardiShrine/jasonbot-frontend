"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortalSession } from "@/lib/api/client";
import { useSubscriptionStore } from "@/lib/store/subscription-store";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  monthly: "Monthly — $6/month",
  annual: "Annual — $64.80/year",
};

const STATUS_LABELS: Record<string, string> = {
  none: "Not subscribed",
  active: "Active",
  trialing: "Trial",
  past_due: "Payment past due",
  canceled: "Cancelled",
  incomplete: "Incomplete",
};

export function BillingSection() {
  const snap = useSubscriptionStore((s) => s.snapshot);
  const loading = useSubscriptionStore((s) => s.loading);
  const refresh = useSubscriptionStore((s) => s.refresh);
  const [portalPending, setPortalPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!snap && !loading) void refresh();
  }, [snap, loading, refresh]);

  const openPortal = async () => {
    setError(null);
    setPortalPending(true);
    try {
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't open billing portal");
      setPortalPending(false);
    }
  };

  if (!snap) {
    return (
      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        Loading subscription…
      </div>
    );
  }

  const renewal = snap.currentPeriodEnd ? new Date(snap.currentPeriodEnd) : null;

  return (
    <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Plan</p>
          <p className="text-base font-semibold">{PLAN_LABELS[snap.plan] ?? snap.plan}</p>
        </div>
        <span className="rounded-full bg-background px-3 py-1 text-xs font-medium">
          {STATUS_LABELS[snap.status] ?? snap.status}
        </span>
      </div>

      {snap.isPaid ? (
        <>
          {renewal ? (
            <p className="text-sm text-muted-foreground">
              {snap.cancelAtPeriodEnd ? "Cancels on " : "Renews on "}
              <span className="text-foreground">
                {renewal.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full rounded-full"
            onClick={() => void openPortal()}
            disabled={portalPending}
          >
            {portalPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Opening portal…
              </>
            ) : (
              "Manage subscription"
            )}
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground">{snap.usageToday}</span> of{" "}
            <span className="text-foreground">{snap.dailyLimit}</span> free messages used today.
          </p>
          <Button asChild className="h-10 w-full rounded-full">
            <Link href="/pricing">Upgrade for unlimited coaching</Link>
          </Button>
        </>
      )}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
