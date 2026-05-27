"use client";

import { useState, useTransition } from "react";
import { Button, Card, Icon } from "@/components/shared";
import { submitBooking } from "@/features/booking/actions";
import type { Project } from "@/features/projects";

// PRD §6.11 — Booking form. Project · date · time · reminder toggle. Submit
// logs visit_booked activity (via the submitBooking action) and redirects
// to the confirmation screen. Calendar / availability is real Phase 2.

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

type BookingFormProps = {
  brokerId: string;
  projects: Project[];
};

export function BookingForm({ brokerId, projects }: BookingFormProps) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string>("");
  const [reminder, setReminder] = useState(true);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canSubmit = projectId && date && time && !pending;

  // Default the date input min to today so brokers can't book in the past.
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setError(null);
        start(async () => {
          try {
            await submitBooking({
              broker_id: brokerId,
              project_id: projectId,
              date,
              time,
              reminder,
            });
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Could not book — try again.",
            );
          }
        });
      }}
      className="flex flex-col gap-3 px-4 pb-6 pt-2"
    >
      {/* Project */}
      <Card>
        <Label>Project</Label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          // text-base (16px) avoids iOS Safari's auto-zoom-on-focus.
          className="w-full appearance-none border-0 bg-transparent p-0 pt-2 text-base font-semibold text-ink outline-none"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.location ? ` · ${p.location}` : ""}
            </option>
          ))}
        </select>
      </Card>

      {/* Date */}
      <Card>
        <Label>Date</Label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={todayIso}
          // text-base (16px) avoids iOS Safari's auto-zoom-on-focus.
          className="w-full border-0 bg-transparent p-0 pt-2 text-base font-semibold text-ink outline-none"
        />
      </Card>

      {/* Time slots */}
      <Card>
        <Label>Time slot</Label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setTime(slot)}
              className={[
                "rounded-md py-2 text-[13px] font-semibold transition-colors",
                time === slot
                  ? "bg-ink text-white"
                  : "bg-bg text-ink-2 hover:bg-tint",
              ].join(" ")}
            >
              {slot}
            </button>
          ))}
        </div>
      </Card>

      {/* Reminder */}
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label>Reminder</Label>
            <div className="mt-0.5 text-[12px] text-ink-3">
              Notify me 1 hour before the visit
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReminder((r) => !r)}
            aria-pressed={reminder}
            className={[
              "relative h-7 w-12 rounded-full transition-colors",
              reminder ? "bg-accent" : "bg-ink-4",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-0.5 inline-block h-6 w-6 rounded-full bg-white shadow-soft-sm transition-transform",
                reminder ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </div>
      </Card>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
          {error}
        </div>
      )}

      <Button
        kind="primary"
        size="lg"
        full
        type="submit"
        disabled={!canSubmit}
        iconRight={<Icon name="arrow-right" size={18} />}
      >
        {pending ? "Booking…" : "Book the visit"}
      </Button>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-ink-3">
      {children}
    </div>
  );
}
