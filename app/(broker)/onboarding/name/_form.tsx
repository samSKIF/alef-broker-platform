"use client";

import { useState, useTransition } from "react";
import { Button, Icon } from "@/components/shared";
import { onboardBroker } from "@/features/brokers/actions";

const ROLE_OPTIONS = [
  "Sales Agent",
  "Senior Sales Agent",
  "Sales Manager",
  "Director",
  "Other",
] as const;

// PRD §6.3 — Name capture form. Three required fields; on submit, calls the
// server action onboardBroker which inserts a Bronze broker, sets the
// broker_id cookie, and server-redirects to /onboarding/done.
export function NameForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim().length > 0 &&
    role.length > 0 &&
    brokerage.trim().length > 0 &&
    !pending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setError(null);
        startTransition(async () => {
          try {
            await onboardBroker({
              name: name.trim(),
              brokerage: brokerage.trim(),
              role,
            });
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Could not create your account. Please try again.",
            );
          }
        });
      }}
      className="flex h-full flex-col"
    >
      <div className="flex-1 overflow-y-auto px-6 pt-1.5">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.17em] text-accent">
          Hello there
        </div>
        <h1 className="mb-1.5 text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
          Tell us about you.
        </h1>
        <p className="mb-4 text-[13.5px] leading-[1.5] text-ink-2">
          We&apos;ll personalise your dashboard and every brochure you share
          with clients.
        </p>

        <Field label="Full name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Layla Hassan"
            className="w-full border-0 bg-transparent p-0 text-[16px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3"
            autoComplete="name"
            autoFocus
          />
        </Field>

        <Field label="Role" required dropdown>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border-0 bg-transparent p-0 text-[16px] font-semibold text-ink outline-none appearance-none"
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
            className="w-full border-0 bg-transparent p-0 text-[16px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3"
            autoComplete="organization"
          />
        </Field>

        <div className="mt-1.5 flex items-start gap-2.5 rounded-md bg-tint p-3">
          <Icon
            name="sparkle"
            size={16}
            className="mt-0.5 shrink-0 text-accent"
          />
          <div className="text-[12px] leading-[1.45] text-accent-2">
            Use the name on your RERA broker card — it&apos;ll appear on every
            brochure you share.
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="px-5 pb-7 pt-3.5">
        <Button
          kind="primary"
          size="lg"
          full
          type="submit"
          disabled={!canSubmit}
          iconRight={<Icon name="arrow-right" size={18} />}
        >
          {pending ? "Setting up…" : "Continue"}
        </Button>
      </div>
    </form>
  );
}

// Labelled card-style input wrapper from the design.
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
