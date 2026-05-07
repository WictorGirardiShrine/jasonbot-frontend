"use client";

import { useState } from "react";
import { Flag, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { setFeedback } from "@/lib/api/client";
import { NoteDialog } from "./note-dialog";

export function MessageActions({
  messageId,
  initialFeedback,
}: {
  messageId: string;
  initialFeedback: { flagged: boolean; note: string | null } | null;
}) {
  const [flagged, setFlagged] = useState(initialFeedback?.flagged ?? false);
  const [note, setNote] = useState<string | null>(initialFeedback?.note ?? null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const toggleFlag = async () => {
    if (pending) return;
    const next = !flagged;
    setFlagged(next);
    setPending(true);
    try {
      await setFeedback(messageId, { flagged: next });
    } catch (err) {
      setFlagged(!next);
      alert(err instanceof Error ? err.message : "Couldn't update flag");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
      <button
        type="button"
        onClick={toggleFlag}
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground",
          flagged && "text-destructive hover:text-destructive",
        )}
      >
        <Flag className={cn("size-3.5", flagged && "fill-destructive")} />
        {flagged ? "Flagged" : "Flag"}
      </button>
      <button
        type="button"
        onClick={() => setNoteOpen(true)}
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground",
          note && "text-foreground",
        )}
      >
        <NotebookPen className="size-3.5" />
        {note ? "Note saved" : "Note to Jason"}
      </button>
      <NoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        messageId={messageId}
        initialNote={note}
        onSaved={setNote}
      />
    </div>
  );
}
