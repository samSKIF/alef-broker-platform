"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { Button } from "./Button";

// <button type="submit"> for forms whose `action` prop is a server action.
// Pulls its `pending` state from React's `useFormStatus` so we never have
// to capture local state inside the form's action closure (Next.js 16
// can't serialise such a closure across the server-action boundary).
//
// Drop directly inside a <form>; SubmitButton looks up the ancestor form's
// status automatically.

type SubmitButtonProps = {
  /** Button kind — same options as <Button>. */
  kind?: "primary" | "accent" | "ghost" | "tint";
  /** Button size — same options as <Button>. */
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconRight?: ReactNode;
  full?: boolean;
  className?: string;
  children: ReactNode;
  /** Extra disable beyond `useFormStatus().pending` (e.g. invalid input). */
  disabled?: boolean;
  /** Optional alternate label while the form is submitting. */
  pendingLabel?: ReactNode;
};

export function SubmitButton({
  children,
  pendingLabel,
  disabled,
  ...rest
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button {...rest} type="submit" disabled={disabled || pending}>
      {pending ? (pendingLabel ?? "Saving…") : children}
    </Button>
  );
}
