"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { createSession } from "@/lib/api/client";
import type { Session } from "@/lib/types/chat";
import { RenameSessionDialog } from "./rename-session-dialog";
import { DeleteSessionDialog } from "./delete-session-dialog";

type DialogState =
  | { kind: "none" }
  | { kind: "rename"; sessionId: string; title: string }
  | { kind: "delete"; sessionId: string; title: string };

export function ChatSidebar({
  sessions,
  activeId,
}: {
  sessions: Session[];
  activeId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => s.title.toLowerCase().includes(q));
  }, [sessions, search]);

  const onNewSession = async () => {
    setCreating(true);
    try {
      const { session } = await createSession();
      router.push(`/chat/${session.id}`);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't create session");
    } finally {
      setCreating(false);
    }
  };

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-border bg-sidebar">
      <div className="space-y-3 p-4">
        <Button
          onClick={onNewSession}
          disabled={creating}
          className="h-10 w-full justify-start gap-2 rounded-lg"
        >
          <Plus className="size-4" />
          {creating ? "Creating…" : "New session"}
        </Button>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions…"
            className="h-9 pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-2">
        <ul className="space-y-0.5 pb-4">
          {filtered.map((s) => {
            const active = pathname === `/chat/${s.id}` || activeId === s.id;
            return (
              <li
                key={s.id}
                className={cn(
                  "group flex items-center justify-between rounded-md px-2 py-2 text-sm",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/60",
                )}
              >
                <Link
                  href={`/chat/${s.id}`}
                  className="min-w-0 flex-1 truncate"
                  prefetch={false}
                >
                  <div className="truncate font-medium text-foreground">{s.title}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {formatDate(s.updatedAt)}
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                      aria-label="Session options"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() =>
                        setDialog({ kind: "rename", sessionId: s.id, title: s.title })
                      }
                    >
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        setDialog({ kind: "delete", sessionId: s.id, title: s.title })
                      }
                      className="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            );
          })}
          {filtered.length === 0 && search ? (
            <li className="px-2 py-6 text-center text-xs text-muted-foreground">
              No sessions match &ldquo;{search}&rdquo;
            </li>
          ) : null}
        </ul>
      </ScrollArea>

      {dialog.kind === "rename" ? (
        <RenameSessionDialog
          open
          onOpenChange={(v) => !v && setDialog({ kind: "none" })}
          sessionId={dialog.sessionId}
          initialTitle={dialog.title}
        />
      ) : null}
      {dialog.kind === "delete" ? (
        <DeleteSessionDialog
          open
          onOpenChange={(v) => !v && setDialog({ kind: "none" })}
          sessionId={dialog.sessionId}
          title={dialog.title}
        />
      ) : null}
    </aside>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}
