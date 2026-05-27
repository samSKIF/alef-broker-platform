import type { WeeklyRollup } from "../types";

// Admin Overview's weekly multi-series bar chart (PRD §7.1).
// Server-renderable pure SVG — no chart library. Three series per day:
// visits / brochures / modules.

type Series = {
  key: "visits" | "brochures" | "modules";
  label: string;
  color: string;
};

const SERIES: Series[] = [
  { key: "brochures", label: "Brochures shared", color: "var(--color-balance)" },
  { key: "visits", label: "Visits booked", color: "var(--color-possibilities)" },
  { key: "modules", label: "Modules completed", color: "var(--color-accent)" },
];

export function WeeklyChart({ data }: { data: WeeklyRollup[] }) {
  const max = Math.max(
    1,
    ...data.flatMap((d) => [d.visits, d.brochures, d.modules]),
  );

  // Chart geometry.
  const W = 720;
  const H = 220;
  const PAD_L = 32;
  const PAD_R = 12;
  const PAD_T = 12;
  const PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const groupW = innerW / data.length;
  const barW = Math.min(14, (groupW - 12) / SERIES.length);
  const groupGap = groupW - SERIES.length * barW;

  return (
    <div className="overflow-hidden">
      <div className="mb-3 flex items-center gap-4">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="text-[11px] font-semibold text-ink-2">
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD_T + innerH - innerH * t;
          return (
            <g key={t}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y}
                y2={y}
                stroke="var(--color-line)"
                strokeWidth={1}
                strokeDasharray={t === 0 ? "0" : "2 4"}
              />
              <text
                x={PAD_L - 6}
                y={y + 3}
                fontSize={9}
                textAnchor="end"
                fontFamily="var(--font-sans)"
                fill="var(--color-ink-3)"
              >
                {Math.round(max * t)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((day, i) => {
          const xGroup = PAD_L + groupW * i + groupGap / 2;
          return (
            <g key={day.day}>
              {SERIES.map((s, si) => {
                const v = day[s.key];
                const h = (v / max) * innerH;
                const x = xGroup + si * barW;
                const y = PAD_T + innerH - h;
                return (
                  <rect
                    key={s.key}
                    x={x}
                    y={y}
                    width={barW - 1.5}
                    height={Math.max(1, h)}
                    rx={1.5}
                    fill={s.color}
                  />
                );
              })}
              <text
                x={xGroup + (SERIES.length * barW) / 2}
                y={H - PAD_B + 18}
                fontSize={10}
                textAnchor="middle"
                fontWeight={600}
                fontFamily="var(--font-sans)"
                fill="var(--color-ink-3)"
              >
                {day.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
