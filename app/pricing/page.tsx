import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PricingCards } from "@/components/billing/pricing-cards";

export const metadata = { title: "Pricing — JasonBot" };

export default function PricingPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
      <Link
        href="/chat"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to chat
      </Link>

      <header className="mt-8 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Choose your plan
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Free to try. Upgrade when you&apos;re ready for unlimited coaching.
        </p>
      </header>

      <div className="mt-10">
        <PricingCards defaultPlan="annual" />
      </div>
    </main>
  );
}
