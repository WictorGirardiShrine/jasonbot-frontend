import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type {
  CreateSessionResponse,
  MessageWithFeedback,
  Session,
} from "@/lib/types/chat";
import type { Me } from "@/lib/api/client";

async function authedServerFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const supabase = await createSupabaseServerClient();
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

  return fetch(`${env.API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

async function jsonOrThrow<T>(res: Response, label: string): Promise<T> {
  if (!res.ok) throw new Error(`${label} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getMeServer(): Promise<Me> {
  return jsonOrThrow(await authedServerFetch("/me"), "GET /me");
}

export async function listSessionsServer(): Promise<Session[]> {
  return jsonOrThrow(await authedServerFetch("/sessions"), "GET /sessions");
}

export async function createSessionServer(): Promise<CreateSessionResponse> {
  return jsonOrThrow(
    await authedServerFetch("/sessions", { method: "POST" }),
    "POST /sessions",
  );
}

export async function listMessagesServer(
  sessionId: string,
): Promise<MessageWithFeedback[]> {
  return jsonOrThrow(
    await authedServerFetch(`/sessions/${sessionId}/messages`),
    "GET /sessions/:id/messages",
  );
}
