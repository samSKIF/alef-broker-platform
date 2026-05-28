import Link from "next/link";
import { Avatar, TierBadge, type Tier } from "@/components/shared";
import type { LeaderboardBroker } from "../types";

// Top-brokers leaderboard (PRD §7.1) — ranked by engagement score.

export function Leaderboard({ brokers }: { brokers: LeaderboardBroker[] }) {
  if (brokers.length === 0) {
    return (
      <div className="py-4 text-[13px] text-ink-3">No brokers yet.</div>
    );
  }
  return (
    <ol className="flex flex-col">
      {brokers.map((b, i) => (
        <li
          key={b.id}
          className={[
            "flex items-center gap-3 py-3",
            i < brokers.length - 1 ? "border-b border-line" : "",
          ].join(" ")}
        >
          <div className="w-6 shrink-0 text-center text-[12px] font-bold text-ink-3">
            #{i + 1}
          </div>
          <Avatar name={b.name} src={b.photo_url} size={36} />
          <Link
            href={`/admin/brokers/${b.id}`}
            className="min-w-0 flex-1"
          >
            <div className="text-[13.5px] font-bold text-ink hover:underline">
              {b.name}
            </div>
            {b.brokerage && (
              <div className="text-[11.5px] text-ink-3">{b.brokerage}</div>
            )}
          </Link>
          <TierBadge tier={b.tier as Tier} compact />
          <div className="w-12 shrink-0 text-right">
            <div className="text-[14px] font-bold text-ink">
              {b.engagement_score}
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.06em] text-ink-3">
              score
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
