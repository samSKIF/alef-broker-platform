"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Icon } from "@/components/shared";
import { AlefAIAvatar } from "./AlefAIAvatar";
import type { ChatMessage } from "../types";

// Ask Alef chat surface (PRD §6.6). Posts to /api/ask-alef and streams the
// assistant's reply as plain-text chunks. Three suggestion chips for cold
// starts; tap-to-send.

const SUGGESTIONS = [
  "Compare Hayyan and Olfah for a family buyer",
  "What's the cheapest entry-point in the Alef portfolio?",
  "Draft a WhatsApp pitch for Palace Residences",
];

const INITIAL_GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Ahlan. I'm Alef AI — your sales co-pilot. Ask me anything about Alef's projects: units, pricing, status, amenities, or how to position them for clients.",
};

export function AskAlefChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom on every message tick.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;
      setError(null);
      const next: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ];
      setMessages(next);
      setInput("");
      setStreaming(true);

      try {
        const res = await fetch("/api/ask-alef", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Drop the initial greeting from what we send upstream — it's a
          // UI affordance, not part of the conversation history.
          body: JSON.stringify({
            messages: next
              .slice(1) // drop the greeting
              .filter((m) => m.content.length > 0 || m.role === "user")
              .map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(
            res.status === 502
              ? "Alef AI is having a moment. Try again in a sec."
              : `Server returned ${res.status}`,
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const out = [...prev];
            out[out.length - 1] = { role: "assistant", content: buf };
            return out;
          });
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
        setMessages((prev) => {
          const out = [...prev];
          // If the last assistant bubble is empty, replace it with the
          // error so the user sees the failure inline.
          const last = out[out.length - 1];
          if (last && last.role === "assistant" && last.content === "") {
            out[out.length - 1] = {
              role: "assistant",
              content: `_${msg}_`,
            };
          }
          return out;
        });
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-line bg-bg px-4 pb-3 pt-13">
        <Link
          href="/home"
          aria-label="Back"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-card text-ink shadow-soft-sm"
        >
          <Icon name="chevron-left" size={20} />
        </Link>
        <AlefAIAvatar size={32} pulse={streaming} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[15px] font-bold tracking-[-0.005em]">
              Alef AI
            </div>
            <div className="rounded-pill border border-line bg-card px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.13em] text-ink-3">
              Beta
            </div>
          </div>
          <div className="text-[11.5px] text-ink-3">
            Grounded in Alef data · gpt-4o-mini
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 pb-4 pt-5"
      >
        <div className="flex flex-col gap-4">
          {messages.map((m, i) => (
            <MessageBubble
              key={i}
              role={m.role}
              content={m.content}
              streaming={
                streaming &&
                m.role === "assistant" &&
                i === messages.length - 1
              }
            />
          ))}
          {error && (
            <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
              {error}
            </div>
          )}
          {/* Cold-start suggestion chips */}
          {messages.length === 1 && !streaming && (
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-pill border border-line bg-card px-3 py-2 text-[12px] font-semibold text-ink-2 shadow-soft-sm hover:bg-tint"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="shrink-0 border-t border-line bg-bg px-3 pb-5 pt-3"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-line bg-card p-1.5 shadow-soft-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask Alef anything…"
            rows={1}
            disabled={streaming}
            className="min-h-9 max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-[14px] leading-snug text-ink outline-none placeholder:text-ink-3 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={streaming || input.trim().length === 0}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-accent transition-opacity disabled:opacity-40"
          >
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming: boolean;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[14px] leading-snug text-white">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">
        <AlefAIAvatar size={28} pulse={streaming} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-md bg-card px-3.5 py-2.5 text-[14px] leading-relaxed text-ink shadow-soft-sm">
          <span className="whitespace-pre-wrap">{content || ""}</span>
          {streaming && content.length === 0 && (
            <span className="inline-flex items-center gap-1 text-ink-3">
              <Dot />
              <Dot delay={150} />
              <Dot delay={300} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-ink-3"
      style={{
        animation: `aiTypingDot 1.2s ease-in-out ${delay}ms infinite`,
      }}
    />
  );
}
