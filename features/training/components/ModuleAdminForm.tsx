"use client";

import { useState } from "react";
import { Button, Card, Icon } from "@/components/shared";
import type { Project } from "@/features/projects";
import { upsertModule } from "../actions";
import { QuizBuilder } from "./QuizBuilder";
import type { Module, QuizQuestion } from "../types";

// Admin authoring form for academy modules (PRD §7.4). Type toggle drives
// which sub-fields are visible — online modules show duration + video
// upload + quiz; live workshops show when_at, location, seats.

type ModuleAdminFormProps = {
  module?: Module;
  projects: Pick<Project, "id" | "name">[];
};

const TIER_OPTIONS = ["", "Bronze", "Silver", "Gold", "Preferred"] as const;

export function ModuleAdminForm({
  module: mod,
  projects,
}: ModuleAdminFormProps) {
  const [kind, setKind] = useState<"online" | "live">(
    (mod?.kind as "online" | "live") ?? "online",
  );
  const [pending, setPending] = useState(false);

  const initialQuiz = (mod?.quiz as unknown as QuizQuestion[] | null) ?? undefined;

  return (
    <form
      action={async (formData) => {
        setPending(true);
        try {
          await upsertModule(formData);
        } catch (err) {
          setPending(false);
          throw err;
        }
      }}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
    >
      <input type="hidden" name="id" defaultValue={mod?.id ?? ""} />

      <div className="space-y-5 lg:col-span-2">
        <Card pad={22}>
          <SectionTitle title="Module details" />
          <Field label="Kind" required>
            <div className="flex gap-2">
              {(
                [
                  { id: "online", label: "Online · video" },
                  { id: "live", label: "Face-to-face workshop" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setKind(opt.id)}
                  className={[
                    "rounded-pill border px-3.5 py-2 text-[13px] font-semibold",
                    kind === opt.id
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-card text-ink-2",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="kind" value={kind} />
          </Field>

          <Field label="Title" required>
            <input
              name="title"
              defaultValue={mod?.title ?? ""}
              placeholder="e.g. Selling Hayyan — The lagoon thesis"
              required
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Linked project (optional)">
              <select
                name="project_id"
                defaultValue={mod?.project_id ?? ""}
                className={selectClass}
              >
                <option value="">— none —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tier required (optional)">
              <select
                name="tier_required"
                defaultValue={mod?.tier_required ?? ""}
                className={selectClass}
              >
                {TIER_OPTIONS.map((t) => (
                  <option key={t || "none"} value={t}>
                    {t || "— any —"}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Points">
            <input
              type="number"
              name="points"
              min="0"
              defaultValue={mod?.points ?? 50}
              className={inputClass}
            />
          </Field>
        </Card>

        {kind === "online" ? (
          <Card pad={22}>
            <SectionTitle title="Online video" />
            <Field label="Duration label">
              <input
                name="duration"
                defaultValue={mod?.duration ?? ""}
                placeholder='e.g. "18 min · 3 videos"'
                className={inputClass}
              />
            </Field>
            <div className="rounded-md border border-dashed border-line bg-bg p-3 text-[11.5px] leading-relaxed text-ink-3">
              Video file upload arrives in Phase 2 alongside a schema
              migration for <code className="font-mono">modules.video_url</code>.
            </div>
          </Card>
        ) : (
          <Card pad={22}>
            <SectionTitle title="Face-to-face workshop" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="When">
                <input
                  name="when_at"
                  defaultValue={mod?.when_at ?? ""}
                  placeholder="e.g. Sat 31 May · 10am"
                  className={inputClass}
                />
              </Field>
              <Field label="Seats">
                <input
                  name="seats"
                  defaultValue={mod?.seats ?? ""}
                  placeholder="e.g. 4 of 12 left"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Location">
              <input
                name="location"
                defaultValue={mod?.location ?? ""}
                placeholder="e.g. Sharjah · on-site"
                className={inputClass}
              />
            </Field>
          </Card>
        )}

        <Card pad={22}>
          <SectionTitle title="Quiz" />
          <div className="mb-3 text-[12px] text-ink-3">
            Optional. Phase 1 only renders the question titles; quiz-taking
            UI ships in Phase 2 (PRD §6.7).
          </div>
          <QuizBuilder initial={initialQuiz} hiddenName="quiz_json" />
        </Card>
      </div>

      <div className="space-y-5">
        <Card pad={22}>
          <SectionTitle title="Visibility" />
          <Switch
            name="published"
            label="Published"
            sub="Visible in the broker app's Academy."
            defaultChecked={mod?.published ?? false}
          />
        </Card>

        <Button
          kind="primary"
          size="lg"
          full
          type="submit"
          disabled={pending}
          iconRight={<Icon name="arrow-right" size={18} />}
        >
          {pending ? "Saving…" : mod ? "Save changes" : "Create module"}
        </Button>
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
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

function Switch({
  name,
  label,
  sub,
  defaultChecked,
}: {
  name: string;
  label: string;
  sub: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="mb-3 flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 cursor-pointer accent-accent"
      />
      <div>
        <div className="text-[13px] font-bold text-ink">{label}</div>
        <div className="text-[11.5px] text-ink-3">{sub}</div>
      </div>
    </label>
  );
}

// FileField removed alongside the deferred video upload — Phase 2 will
// re-add it once modules.video_url exists in the schema.
