"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCheckoutSession } from "@/lib/api/client";

type Plan = "monthly" | "annual";

export function UpgradeModal({
  open,
  onOpenChange,
  usage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usage?: { used: number; limit: number };
}) {
  const [pending, setPending] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async (plan: Plan) => {
    setError(null);
    setPending(plan);
    try {
      const { url } = await createCheckoutSession(plan);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start checkout");
      setPending(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            You&apos;ve used your free messages today.
          </DialogTitle>
          <DialogDescription>
            {usage
              ? `${usage.used} of ${usage.limit} daily messages used. Unlock unlimited coaching.`
              : "Unlock unlimited coaching and pick up right where you left off."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Button
            className="h-12 w-full justify-between rounded-xl px-4"
            onClick={() => void start("annual")}
            disabled={pending !== null}
          >
            <span className="flex items-center gap-2">
              {pending === "annual" ? <Loader2 className="size-4 animate-spin" /> : null}
              Annual — $64.80/year
            </span>
            <span className="rounded-full bg-primary-foreground/15 px-2 py-0.5 text-xs font-semibold">
              Save 10%
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-12 w-full rounded-xl"
            onClick={() => void start("monthly")}
            disabled={pending !== null}
          >
            {pending === "monthly" ? <Loader2 className="size-4 animate-spin" /> : null}
            Monthly — $6/month
          </Button>

          {error ? (
            <p className="pt-1 text-center text-xs text-destructive">{error}</p>
          ) : (
            <p className="pt-1 text-center text-xs text-muted-foreground">
              Tax calculated at checkout. Cancel anytime via Stripe.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
