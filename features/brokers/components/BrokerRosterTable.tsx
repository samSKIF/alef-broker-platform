import Link from "next/link";
import { Avatar, Card, TierBadge, type Tier } from "@/components/shared";
import type { BrokerRosterRow } from "../types";

// Admin Brokers roster table (PRD §7.2). Click a row → /admin/brokers/[id]
// for the drill-down.

type BrokerRosterTableProps = {
  brokers: BrokerRosterRow[];
  totalModules: number;
};

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} d ago`;
  return new Date(iso).toLocaleDateString();
}

export function BrokerRosterTable({
  brokers,
  totalModules,
}: BrokerRosterTableProps) {
  return (
    <Card pad={0} className="overflow-hidden">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-bg">
          <tr className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-3">
            <Th>Broker</Th>
            <Th>Tier</Th>
            <Th align="right">Engagement</Th>
            <Th align="right">Visits</Th>
            <Th align="right">Shares</Th>
            <Th align="right">Modules</Th>
            <Th>Last active</Th>
          </tr>
        </thead>
        <tbody>
          {brokers.map((b, i) => (
            <tr
              key={b.id}
              className={[
                "transition-colors hover:bg-bg",
                i < brokers.length - 1 ? "border-b border-line" : "",
              ].join(" ")}
            >
              <td className="px-5 py-3">
                <Link
                  href={`/admin/brokers/${b.id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar name={b.name} src={b.photo_url} size={32} />
                  <div className="min-w-0">
                    <div className="font-semibold text-ink">{b.name}</div>
                    {b.brokerage && (
                      <div className="text-[11.5px] text-ink-3">
                        {b.brokerage}
                      </div>
                    )}
                  </div>
                </Link>
              </td>
              <td className="px-5 py-3">
                <TierBadge tier={b.tier as Tier} compact />
              </td>
              <td className="px-5 py-3 text-right">
                <EngagementMini value={b.engagement_score} />
              </td>
              <td className="px-5 py-3 text-right font-semibold tabular-nums text-ink">
                {b.visits}
              </td>
              <td className="px-5 py-3 text-right font-semibold tabular-nums text-ink">
                {b.shares}
              </td>
              <td className="px-5 py-3 text-right font-semibold tabular-nums text-ink">
                {b.modulesCompleted}
                <span className="text-ink-3">/{totalModules}</span>
              </td>
              <td className="px-5 py-3 text-[12px] text-ink-3">
                {relativeTime(b.lastActiveIso)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <th
      className={[
        "px-5 py-3 font-bold",
        align === "right" ? "text-right" : "text-left",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function EngagementMini({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const tone =
    value >= 80
      ? "var(--color-success)"
      : value >= 60
        ? "var(--color-gold)"
        : value >= 30
          ? "var(--color-accent)"
          : "var(--color-balance)";
  return (
    <div className="inline-flex items-center justify-end gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-pill bg-line">
        <div
          className="h-full rounded-pill"
          style={{ width: `${pct}%`, background: tone }}
        />
      </div>
      <span className="w-8 text-right text-[13px] font-bold tabular-nums text-ink">
        {pct}
      </span>
    </div>
  );
}
