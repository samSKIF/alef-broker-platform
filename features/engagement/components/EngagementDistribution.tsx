import type { EngagementDistribution as Dist } from "../types";

// Engagement-score distribution (PRD §7.1) — 4-band horizontal bar.
// Renders proportional segments for highly / engaged / at-risk / dormant.

const BANDS = [
  { key: "highly", label: "Highly engaged (80+)", color: "var(--color-success)" },
  { key: "engaged", label: "Engaged (60–79)", color: "var(--color-gold)" },
  { key: "atRisk", label: "At risk (30–59)", color: "var(--color-accent)" },
  { key: "dormant", label: "Dormant (<30)", color: "var(--color-balance)" },
] as const;

export function EngagementDistribution({ data }: { data: Dist }) {
  const total =
    data.highly + data.engaged + data.atRisk + data.dormant || 1;
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-pill">
        {BANDS.map((b) => {
          const pct = ((data[b.key] / total) * 100).toFixed(1);
          return (
            <div
              key={b.key}
              style={{ width: `${pct}%`, background: b.color }}
              title={`${b.label}: ${data[b.key]} (${pct}%)`}
            />
          );
        })}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
        {BANDS.map((b) => (
          <li
            key={b.key}
            className="flex items-center justify-between gap-3 text-[12.5px]"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-sm"
                style={{ background: b.color }}
              />
              <span className="text-ink-2">{b.label}</span>
            </div>
            <span className="font-bold text-ink">{data[b.key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
