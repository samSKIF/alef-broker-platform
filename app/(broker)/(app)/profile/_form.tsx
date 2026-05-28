"use client";

import Image from "next/image";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { Button, Icon } from "@/components/shared";
import { signOutBroker, updateBrokerProfile } from "@/features/brokers";

const ROLE_OPTIONS = [
  "Sales Agent",
  "Senior Sales Agent",
  "Sales Manager",
  "Director",
  "Other",
] as const;

// PRD §6.5 update 2026-05-28 — Editable profile. Mirrors the
// /onboarding/name form (same fields, same photo picker, same FormData
// wire format) but seeded with the broker's current values and
// dispatching to updateBrokerProfile instead of onboardBroker.
//
// Sign-out lives here too (in addition to the activity-page link) so
// the profile screen is a one-stop "account" surface.

type Props = {
  email: string;
  initialName: string;
  initialRole: string;
  initialBrokerage: string;
  initialPhotoUrl: string | null;
};

export function ProfileForm({
  email,
  initialName,
  initialRole,
  initialBrokerage,
  initialPhotoUrl,
}: Props) {
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole);
  const [brokerage, setBrokerage] = useState(initialBrokerage);
  // Three photo states: keep current (default), upload new, or clear.
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialPhotoUrl,
  );
  const [clearPhoto, setClearPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim().length > 0 &&
    role.length > 0 &&
    brokerage.trim().length > 0 &&
    !pending;

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    setClearPhoto(false);
    setPhotoPreview((prev) => {
      // Only revoke object URLs we created — not the initial Supabase URL.
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : initialPhotoUrl;
    });
  }

  function handleClearPhoto() {
    setPhotoFile(null);
    setClearPhoto(true);
    setPhotoPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("role", role);
    fd.set("brokerage", brokerage.trim());
    if (photoFile) fd.set("photo", photoFile);
    if (clearPhoto) fd.set("clear_photo", "1");
    startTransition(async () => {
      try {
        await updateBrokerProfile(fd);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not save your profile. Please try again.",
        );
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-2">
        {/* Photo picker */}
        <div className="mb-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-[108px] w-[108px] items-center justify-center overflow-hidden rounded-full border-[1.5px] border-line bg-card text-ink-3 shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={photoPreview ? "Change profile photo" : "Add profile photo"}
          >
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Profile preview"
                fill
                sizes="108px"
                className="object-cover"
                unoptimized={photoPreview.startsWith("blob:")}
              />
            ) : (
              <Icon name="user" size={36} />
            )}
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow-soft-sm"
              aria-hidden
            >
              <Icon
                name={photoPreview ? "check" : "plus"}
                size={16}
                strokeWidth={2.4}
              />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div className="mt-2 text-[12px] font-medium tracking-[0.02em] text-ink-3">
            {photoPreview ? (
              <button
                type="button"
                onClick={handleClearPhoto}
                className="text-accent underline-offset-2 hover:underline"
              >
                Remove photo
              </button>
            ) : (
              <>Add a profile photo</>
            )}
          </div>
        </div>

        <Field label="Email">
          <div className="text-base font-semibold text-ink-2">
            {email || <span className="text-ink-3">(no email)</span>}
          </div>
        </Field>

        <Field label="Full name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Layla Hassan"
            className="w-full border-0 bg-transparent p-0 text-base font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3"
            autoComplete="name"
          />
        </Field>

        <Field label="Role" required dropdown>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full appearance-none border-0 bg-transparent p-0 text-base font-semibold text-ink outline-none"
          >
            <option value="">Select your role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Brokerage name" required>
          <input
            value={brokerage}
            onChange={(e) => setBrokerage(e.target.value)}
            placeholder="Driven Properties"
            className="w-full border-0 bg-transparent p-0 text-base font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3"
            autoComplete="organization"
          />
        </Field>

        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
            {error}
          </div>
        )}

        {/* Sign out — secondary, quiet. */}
        <div className="mt-4 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => {
              const f = new FormData();
              startTransition(async () => {
                try {
                  await signOutBroker();
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "Could not sign out.",
                  );
                }
              });
              // Keep f referenced so eslint doesn't complain — the
              // signOutBroker action takes no args; this is a safety
              // pattern for future "sign out everywhere" parameters.
              void f;
            }}
            className="w-full rounded-md py-3 text-center text-[12.5px] font-semibold text-ink-3 underline decoration-ink-4 underline-offset-2 hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-7 pt-3.5">
        <Button
          kind="primary"
          size="lg"
          full
          type="submit"
          disabled={!canSubmit}
          iconRight={<Icon name="arrow-right" size={18} />}
        >
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  dropdown,
  children,
}: {
  label: string;
  required?: boolean;
  dropdown?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-3">
          {label}
        </label>
        {required && (
          <span className="text-[10px] font-bold tracking-[0.04em] text-accent">
            Required
          </span>
        )}
      </div>
      <div className="flex min-h-[26px] items-center justify-between gap-1 rounded-[14px] border-[1.5px] border-line bg-card px-4 py-3.5 shadow-soft-sm focus-within:border-ink">
        <div className="min-w-0 flex-1">{children}</div>
        {dropdown && (
          <Icon
            name="chevron-right"
            size={16}
            className="rotate-90 text-ink-3"
          />
        )}
      </div>
    </div>
  );
}
