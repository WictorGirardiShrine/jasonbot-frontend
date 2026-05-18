"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FreeLimitExceededError, sendMessage, streamResponse } from "@/lib/api/client";
import type { MessageWithFeedback } from "@/lib/types/chat";
import { useSubscriptionStore } from "@/lib/store/subscription-store";
import { UpgradeModal } from "@/components/billing/upgrade-modal";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { HelpLink } from "./help-link";
import { QuickReplies, shouldShowQuickReplies } from "./quick-replies";

export function MessageList({
  sessionId,
  initialMessages,
}: {
  sessionId: string;
  initialMessages: MessageWithFeedback[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<MessageWithFeedback[]>(initialMessages);
  const [busy, setBusy] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeUsage, setUpgradeUsage] = useState<{ used: number; limit: number } | undefined>();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const bumpUsage = useSubscriptionStore((s) => s.bumpUsage);
  const refreshSubscription = useSubscriptionStore((s) => s.refresh);

  useEffect(() => {
    setItems(initialMessages);
  }, [initialMessages, sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items.length, items[items.length - 1]?.content.length]);

  const submit = async (content: string) => {
    if (busy) return;
    setBusy(true);

    const tempUserId = `temp-user-${crypto.randomUUID()}`;
    const tempAsstId = `temp-asst-${crypto.randomUUID()}`;
    setItems((prev) => [
      ...prev,
      {
        id: tempUserId,
        sessionId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
        feedback: null,
      },
    ]);

    try {
      const persistedUser = await sendMessage(sessionId, content);
      bumpUsage();
      setItems((prev) =>
        prev.map((m) =>
          m.id === tempUserId ? { ...persistedUser, feedback: null } : m,
        ),
      );

      setItems((prev) => [
        ...prev,
        {
          id: tempAsstId,
          sessionId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
          feedback: null,
        },
      ]);

      for await (const ev of streamResponse(sessionId)) {
        if (ev.type === "text_delta") {
          setItems((prev) =>
            prev.map((m) =>
              m.id === tempAsstId ? { ...m, content: m.content + ev.text } : m,
            ),
          );
        } else if (ev.type === "assistant_message") {
          setItems((prev) =>
            prev.map((m) =>
              m.id === tempAsstId
                ? {
                    id: ev.id,
                    sessionId,
                    role: "assistant",
                    content: ev.content,
                    createdAt: ev.createdAt,
                    feedback: null,
                  }
                : m,
            ),
          );
        } else if (ev.type === "error") {
          setItems((prev) => prev.filter((m) => m.id !== tempAsstId));
          alert(ev.message ?? ev.code ?? "Something went wrong");
          break;
        } else if (ev.type === "done") {
          break;
        }
      }

      router.refresh();
    } catch (err) {
      setItems((prev) =>
        prev.filter((m) => m.id !== tempUserId && m.id !== tempAsstId),
      );
      if (err instanceof FreeLimitExceededError) {
        setUpgradeUsage({ used: err.used, limit: err.limit });
        setUpgradeOpen(true);
        void refreshSubscription();
      } else {
        alert(err instanceof Error ? err.message : "Couldn't send message");
      }
    } finally {
      setBusy(false);
    }
  };

  const last = items[items.length - 1];
  const showChips =
    !busy &&
    !!last &&
    last.role === "assistant" &&
    shouldShowQuickReplies(last.content);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {items.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {showChips ? (
            <div className="flex justify-start">
              <QuickReplies onSelect={(text) => void submit(text)} disabled={busy} />
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl shrink-0 px-6 pb-6">
        <div className="mb-2 flex justify-center">
          <HelpLink />
        </div>
        <MessageInput onSubmit={submit} disabled={busy} />
      </div>
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} usage={upgradeUsage} />
    </div>
  );
}
