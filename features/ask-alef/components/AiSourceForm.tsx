"use client";

import { useState } from "react";
import { Card, Icon, SubmitButton } from "@/components/shared";
import type { Project } from "@/features/projects";
import { upsertAiSource } from "../actions";
import type { AiSource } from "../types";

// Create / edit a single ai_sources row (PRD 1.5.8).
// Phase 1: file upload stores file_url for reference; the operator
// pastes extracted text into `content` (PDF-to-text auto-extraction is
// Phase 2). Submit goes straight to the server action.

type AiSourceFormProps = {
  source?: AiSource;
  projects: Pick<Project, "id" | "name">[];
};

const KIND_OPTIONS = ["brochure", "doc", "note"] as const;

export function AiSourceForm({ source, projects }: AiSourceFormProps) {
  return (
    <form action={upsertAiSource} className="space-y-5">
      <input type="hidden" name="id" defaultValue={source?.id ?? ""} />
      <input
        type="hidden"
        name="file_url_existing"
        defaultValue={source?.file_url ?? ""}
      />

      <Card pad={22}>
        <SectionTitle title="Source details" />
        <Field label="Title" required>
          <input
            name="title"
            defaultValue={source?.title ?? ""}
            placeholder="e.g. Hayyan brochure — June 2026"
            required
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kind">
            <select
              name="kind"
              defaultValue={source?.kind ?? "brochure"}
              className={selectClass}
            >
              {KIND_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Linked project (optional)">
            <select
              name="project_id"
              defaultValue={source?.project_id ?? ""}
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
        </div>
        <Field label="Sort order">
          <input
            type="number"
            name="sort_order"
            defaultValue={source?.sort_order ?? 0}
            className={inputClass}
          />
        </Field>
      </Card>

      <Card pad={22}>
        <SectionTitle title="Content" />
        <div className="mb-3 text-[12px] leading-relaxed text-ink-3">
          Plain-text knowledge the assistant draws on. Be specific —
          mention names, units, pricing, status. The route handler
          concatenates this directly into the system prompt at request
          time, so cleaner copy → cleaner answers.
        </div>
        <textarea
          name="content"
          defaultValue={source?.content ?? ""}
          rows={14}
          placeholder="# Project name
Location:
Status:
Units:
Pricing:

Key facts
- …

What to tell clients
- …"
          className="block w-full resize-y rounded-md border border-line bg-card px-3.5 py-2.5 font-mono text-[12.5px] leading-relaxed text-ink shadow-soft-sm outline-none focus:border-ink"
        />
      </Card>

      <Card pad={22}>
        <SectionTitle title="Original file (optional)" />
        <div className="mb-3 text-[12px] leading-relaxed text-ink-3">
          Stored for reference. PDF-to-text auto-extraction is Phase 2 —
          for now, paste the extracted text into the Content box above.
        </div>
        <FileField
          label="Brochure PDF, doc, etc."
          name="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          existingUrl={source?.file_url}
        />
      </Card>

      <div className="flex justify-end">
        <SubmitButton
          kind="primary"
          size="lg"
          iconRight={<Icon name="arrow-right" size={16} />}
        >
          {source ? "Save source" : "Create source"}
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

function FileField({
  label,
  name,
  accept,
  existingUrl,
}: {
  label: string;
  name: string;
  accept: string;
  existingUrl?: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div>
      <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-3">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <label className="flex-1 cursor-pointer rounded-md border border-dashed border-line bg-card px-3.5 py-2.5 text-[13px] text-ink-2 shadow-soft-sm hover:bg-bg">
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          {file ? (
            <span className="font-semibold text-ink">{file.name}</span>
          ) : existingUrl ? (
            <span>Replace existing file</span>
          ) : (
            <span>Drop or click to upload</span>
          )}
        </label>
        {existingUrl && (
          <a
            href={existingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11.5px] font-semibold text-accent hover:underline"
          >
            View
          </a>
        )}
      </div>
    </div>
  );
}
