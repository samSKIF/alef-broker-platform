import type { Database } from "@/types/database";

export type AiConfig = Database["public"]["Tables"]["ai_config"]["Row"];
export type AiSource = Database["public"]["Tables"]["ai_sources"]["Row"];

// Chat message shape the /api/ask-alef route and the chat UI both speak.
// Mirrors OpenAI's role naming so we can pass it through (mostly) verbatim.
export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};
