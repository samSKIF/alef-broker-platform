"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, Icon, SubmitButton } from "@/components/shared";
import { upsertProject } from "../actions";
import type { Project } from "../types";

// Admin authoring form (PRD §7.3). Passes the server action directly as
// `form action` so React handles the FormData submission natively; pending
// state comes from `useFormStatus` inside <SubmitButton> (we can't wrap the
// action in a closure that captures local state — Next.js 16 can't
// serialise it).

export function ProjectAdminForm({ project }: { project?: Project }) {
  const isEdit = !!project;

  return (
    <form
      action={upsertProject}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
    >
      <input
        type="hidden"
        name="id"
        defaultValue={project?.id ?? ""}
      />
      <input
        type="hidden"
        name="cover_image_existing"
        defaultValue={project?.cover_image ?? ""}
      />
      <input
        type="hidden"
        name="video_url_existing"
        defaultValue={project?.video_url ?? ""}
      />
      <input
        type="hidden"
        name="brochure_url_existing"
        defaultValue={project?.brochure_url ?? ""}
      />

      {/* Main column */}
      <div className="space-y-5 lg:col-span-2">
        <Card pad={22}>
          <SectionTitle title="Project details" />
          <Field label="Project name" required>
            <Input
              name="name"
              defaultValue={project?.name ?? ""}
              placeholder="e.g. Hayyan"
              required
            />
          </Field>
          <Field label="Location">
            <Input
              name="location"
              defaultValue={project?.location ?? ""}
              placeholder="e.g. Emirates Road, Sharjah"
            />
          </Field>
          <Field label="Tagline">
            <Textarea
              name="tagline"
              rows={2}
              defaultValue={project?.tagline ?? ""}
              placeholder="One-line description for the project card."
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Unit types">
              <Input
                name="units"
                defaultValue={project?.units ?? ""}
                placeholder="e.g. 2–7 BR Villas"
              />
            </Field>
            <Field label="Starting price">
              <Input
                name="price_from"
                defaultValue={project?.price_from ?? ""}
                placeholder="e.g. AED 1.19M"
              />
            </Field>
          </div>
          <Field label="Status">
            <Input
              name="status"
              defaultValue={project?.status ?? ""}
              placeholder="e.g. Selling · Phase 2"
            />
          </Field>
        </Card>

        <Card pad={22}>
          <SectionTitle title="Media uploads" />
          <FileField
            label="Cover image"
            name="cover_image_file"
            accept="image/*"
            existingUrl={project?.cover_image}
            showPreview
          />
          <FileField
            label="Video"
            name="video_file"
            accept="video/*"
            existingUrl={project?.video_url}
          />
          <FileField
            label="Brochure PDF"
            name="brochure_file"
            accept="application/pdf"
            existingUrl={project?.brochure_url}
          />
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <Card pad={22}>
          <SectionTitle title="Visibility" />
          <Switch
            name="published"
            label="Published"
            sub="Visible in the broker app's Projects list."
            defaultChecked={project?.published ?? false}
          />
          <Switch
            name="featured"
            label="Featured"
            sub="Pinned at the top of the Projects list."
            defaultChecked={project?.featured ?? false}
          />
        </Card>

        <Card pad={22}>
          <SectionTitle title="Ask Alef AI" />
          <Switch
            name="ai_indexed"
            label="Index for Ask Alef"
            sub="Include this project's brochure text in the AI's knowledge base."
            defaultChecked={project?.ai_indexed ?? false}
          />
        </Card>

        <SubmitButton
          kind="primary"
          size="lg"
          full
          iconRight={<Icon name="arrow-right" size={18} />}
        >
          {isEdit ? "Save changes" : "Create project"}
        </SubmitButton>
      </div>
    </form>
  );
}

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

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      {...props}
      className="block w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-[14px] text-ink shadow-soft-sm outline-none focus:border-ink"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="block w-full resize-y rounded-md border border-line bg-card px-3.5 py-2.5 text-[14px] text-ink shadow-soft-sm outline-none focus:border-ink"
    />
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

function FileField({
  label,
  name,
  accept,
  existingUrl,
  showPreview,
}: {
  label: string;
  name: string;
  accept: string;
  existingUrl?: string | null;
  showPreview?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const isImage = showPreview && (file || existingUrl);

  return (
    <div className="mb-4">
      <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-3">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {isImage && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-bg">
            {file ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : existingUrl ? (
              <Image
                src={existingUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : null}
          </div>
        )}
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
