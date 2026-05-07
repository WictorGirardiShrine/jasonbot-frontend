export type Session = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type MessageWithFeedback = Message & {
  feedback: { flagged: boolean; note: string | null } | null;
};

export type CreateSessionResponse = {
  session: Session;
  messages: Message[];
};

export type StreamEvent =
  | { type: "text_delta"; text: string }
  | { type: "assistant_message"; id: string; createdAt: string; content: string }
  | { type: "error"; code?: string; message?: string }
  | { type: "done" };
