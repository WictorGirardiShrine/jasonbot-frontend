"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { setFeedback } from "@/lib/api/client";

export function NoteDialog({
  open,
  onOpenChange,
  messageId,
  initialNote,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  messageId: string;
  initialNote: string | null;
  onSaved: (next: string | null) => void;
}) {
  const [note, setNote] = useState(initialNote ?? "");
  const [submitting, setSubmitting] = useState(false);

  const onSave = async () => {
    setSubmitting(true);
    try {
      const trimmed = note.trim();
      const next: string | null = trimmed === "" ? null : trimmed;
      await setFeedback(messageId, { note: next });
      onSaved(next);
      onOpenChange(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't save note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Note to Jason</DialogTitle>
          <DialogDescription>
            Anything you&apos;d like Jason to know about this message. He can review it later.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          placeholder="Type your note here…"
          maxLength={4000}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={submitting}>
            {submitting ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
