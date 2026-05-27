"use client";

import { useState } from "react";
import { Card, Icon, SubmitButton } from "@/components/shared";
import { updateAiConfig } from "../actions";
import type { AiConfig } from "../types";

// Edits the singleton ai_config row (PRD §1.5.8). Server action runs on
// submit and revalidates the page; the form re-mounts with fresh values
// from the DB. No client closure around the action — Next.js 16 can't
// serialise one.

const MODEL_OPTIONS = [
  { value: "gpt-4o-mini", label: "gpt-4o-mini · cheap, fast" },
  { value: "gpt-4o", label: "gpt-4o · stronger, more $$$" },
  { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
  { value: "gpt-4.1", label: "gpt-4.1" },
];

export function AiInstructionsEditor({ config }: { config: AiConfig }) {
  const [instructions, setInstructions] = useState(config.instructions);
  const [model, setModel] = useState(config.model);
  const [temperature, setTemperature] = useState(config.temperature);
  const [maxTokens, setMaxTokens] = useState(config.max_output_tokens);

  return (
    <form action={updateAiConfig} className="space-y-5">
      <Card pad={22}>
        <SectionTitle title="System instructions" />
        <div className="mb-3 text-[12px] leading-relaxed text-ink-3">
          Edited live — every Ask Alef request reads the current value
          from the database. Be explicit about scope: the assistant should
          decline anything outside Alef Group projects.
        </div>
        <textarea
          name="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={16}
          className="block w-full resize-y rounded-md border border-line bg-card px-3.5 py-2.5 font-mono text-[12.5px] leading-relaxed text-ink shadow-soft-sm outline-none focus:border-ink"
        />
        <div className="mt-1 flex items-baseline justify-between text-[11px] text-ink-3">
          <span>Plain text. Markdown is ignored by the API but readable in the editor.</span>
          <span className="tabular-nums">{instructions.length} chars</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card pad={22}>
          <Field label="Model">
            <select
              name="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={selectClass}
            >
              {MODEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </Card>
        <Card pad={22}>
          <Field
            label={`Temperature · ${temperature.toFixed(2)}`}
            help="0 = deterministic. ~0.4 is brand-safe; 1+ gets creative."
          >
            <input
              type="range"
              name="temperature"
              min={0}
              max={1.5}
              step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </Field>
        </Card>
        <Card pad={22}>
          <Field
            label={`Max output tokens · ${maxTokens}`}
            help="Caps the assistant's reply length. ~600 ≈ a paragraph or two."
          >
            <input
              type="range"
              name="max_output_tokens"
              min={64}
              max={2000}
              step={32}
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </Field>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        <SubmitButton
          kind="primary"
          size="lg"
          iconRight={<Icon name="check" size={16} />}
        >
          Save instructions
        </SubmitButton>
      </div>
    </form>
  );
}

const selectClass =
  "block w-full appearance-none rounded-md border border-line bg-card px-3.5 py-2.5 text-[14px] text-ink shadow-soft-sm outline-none focus:border-ink";

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-4 text-h3 font-semibold tracking-[-0.005em] text-ink">
      {title}
    </div>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-3">
        {label}
      </label>
      {children}
      {help && (
        <div className="mt-1.5 text-[11px] leading-snug text-ink-3">
          {help}
        </div>
      )}
    </div>
  );
}
