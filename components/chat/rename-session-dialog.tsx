"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { renameSession } from "@/lib/api/client";

export function RenameSessionDialog({
  open,
  onOpenChange,
  sessionId,
  initialTitle,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sessionId: string;
  initialTitle: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [submitting, setSubmitting] = useState(false);

  const onSave = async () => {
    const next = title.trim();
    if (!next || next === initialTitle) {
      onOpenChange(false);
      return;
    }
    setSubmitting(true);
    try {
      await renameSession(sessionId, next);
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Couldn't rename session");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename session</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="session-title">Title</Label>
          <Input
            id="session-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            maxLength={120}
            className="h-10"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={submitting || !title.trim()}>
            {submitting ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
