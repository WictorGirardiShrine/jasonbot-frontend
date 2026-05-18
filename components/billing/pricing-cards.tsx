"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/auth-store";
import { createCheckoutSession } from "@/lib/api/client";

type Plan = "monthly" | "annual";

const features = [
  "Unlimited messages with JasonBot",
  "Full coaching protocol — anytime",
  "Conversation history saved across sessions",
  "Cancel anytime via Stripe portal",
];

export function PricingCards({ defaultPlan = "annual" }: { defaultPlan?: Plan }) {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(defaultPlan);
  const [pending, setPending] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (plan: Plan) => {
    setError(null);

    if (!session) {
      router.push(`/login?next=/pricing`);
      return;
    }

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
    <div className="space-y-8">
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Billing period"
          className="inline-flex rounded-full border bg-muted/40 p-1 text-sm"
        >
          <button
            role="tab"
            aria-selected={selectedPlan === "monthly"}
            onClick={() => setSelectedPlan("monthly")}
            className={`rounded-full px-4 py-1.5 transition ${
              selectedPlan === "monthly"
                ? "bg-background shadow font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            role="tab"
            aria-selected={selectedPlan === "annual"}
            onClick={() => setSelectedPlan("annual")}
            className={`rounded-full px-4 py-1.5 transition ${
              selectedPlan === "annual"
                ? "bg-background shadow font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual <span className="ml-1 text-xs text-primary">Save 10%</span>
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-center text-sm text-destructive">{error}</p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Free</CardTitle>
            <CardDescription>Try the protocol before you commit.</CardDescription>
            <p className="mt-3 text-4xl font-semibold">
              $0<span className="text-base font-normal text-muted-foreground"> / forever</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>10 messages per day</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Full session history</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Counter resets every day</span>
              </li>
            </ul>
            <Button
              variant="outline"
              className="h-11 w-full rounded-full"
              onClick={() => router.push("/chat")}
            >
              Continue free
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-secondary/40 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-2xl">
                {selectedPlan === "monthly" ? "Monthly" : "Annual"}
              </CardTitle>
              {selectedPlan === "annual" ? (
                <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-primary">
                  Save 10%
                </span>
              ) : null}
            </div>
            <CardDescription>Unlimited coaching, anytime.</CardDescription>
            {selectedPlan === "monthly" ? (
              <p className="mt-3 text-4xl font-semibold">
                $6<span className="text-base font-normal text-muted-foreground"> / month</span>
              </p>
            ) : (
              <div className="mt-3">
                <p className="text-4xl font-semibold">
                  $64.80
                  <span className="text-base font-normal text-muted-foreground"> / year</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Billed annually · $5.40/month equivalent
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="h-11 w-full rounded-full"
              disabled={pending !== null}
              onClick={() => void startCheckout(selectedPlan)}
            >
              {pending === selectedPlan ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Opening checkout…
                </>
              ) : selectedPlan === "monthly" ? (
                "Subscribe — $6/month"
              ) : (
                "Subscribe — $64.80/year"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Tax calculated at checkout. Cancel anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
