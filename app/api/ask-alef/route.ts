import type { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/ai/openai";
import {
  getAiConfig,
  listEnabledAiSources,
} from "@/features/ask-alef/queries";
import type { ChatMessage } from "@/features/ask-alef/types";
import { getBrokerIdFromCookie } from "@/lib/dummy-account";
import { getBrokerById } from "@/features/brokers/queries";
import {
  listPublishedModules,
  listCompletedModuleIds,
} from "@/features/training/queries";
import { listPublishedCampaigns } from "@/features/campaigns/queries";
import { TIERS, nextTier } from "@/features/brokers";
import type { Module } from "@/features/training/types";
import type { Campaign } from "@/features/campaigns/types";
import type { Broker } from "@/features/brokers/types";
import type { QuizQuestion } from "@/features/training/types";

// PRD §6.6 + §9 — Ask Alef API. POST { messages: [{role, content}, ...] }
// streams the assistant's reply back as plain-text chunks.
//
// Scope (PRD §12 decision, 27 May 2026 — expanded from "indexed projects
// only"): Alef projects, training modules, ongoing/past campaigns, and
// the broker loyalty program (points + tiers). The system prompt is built
// fresh per request from:
//
//   - ai_config.instructions  (admin-editable rules)
//   - ai_sources              (admin-editable knowledge: brochures + points
//                              policy)
//   - modules                 (live catalog — title, kind, duration, points,
//                              tier gating, quiz topics)
//   - campaigns               (live published campaigns)
//   - brokers + activity      (the requesting broker's name, tier, points,
//                              and completed module IDs — only when the
//                              broker_id cookie is present)
//
// Dynamic injection means admin edits in /admin/projects, /admin/academy,
// /admin/campaigns, /admin/push, /admin/ai-training take effect on the
// NEXT chat request — no cache, no rebuild.
//
// Phase 1 still keeps it simple per PRD §9 — full content stuffed in the
// system prompt. Vector retrieval is Phase 2 (PROJECT_PLAN 2.5).

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

// ---- Block formatters ----------------------------------------------------
// Each returns the multi-line text that goes under a "## Block" heading in
// the system prompt. Kept short and tabular so the AI can scan quickly.

function formatModulesBlock(modules: Module[]): string {
  if (modules.length === 0) return "(no published modules yet)";
  return modules
    .map((m) => {
      // Quiz topics give the AI a hint of the module's content without
      // dumping the full quiz JSON.
      let topics = "";
      if (Array.isArray(m.quiz) && m.quiz.length > 0) {
        const qs = (m.quiz as unknown as QuizQuestion[])
          .map((q) => q.q)
          .filter(Boolean)
          .slice(0, 4);
        if (qs.length > 0) topics = ` — quiz topics: ${qs.join(" / ")}`;
      }
      const tier = m.tier_required ? ` · ${m.tier_required}+ tier` : "";
      const dur = m.duration ? ` · ${m.duration}` : "";
      const proj = m.project_id ? ` · project: ${m.project_id}` : "";
      const when =
        m.kind === "live" && (m.when_at || m.location)
          ? ` · ${[m.when_at, m.location].filter(Boolean).join(" @ ")}`
          : "";
      return `- [${m.id}] ${m.title} (${m.kind}, ${m.points} pts${dur}${tier}${proj}${when})${topics}`;
    })
    .join("\n");
}

function formatCampaignsBlock(campaigns: Campaign[]): string {
  if (campaigns.length === 0) return "(no published campaigns yet)";
  return campaigns
    .map((c) => {
      const sub = c.subtitle ? ` — ${c.subtitle}` : "";
      const sched = c.schedule ? ` · ${c.schedule}` : "";
      const tag = c.tag ? ` [${c.tag}]` : "";
      return `- ${c.title}${tag}${sub}${sched}`;
    })
    .join("\n");
}

function formatTierLadder(): string {
  return TIERS.map(
    (t) => `- ${t.tier}: ${t.threshold.toLocaleString("en-US")}+ points`,
  ).join("\n");
}

function formatBrokerBlock(
  broker: Broker,
  completedModuleIds: Set<string>,
  modules: Module[],
): string {
  const next = nextTier(broker.points);
  const firstName = broker.name.split(/\s+/)[0] ?? broker.name;
  const completedNames =
    completedModuleIds.size === 0
      ? "(none yet)"
      : modules
          .filter((m) => completedModuleIds.has(m.id))
          .map((m) => `${m.title} [${m.id}]`)
          .join(", ");
  return [
    `Name: ${broker.name} (first name: ${firstName})`,
    `Brokerage: ${broker.brokerage} · Role: ${broker.role}`,
    `Current tier: ${broker.tier} · Current points: ${broker.points.toLocaleString("en-US")}`,
    next
      ? `Next tier: ${next.name} — needs ${next.remaining.toLocaleString("en-US")} more points`
      : `Already at Preferred — top of the ladder.`,
    `Completed modules: ${completedNames}`,
  ].join("\n");
}

function buildSystemPrompt({
  instructions,
  sources,
  modules,
  campaigns,
  broker,
  completedModuleIds,
}: {
  instructions: string;
  sources: { title: string; content: string | null }[];
  modules: Module[];
  campaigns: Campaign[];
  broker: Broker | null;
  completedModuleIds: Set<string>;
}): string {
  const sourceBlock = sources
    .filter((s) => s.content && s.content.trim().length > 0)
    .map((s) => `## ${s.title}\n${s.content}`)
    .join("\n\n");

  const parts: string[] = [instructions, "", "---", "SOURCES", "---"];
  parts.push(sourceBlock || "(no sources available)");

  parts.push("", "---", "TRAINING CATALOG (live, from DB)", "---");
  parts.push(formatModulesBlock(modules));

  parts.push("", "---", "CAMPAIGNS (live, from DB)", "---");
  parts.push(formatCampaignsBlock(campaigns));

  parts.push("", "---", "TIER LADDER (canonical thresholds)", "---");
  parts.push(formatTierLadder());

  if (broker) {
    parts.push("", "---", "CURRENT BROKER (the person you're talking to)", "---");
    parts.push(formatBrokerBlock(broker, completedModuleIds, modules));
  } else {
    parts.push("", "---", "CURRENT BROKER", "---");
    parts.push(
      "(no broker cookie — answer generically, do not assume any personal points/tier)",
    );
  }

  return parts.join("\n");
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

  // Pull everything in parallel. Per-broker data only loads when the
  // broker_id cookie is present (which it is for any authenticated
  // broker-app session).
  const brokerId = await getBrokerIdFromCookie();
  const [config, sources, modules, campaigns, broker, completedModuleIds] =
    await Promise.all([
      getAiConfig(),
      listEnabledAiSources(),
      listPublishedModules(),
      listPublishedCampaigns(),
      brokerId ? getBrokerById(brokerId) : Promise.resolve(null),
      brokerId
        ? listCompletedModuleIds(brokerId)
        : Promise.resolve(new Set<string>()),
    ]);

  const systemPrompt = buildSystemPrompt({
    instructions: config.instructions,
    sources,
    modules,
    campaigns,
    broker,
    completedModuleIds,
  });

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
