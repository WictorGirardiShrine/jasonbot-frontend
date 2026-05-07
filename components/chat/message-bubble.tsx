import { cn } from "@/lib/utils";
import type { MessageWithFeedback } from "@/lib/types/chat";
import { MessageActions } from "./message-actions";

export function MessageBubble({ message }: { message: MessageWithFeedback }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={cn("flex flex-col", isAssistant ? "items-start" : "items-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed",
          isAssistant
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        {message.content}
      </div>
      {isAssistant ? (
        <MessageActions messageId={message.id} initialFeedback={message.feedback} />
      ) : null}
    </div>
  );
}
