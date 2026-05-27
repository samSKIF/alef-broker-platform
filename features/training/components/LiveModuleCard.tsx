import { Icon } from "@/components/shared";
import type { Module } from "../types";

// Face-to-face workshop card from the design's Academy. Shows the calendar
// chip + venue + seats + Gold-only marker for tier-gated sessions, and a
// "+N pts" stamp.

type LiveModuleCardProps = {
  module: Module;
};

function splitDate(s: string | null): { day: string; rest: string } {
  if (!s) return { day: "TBD", rest: "" };
  const parts = s.split(" ");
  return { day: parts[0] ?? "", rest: parts.slice(1).join(" ") };
}

export function LiveModuleCard({ module }: LiveModuleCardProps) {
  const { day, rest } = splitDate(module.when_at);
  const gold = module.tier_required === "Gold";
  return (
    <div className="relative mb-3 overflow-hidden rounded-xl border border-line bg-card p-4 shadow-soft-sm">
      {gold && (
        <div className="absolute right-4 top-4 text-[10px] font-bold uppercase tracking-[0.13em] text-gold">
          ★ Gold only
        </div>
      )}
      <div className="mb-3 flex gap-3.5">
        <div className="w-14 shrink-0 rounded-md bg-tint py-2 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-accent-2">
            {day}
          </div>
          {rest && (
            <div className="mt-0.5 px-1 text-[10px] font-semibold leading-tight text-accent-2">
              {rest}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[14.5px] font-bold leading-[1.25] tracking-[-0.005em] text-ink">
            {module.title}
          </div>
          {module.location && (
            <div className="flex items-center gap-1 text-[11.5px] text-ink-3">
              <Icon name="pin" size={12} />
              {module.location}
            </div>
          )}
          {module.seats && (
            <div className="mt-1 text-[11.5px] text-ink-3">{module.seats}</div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line pt-3">
        <div>
          <span className="text-[16px] font-bold tracking-[-0.01em] text-accent">
            +{module.points}
          </span>
          <span className="ml-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-3">
            pts
          </span>
        </div>
        <button
          type="button"
          className="rounded-pill bg-ink px-3.5 py-1.5 text-[11.5px] font-bold text-white hover:bg-ink-2"
        >
          Reserve
        </button>
      </div>
    </div>
  );
}
