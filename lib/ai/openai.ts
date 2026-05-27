import "server-only";
import OpenAI from "openai";

// Server-only singleton. The OpenAI key never leaves the server bundle —
// `server-only` enforces it at build time.
let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}
