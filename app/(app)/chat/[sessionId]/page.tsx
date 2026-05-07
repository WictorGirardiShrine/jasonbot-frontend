import { notFound } from "next/navigation";
import { ChatShell } from "@/components/chat/chat-shell";
import { listMessagesServer, listSessionsServer } from "@/lib/api/server";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ChatSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  if (!UUID_REGEX.test(sessionId)) notFound();

  const [sessions, messages] = await Promise.all([
    listSessionsServer(),
    listMessagesServer(sessionId).catch(() => null),
  ]);

  if (!messages || !sessions.some((s) => s.id === sessionId)) {
    notFound();
  }

  return (
    <ChatShell
      sessions={sessions}
      activeSessionId={sessionId}
      initialMessages={messages}
    />
  );
}
