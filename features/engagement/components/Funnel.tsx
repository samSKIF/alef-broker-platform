import type { FunnelStage } from "../types";

// Activity → transaction funnel (PRD §7.1). Each stage shows its name +
// count, a tapering bar width, and the conversion % vs the head stage.

export function Funnel({ stages }: { stages: FunnelStage[] }) {
  const head = stages[0]?.value || 1;
  return (
    <div className="flex flex-col gap-2.5">
      {stages.map((s, i) => {
        const pct = (s.value / head) * 100;
        const conv = i === 0 ? 100 : Math.round((s.value / head) * 100);
        return (
          <div key={s.stage}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <div className="text-[13px] font-semibold text-ink">
                {s.stage}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold tracking-[-0.01em] text-ink">
                  {s.value.toLocaleString()}
                </span>
                {i > 0 && (
                  <span className="text-[10.5px] font-semibold text-ink-3">
                    {conv}% of head
                  </span>
                )}
              </div>
            </div>
            <div className="h-2.5 overflow-hidden rounded-pill bg-line">
              <div
                className="h-full rounded-pill transition-[width] duration-500"
                style={{ width: `${Math.max(2, pct)}%`, background: s.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
