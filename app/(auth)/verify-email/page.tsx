import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata = { title: "Check your email — JasonBot" };

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Check your email"
      subtitle="We sent you a confirmation link. Click it to activate your account, then come back here to sign in."
      footer={
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        Didn&apos;t get the email? Check your spam folder, or try signing up again with a different address.
      </div>
    </AuthCard>
  );
}
