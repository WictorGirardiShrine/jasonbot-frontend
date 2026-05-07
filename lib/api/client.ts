import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { env } from "@/lib/env";
import type {
  CreateSessionResponse,
  Message,
  MessageWithFeedback,
  Session,
  StreamEvent,
} from "@/lib/types/chat";

export type Me = {
  id: string;
  email: string;
  name: string;
  disclaimerAcceptedAt: string | null;
  role: "admin" | "user";
};

async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(init.headers);
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${env.API_URL}${path}`, { ...init, headers });
}

async function jsonOrThrow<T>(res: Response, label: string): Promise<T> {
  if (!res.ok) throw new Error(`${label} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getMe(): Promise<Me> {
  return jsonOrThrow(await authedFetch("/me"), "GET /me");
}

export async function acceptDisclaimer(): Promise<void> {
  const res = await authedFetch("/auth/disclaimer", { method: "POST" });
  if (!res.ok) throw new Error(`POST /auth/disclaimer failed: ${res.status}`);
}

export async function updateProfile(input: { name: string }): Promise<Me> {
  return jsonOrThrow(
    await authedFetch("/me", { method: "PATCH", body: JSON.stringify(input) }),
    "PATCH /me",
  );
}

export async function listSessions(): Promise<Session[]> {
  return jsonOrThrow(await authedFetch("/sessions"), "GET /sessions");
}

export async function createSession(): Promise<CreateSessionResponse> {
  return jsonOrThrow(
    await authedFetch("/sessions", { method: "POST" }),
    "POST /sessions",
  );
}

export async function renameSession(id: string, title: string): Promise<Session> {
  return jsonOrThrow(
    await authedFetch(`/sessions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
    "PATCH /sessions/:id",
  );
}

export async function deleteSession(id: string): Promise<void> {
  const res = await authedFetch(`/sessions/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE /sessions/:id failed: ${res.status}`);
}

export async function listMessages(sessionId: string): Promise<MessageWithFeedback[]> {
  return jsonOrThrow(
    await authedFetch(`/sessions/${sessionId}/messages`),
    "GET /sessions/:id/messages",
  );
}

export async function sendMessage(sessionId: string, content: string): Promise<Message> {
  return jsonOrThrow(
    await authedFetch(`/sessions/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
    "POST /sessions/:id/messages",
  );
}

export async function setFeedback(
  messageId: string,
  body: { flagged?: boolean; note?: string | null },
): Promise<void> {
  const res = await authedFetch(`/messages/${messageId}/feedback`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT /messages/:id/feedback failed: ${res.status}`);
}

export async function* streamResponse(
  sessionId: string,
  signal?: AbortSignal,
): AsyncGenerator<StreamEvent> {
  const res = await authedFetch(`/sessions/${sessionId}/respond`, {
    method: "POST",
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`POST /sessions/:id/respond failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const parsed = parseSseFrame(frame);
        if (parsed) yield parsed;
      }
    }
    if (buffer.trim()) {
      const parsed = parseSseFrame(buffer);
      if (parsed) yield parsed;
    }
  } finally {
    reader.releaseLock();
  }
}

function parseSseFrame(frame: string): StreamEvent | null {
  let event: string | null = null;
  const dataLines: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (!event) return null;
  const data = dataLines.length > 0 ? JSON.parse(dataLines.join("\n")) : {};
  return { type: event, ...data } as StreamEvent;
}
