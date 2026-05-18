"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSubscriptionStore } from "@/lib/store/subscription-store";

export function ChatHeader({ title = "JasonBot" }: { title?: string }) {
  const router = useRouter();
  const snap = useSubscriptionStore((s) => s.snapshot);

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const showUsage = snap && !snap.isPaid;
  const remaining = showUsage ? Math.max(0, snap.dailyLimit - snap.usageToday) : 0;
  const low = showUsage && remaining <= 2;

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        {showUsage ? (
          <Link
            href="/pricing"
            aria-label="View pricing"
            className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition sm:inline-flex ${
              low
                ? "bg-destructive text-white shadow-sm hover:brightness-110"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            <span>
              {snap.usageToday}/{snap.dailyLimit} today
            </span>
            <span aria-hidden className={low ? "opacity-70" : "opacity-50"}>
              ·
            </span>
            <span>Upgrade</span>
          </Link>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Account">
              <UserIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <Settings className="size-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={signOut}>
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
