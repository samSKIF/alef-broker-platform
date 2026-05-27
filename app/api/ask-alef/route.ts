import type { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/ai/openai";
import {
  getAiConfig,
  listEnabledAiSources,
} from "@/features/ask-alef/queries";
import type { ChatMessage } from "@/features/ask-alef/types";

// PRD §6.6 + §9 — Ask Alef API. POST { messages: [{role, content}, ...] }
// streams the assistant's reply back as plain-text chunks.
//
// Config-driven: instructions + model knobs come from ai_config, knowledge
// from ai_sources. Admin's AI Training screen (1.5.8) can edit both
// without redeploying.
//
// Phase 1 keeps it simple per PRD §9 — full source text injected into the
// system prompt. Vector / embeddings retrieval is Phase 2 (PROJECT_PLAN 2.5).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TURNS = 16;
const MAX_USER_CHARS = 4000;

function isValidMessage(m: unknown): m is ChatMessage {
  if (typeof m !== "object" || m === null) return false;
  const r = m as Record<string, unknown>;
  return (
    (r.role === "user" || r.role === "assistant") &&
    typeof r.content === "string"
  );
}

function buildSystemPrompt(
  instructions: string,
  sources: { title: string; content: string | null }[],
): string {
  const sourceBlock = sources
    .filter((s) => s.content && s.content.trim().length > 0)
    .map((s) => `## ${s.title}\n${s.content}`)
    .join("\n\n");
  return [
    instructions,
    "",
    "---",
    "SOURCES",
    "---",
    sourceBlock || "(no sources available)",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messages = Array.isArray((body as { messages?: unknown })?.messages)
    ? ((body as { messages: unknown[] }).messages.filter(
        isValidMessage,
      ) as ChatMessage[])
    : [];

  if (messages.length === 0) {
    return new Response("Missing messages", { status: 400 });
  }

  // Cap context — most recent N turns, with each user message truncated.
  const trimmed = messages.slice(-MAX_TURNS).map((m) =>
    m.role === "user"
      ? { ...m, content: m.content.slice(0, MAX_USER_CHARS) }
      : m,
  );

  // Pull config + sources fresh on every request — admin edits take effect
  // immediately, no cache to bust.
  const [config, sources] = await Promise.all([
    getAiConfig(),
    listEnabledAiSources(),
  ]);

  const systemPrompt = buildSystemPrompt(config.instructions, sources);

  const openai = getOpenAIClient();

  let openaiStream: AsyncIterable<{
    choices: { delta: { content?: string | null } }[];
  }>;
  try {
    openaiStream = await openai.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      max_completion_tokens: config.max_output_tokens,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...trimmed,
      ],
    });
  } catch (err) {
    console.error("ask-alef: openai create failed", err);
    return new Response("Upstream AI error", { status: 502 });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of openaiStream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        console.error("ask-alef: stream error", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
