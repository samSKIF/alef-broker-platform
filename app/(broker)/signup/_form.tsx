"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { Button, Icon } from "@/components/shared";
import { signUpBroker } from "@/features/brokers/actions";

// Step 1 of onboarding: create the auth account. Step 2 collects the
// broker profile at /onboarding/name. Keeping the two surfaces apart
// means a broker who bails out mid-profile can resume next visit
// without re-signing-up.
export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 8 &&
    password === confirm &&
    !pending;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    const fd = new FormData();
    fd.set("email", email.trim());
    fd.set("password", password);
    fd.set("confirm", confirm);
    startTransition(async () => {
      try {
        await signUpBroker(fd);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not create your account. Please try again.",
        );
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-1.5">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.17em] text-accent">
          Welcome to Alef
        </div>
        <h1 className="mb-1.5 text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
          Create your account.
        </h1>
        <p className="mb-5 text-[13.5px] leading-[1.5] text-ink-2">
          You&apos;ll use this email to sign in to the broker app on any device.
        </p>

        <Field label="Email" required>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="layla@example.com"
            className="w-full border-0 bg-transparent p-0 text-base font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3"
            autoComplete="email"
            autoFocus
          />
        </Field>

        <Field label="Password" required>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full border-0 bg-transparent p-0 text-base font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3"
            autoComplete="new-password"
            minLength={8}
          />
        </Field>

        <Field label="Confirm password" required>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type it again"
            className="w-full border-0 bg-transparent p-0 text-base font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-3"
            autoComplete="new-password"
            minLength={8}
          />
        </Field>

        {password.length > 0 && password.length < 8 && (
          <div className="mt-1 text-[12px] text-ink-3">
            Password is too short — needs 8+ characters.
          </div>
        )}
        {confirm.length > 0 && password !== confirm && (
          <div className="mt-1 text-[12px] text-red-600">
            Passwords don&apos;t match yet.
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 text-center text-[12.5px] text-ink-3">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent">
            Log in
          </Link>
        </div>
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
          {pending ? "Creating account…" : "Continue"}
        </Button>
      </div>
    </form>
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
      </div>
    </div>
  );
}
