"use client";

import { useState } from "react";
import { Card, Icon, Logo, SubmitButton } from "@/components/shared";
import type { Project } from "@/features/projects";
import { sendNotification } from "../actions";

// PRD §7.6 — Compose form + live broker-phone lock-screen preview.
// Audience targeting maps to PRD §8.5 audience-string convention
// ('all' | 'tier:<T>' | 'engagement:<band>' | 'project:<id>').

type NotificationComposerProps = {
  projects: Pick<Project, "id" | "name">[];
};

type AudienceMode = "all" | "tier" | "engagement" | "project";

const TIERS = ["Bronze", "Silver", "Gold", "Preferred"] as const;
const BANDS = [
  ["highly-engaged", "Highly engaged (80+)"],
  ["engaged", "Engaged (60–79)"],
  ["at-risk", "At risk (30–59)"],
  ["dormant", "Dormant (<30)"],
] as const;
const LINK_TARGETS = [
  { value: "", label: "— none —" },
  { value: "projects", label: "projects (list)" },
  { value: "academy", label: "academy" },
  { value: "activity", label: "activity" },
];

export function NotificationComposer({ projects }: NotificationComposerProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<AudienceMode>("all");
  const [tier, setTier] = useState<string>("Gold");
  const [band, setBand] = useState<string>("at-risk");
  const [project, setProject] = useState<string>(projects[0]?.id ?? "");

  const audienceLabel =
    mode === "all"
      ? "Everyone in the network"
      : mode === "tier"
        ? `${tier} brokers`
        : mode === "engagement"
          ? BANDS.find(([v]) => v === band)?.[1] ?? band
          : `Brokers interested in ${projects.find((p) => p.id === project)?.name ?? project}`;

  return (
    <form
      action={sendNotification}
      className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]"
    >
      {/* Form */}
      <div className="space-y-5">
        <Card pad={22}>
          <SectionTitle title="Message" />
          <Field label="Title" required>
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tomorrow · Hayyan site visit at 11:00"
              required
              className={inputClass}
              maxLength={120}
            />
          </Field>
          <Field label="Body">
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="A second line of detail (optional)."
              rows={3}
              className={inputClass}
              maxLength={240}
            />
          </Field>
          <Field label="Deep-link on tap">
            <select
              name="link_target"
              className={selectClass}
              defaultValue=""
            >
              {LINK_TARGETS.map((o) => (
                <option key={o.value || "none"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </Card>

        <Card pad={22}>
          <SectionTitle title="Audience" />
          <input type="hidden" name="audience_mode" value={mode} />
          <div className="grid gap-2">
            {(
              [
                ["all", "All brokers"],
                ["tier", "By tier"],
                ["engagement", "By engagement band"],
                ["project", "By project interest"],
              ] as const
            ).map(([id, label]) => (
              <label
                key={id}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-line bg-card px-3.5 py-2.5 has-[:checked]:border-ink has-[:checked]:bg-bg"
              >
                <input
                  type="radio"
                  name="audience_mode_radio"
                  value={id}
                  checked={mode === id}
                  onChange={() => setMode(id as AudienceMode)}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-[13.5px] font-semibold text-ink">
                  {label}
                </span>
              </label>
            ))}
          </div>

          {mode === "tier" && (
            <Field label="Tier" extraClass="mt-4">
              <select
                name="audience_tier"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className={selectClass}
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {mode === "engagement" && (
            <Field label="Band" extraClass="mt-4">
              <select
                name="audience_band"
                value={band}
                onChange={(e) => setBand(e.target.value)}
                className={selectClass}
              >
                {BANDS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {mode === "project" && (
            <Field label="Project" extraClass="mt-4">
              <select
                name="audience_project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className={selectClass}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </Card>
      </div>

      {/* Phone preview */}
      <div className="space-y-3">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-3">
          Phone preview
        </div>
        <PhoneLockScreenPreview
          title={title || "Notification title appears here"}
          body={body || "Your subtitle / body will preview live."}
        />
        <div className="rounded-md bg-bg p-3 text-[11.5px] leading-relaxed text-ink-2">
          <span className="font-bold text-ink">Audience:</span>{" "}
          {audienceLabel}.{" "}
          <span className="text-ink-3">
            Sends immediately to the broker app&apos;s in-app feed (Phase 2
            adds device push).
          </span>
        </div>
        <SubmitButton
          kind="primary"
          size="lg"
          full
          disabled={!title.trim()}
          iconRight={<Icon name="bell" size={16} />}
          pendingLabel="Sending…"
        >
          Send now
        </SubmitButton>
      </div>
    </form>
  );
}

const inputClass =
  "block w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-[14px] text-ink shadow-soft-sm outline-none focus:border-ink";
const selectClass = `${inputClass} appearance-none`;

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 text-h3 font-semibold tracking-[-0.005em] text-ink">
      {title}
    </div>
  );
}

function Field({
  label,
  required,
  extraClass,
  children,
}: {
  label: string;
  required?: boolean;
  extraClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mb-4 last:mb-0 ${extraClass ?? ""}`}>
      <label className="mb-1 flex items-baseline gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-3">
        {label}
        {required && (
          <span className="text-[10px] tracking-normal text-accent">
            Required
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function PhoneLockScreenPreview({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      className="relative mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-[28px] bg-ink p-3"
      style={{
        boxShadow: "0 30px 60px rgba(51,63,72,0.20)",
      }}
    >
      {/* Copper aurora */}
      <div
        aria-hidden
        className="absolute -bottom-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent opacity-30 blur-2xl"
      />

      {/* Mock status bar */}
      <div className="mb-4 flex items-center justify-between px-1 text-[9px] font-semibold text-white">
        <span>9:41</span>
        <Logo height={11} dark />
      </div>

      <div className="text-center text-[26px] font-bold leading-none text-white">
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div className="mt-1 text-center text-[10px] font-medium uppercase tracking-[0.13em] text-white/60">
        {new Date().toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </div>

      {/* Notification card */}
      <div className="mt-5 rounded-2xl bg-white/[0.16] p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Logo height={12} dark />
          <span className="text-[8px] font-semibold uppercase tracking-[0.13em] text-white/65">
            Alef · now
          </span>
        </div>
        <div className="mt-1 line-clamp-2 text-[11.5px] font-bold leading-tight text-white">
          {title}
        </div>
        <div className="mt-0.5 line-clamp-3 text-[10px] leading-snug text-white/75">
          {body}
        </div>
      </div>
    </div>
  );
}
