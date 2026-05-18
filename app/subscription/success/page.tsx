import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionSuccessHydrator } from "@/components/billing/subscription-success-hydrator";

export const metadata = { title: "You're in — JasonBot" };

export default function SubscriptionSuccessPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-16 text-center">
      <SubscriptionSuccessHydrator />
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="size-7" />
      </div>
      <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight">
        You&apos;re in.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your subscription is active. Step into the chat whenever you&apos;re ready.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Button asChild className="h-11 rounded-full">
          <Link href="/chat">Start coaching</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-full">
          <Link href="/profile">Manage subscription</Link>
        </Button>
      </div>
    </main>
  );
}
