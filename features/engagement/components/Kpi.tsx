import { Card, Icon, type IconName } from "@/components/shared";

// Admin Overview KPI card (PRD §7.1). Single big number + label, with
// an icon tile and an optional delta indicator.

type KpiProps = {
  label: string;
  value: number | string;
  icon: IconName;
  delta?: { value: string; up?: boolean };
  accent?: boolean;
};

export function Kpi({ label, value, icon, delta, accent }: KpiProps) {
  return (
    <Card pad={20}>
      <div className="flex items-start justify-between">
        <div
          className={[
            "flex h-9 w-9 items-center justify-center rounded-md",
            accent ? "bg-accent text-white" : "bg-tint text-accent",
          ].join(" ")}
        >
          <Icon name={icon} size={18} />
        </div>
        {delta && (
          <div
            className={[
              "rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]",
              delta.up
                ? "bg-success/15 text-success"
                : "bg-[#E53E3E]/10 text-[#E53E3E]",
            ].join(" ")}
          >
            {delta.up ? "↑" : "↓"} {delta.value}
          </div>
        )}
      </div>
      <div className="mt-4 text-[28px] font-bold leading-none tracking-[-0.025em] text-ink">
        {value}
      </div>
      <div className="mt-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">
        {label}
      </div>
    </Card>
  );
}
