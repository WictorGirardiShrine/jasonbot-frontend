import type { MessageWithFeedback, Session } from "@/lib/types/chat";
import { ChatHeader } from "./chat-header";
import { ChatSidebar } from "./chat-sidebar";
import { MessageList } from "./message-list";

export function ChatShell({
  sessions,
  activeSessionId,
  initialMessages,
}: {
  sessions: Session[];
  activeSessionId: string;
  initialMessages: MessageWithFeedback[];
}) {
  return (
    <div className="flex h-screen w-full">
      <ChatSidebar sessions={sessions} activeId={activeSessionId} />
      <div className="flex flex-1 flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <MessageList sessionId={activeSessionId} initialMessages={initialMessages} />
        </div>
      </div>
    </div>
  );
}
