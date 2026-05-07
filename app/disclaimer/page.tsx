"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { acceptDisclaimer } from "@/lib/api/client";
import { DISCLAIMER_TEXT } from "@/lib/schemas/auth";

export default function DisclaimerPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await acceptDisclaimer();
      router.replace("/chat");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">JasonBot</h1>
        <p className="mt-2 text-sm text-muted-foreground">NLP Anxiety Resolution Coach</p>
      </div>
      <AuthCard title="Before we start" subtitle="One quick acknowledgment.">
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3">
            <Checkbox
              id="disclaimer"
              checked={accepted}
              onCheckedChange={(v) => setAccepted(v === true)}
              className="mt-0.5"
            />
            <Label htmlFor="disclaimer" className="text-sm leading-snug font-normal text-muted-foreground">
              {DISCLAIMER_TEXT}
            </Label>
          </div>
          <Button
            type="button"
            onClick={handleContinue}
            disabled={!accepted || submitting}
            className="h-11 w-full rounded-full text-sm font-medium"
          >
            {submitting ? "Saving…" : "Continue"}
          </Button>
        </div>
      </AuthCard>
    </main>
  );
}
