import { redirect } from "next/navigation";
import { createSessionServer, listSessionsServer } from "@/lib/api/server";

export default async function ChatIndexPage() {
  const sessions = await listSessionsServer();

  if (sessions.length === 0) {
    const { session } = await createSessionServer();
    redirect(`/chat/${session.id}`);
  }

  redirect(`/chat/${sessions[0].id}`);
}
