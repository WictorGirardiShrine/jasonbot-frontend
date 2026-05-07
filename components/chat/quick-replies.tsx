"use client";

import { Button } from "@/components/ui/button";

const READY_RE = /well\s+i['’‘]?m\s+here\s+for\s+when\s+you\s+are\s+ready!?/i;

const CHIP_LABELS = ["Give me a minute", "Actually, let's start."] as const;

export function shouldShowQuickReplies(content: string): boolean {
  return READY_RE.test(content);
}

export function QuickReplies({
  onSelect,
  disabled,
}: {
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {CHIP_LABELS.map((label) => (
        <Button
          key={label}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelect(label)}
          className="rounded-full"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
