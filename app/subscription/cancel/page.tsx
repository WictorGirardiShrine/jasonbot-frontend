import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Checkout cancelled — JasonBot" };

export default function SubscriptionCancelPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-16 text-center">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Checkout cancelled
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        No charge was made. You can keep using the free tier or revisit pricing
        anytime.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Button asChild className="h-11 rounded-full">
          <Link href="/pricing">Back to pricing</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-full">
          <Link href="/chat">Continue on free tier</Link>
        </Button>
      </div>
    </main>
  );
}
