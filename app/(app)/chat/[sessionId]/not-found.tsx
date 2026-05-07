import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SessionNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold tracking-tight">Session not found</h1>
      <p className="text-sm text-muted-foreground">
        This session may have been deleted, or it doesn&apos;t belong to your account.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/chat">Back to your sessions</Link>
      </Button>
    </main>
  );
}
