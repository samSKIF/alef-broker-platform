"use client";

import { useState } from "react";
import { Card, Icon, SubmitButton } from "@/components/shared";
import { CampaignCard } from "./CampaignCard";
import { upsertCampaign } from "../actions";
import type { Campaign } from "../types";

// Admin authoring form (PRD §7.5) with a live broker-card preview using
// the same CampaignCard component the broker app renders. State holds the
// draft and the preview re-renders on every change. Submit passes
// FormData straight to upsertCampaign — <SubmitButton> handles pending
// state via useFormStatus.

type CampaignAdminFormProps = {
  campaign?: Campaign;
};

const LINK_TARGET_OPTIONS = [
  { value: "", label: "— none —" },
  { value: "detail", label: "detail (project)" },
  { value: "projects", label: "projects (list)" },
  { value: "academy", label: "academy" },
  { value: "activity", label: "activity" },
];

const KIND_OPTIONS = [
  { value: "", label: "Standard (with image)" },
  { value: "commission", label: "Commission card (no image)" },
];

export function CampaignAdminForm({ campaign }: CampaignAdminFormProps) {
  const [draft, setDraft] = useState<Campaign>({
    id: campaign?.id ?? "",
    tag: campaign?.tag ?? "",
    title: campaign?.title ?? "Campaign title",
    subtitle: campaign?.subtitle ?? "Optional subtitle",
    image: campaign?.image ?? null,
    kind: campaign?.kind ?? null,
    link_target: campaign?.link_target ?? null,
    schedule: campaign?.schedule ?? "",
    published: campaign?.published ?? false,
    created_at: campaign?.created_at ?? new Date().toISOString(),
  });

  function set<K extends keyof Campaign>(key: K, value: Campaign[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      action={upsertCampaign}
      className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]"
    >
      <input type="hidden" name="id" defaultValue={campaign?.id ?? ""} />
      <input
        type="hidden"
        name="image_existing"
        defaultValue={campaign?.image ?? ""}
      />

      <div className="space-y-5">
        <Card pad={22}>
          <SectionTitle title="Campaign card" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tag">
              <input
                name="tag"
                value={draft.tag ?? ""}
                onChange={(e) => set("tag", e.target.value)}
                placeholder="e.g. Launch / Open day / Webinar"
                className={inputClass}
              />
            </Field>
            <Field label="Kind">
              <select
                name="kind"
                value={draft.kind ?? ""}
                onChange={(e) => set("kind", e.target.value || null)}
                className={selectClass}
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value || "std"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Title" required>
            <input
              name="title"
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Hayyan handover begins"
              required
              className={inputClass}
            />
          </Field>
          <Field label="Subtitle">
            <input
              name="subtitle"
              value={draft.subtitle ?? ""}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="e.g. Phase 2 keys · this Saturday"
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Schedule">
              <input
                name="schedule"
                value={draft.schedule ?? ""}
                onChange={(e) => set("schedule", e.target.value)}
                placeholder="e.g. Now · pinned"
                className={inputClass}
              />
            </Field>
            <Field label="Link target">
              <select
                name="link_target"
                value={draft.link_target ?? ""}
                onChange={(e) =>
                  set("link_target", e.target.value || null)
                }
                className={selectClass}
              >
                {LINK_TARGET_OPTIONS.map((o) => (
                  <option key={o.value || "none"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        <Card pad={22}>
          <SectionTitle title="Image" />
          <FileField
            label="Card image (skipped for commission cards)"
            name="image_file"
            accept="image/*"
            existingUrl={draft.image}
            onPick={(url) => set("image", url)}
          />
        </Card>

        <Card pad={22}>
          <Switch
            name="published"
            label="Published"
            sub='Appears in the broker app Home "Alef · this week" carousel.'
            defaultChecked={draft.published}
            onToggle={(checked) => set("published", checked)}
          />
        </Card>
      </div>

      {/* Live preview */}
      <div className="space-y-3">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-3">
          Live preview
        </div>
        <div className="rounded-2xl bg-bg p-4">
          <CampaignCard campaign={draft} />
        </div>
        <SubmitButton
          kind="primary"
          size="lg"
          full
          iconRight={<Icon name="arrow-right" size={18} />}
        >
          {campaign ? "Save changes" : "Create campaign"}
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
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
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
  onToggle,
}: {
  name: string;
  label: string;
  sub: string;
  defaultChecked: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        onChange={(e) => onToggle(e.target.checked)}
        className="mt-1 h-4 w-4 cursor-pointer accent-accent"
      />
      <div>
        <div className="text-[13px] font-bold text-ink">{label}</div>
        <div className="text-[11.5px] text-ink-3">{sub}</div>
      </div>
    </label>
  );
}

function FileField({
  label,
  name,
  accept,
  existingUrl,
  onPick,
}: {
  label: string;
  name: string;
  accept: string;
  existingUrl?: string | null;
  onPick: (objectUrl: string | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div>
      <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-3">
        {label}
      </label>
      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-line bg-card px-3.5 py-2.5 text-[13px] text-ink-2 shadow-soft-sm hover:bg-bg">
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setFile(f);
            onPick(f ? URL.createObjectURL(f) : existingUrl ?? null);
          }}
          className="hidden"
        />
        {file ? (
          <span className="font-semibold text-ink">{file.name}</span>
        ) : existingUrl ? (
          <span>Replace existing image</span>
        ) : (
          <span>Drop or click to upload</span>
        )}
      </label>
    </div>
  );
}
