"use client";

import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MessageInput({
  onSubmit,
  disabled = false,
}: {
  onSubmit: (content: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = async () => {
    const content = value.trim();
    if (!content || disabled) return;
    setValue("");
    await onSubmit(content);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border bg-background p-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type your message…"
        rows={1}
        disabled={disabled}
        className="min-h-9 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none focus-visible:ring-0"
      />
      <Button
        type="button"
        size="icon"
        onClick={() => void submit()}
        disabled={disabled || !value.trim()}
        className="size-10 shrink-0 rounded-xl"
        aria-label="Send"
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}
