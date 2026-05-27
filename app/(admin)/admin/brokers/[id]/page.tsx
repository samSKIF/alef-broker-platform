import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Avatar,
  Card,
  Icon,
  Progress,
  TierBadge,
  type IconName,
  type Tier,
} from "@/components/shared";
import { EngagementRing } from "@/features/engagement";
import {
  getBrokerBreakdown,
  listBrokerActivity,
} from "@/features/engagement/queries";
import { getBrokerById } from "@/features/brokers/queries";
import { listPublishedProjects } from "@/features/projects/queries";
import { listPublishedModules } from "@/features/training/queries";

// PRD §7.2 — Broker drill-down. Engagement breakdown + activity timeline.
// Mirrors the broker-side activity dashboard (PRD §6.14) but adds the
// broker's identity column and a "back to roster" link.
export const dynamic = "force-dynamic";

const TARGETS = { visits: 30, shares: 100, modules: 24 } as const;

const DAY_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});
const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

const TYPE_LABEL: Record<
  string,
  { verb: string; icon: IconName; tone: string }
> = {
  visit_booked: {
    verb: "Booked a visit at",
    icon: "calendar",
    tone: "text-balance",
  },
  tour_completed: {
    verb: "Completed a tour at",
    icon: "pin",
    tone: "text-success",
  },
  brochure_shared: {
    verb: "Shared",
    icon: "share",
    tone: "text-possibilities",
  },
  brochure_downloaded: {
    verb: "Downloaded brochure for",
    icon: "download",
    tone: "text-balance",
  },
  module_completed: {
    verb: "Completed",
    icon: "academy",
    tone: "text-success",
  },
  quiz_passed: {
    verb: "Passed quiz for",
    icon: "check",
    tone: "text-success",
  },
  workshop_attended: {
    verb: "Attended workshop",
    icon: "video",
    tone: "text-accent",
  },
};

export default async function AdminBrokerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [broker, breakdown, activity, projects, modules] = await Promise.all([
    getBrokerById(id),
    getBrokerBreakdown(id),
    listBrokerActivity(id, 50),
    listPublishedProjects(),
    listPublishedModules(),
  ]);
  if (!broker) notFound();

  const projectName = new Map(projects.map((p) => [p.id, p.name]));
  const moduleName = new Map(modules.map((m) => [m.id, m.title]));

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <Link
        href="/admin/brokers"
        className="mb-4 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3 hover:text-ink"
      >
        <Icon name="chevron-left" size={14} />
        All brokers
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Identity column */}
        <Card pad={22}>
          <div className="flex flex-col items-center text-center">
            <Avatar name={broker.name} size={84} className="mb-3" />
            <div className="text-[18px] font-bold text-ink">{broker.name}</div>
            {broker.brokerage && (
              <div className="mt-0.5 text-[13px] text-ink-3">
                {broker.brokerage}
              </div>
            )}
            <div className="mt-3">
              <TierBadge tier={broker.tier as Tier} />
            </div>
            <div className="mt-5 flex items-center gap-6">
              <Stat label="Points" value={broker.points.toLocaleString()} />
              <Stat label="Tier" value={broker.tier} />
            </div>
          </div>
        </Card>

        {/* Engagement ring + breakdown */}
        <Card pad={22} className="lg:col-span-2">
          <div className="flex items-start gap-6">
            <EngagementRing score={broker.engagement_score} size={140} />
            <div className="min-w-0 flex-1">
              <div className="text-h3 font-semibold tracking-[-0.005em] text-ink">
                Engagement breakdown
              </div>
              <div className="mt-0.5 text-caption text-ink-3">
                Counts against POC target ceilings.
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <BreakdownRow
                  label="Site visits booked"
                  value={breakdown.visits}
                  target={TARGETS.visits}
                  color="var(--color-balance)"
                />
                <BreakdownRow
                  label="Brochures shared"
                  value={breakdown.shares}
                  target={TARGETS.shares}
                  color="var(--color-possibilities)"
                />
                <BreakdownRow
                  label="Modules completed"
                  value={breakdown.modulesCompleted}
                  target={TARGETS.modules}
                  color="var(--color-accent)"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent activity timeline */}
      <div className="mt-6">
        <Card pad={0}>
          <div className="border-b border-line px-6 py-4">
            <div className="text-h3 font-semibold tracking-[-0.005em] text-ink">
              Recent activity
            </div>
            <div className="text-caption text-ink-3">
              Last {activity.length} events for {broker.name}
            </div>
          </div>
          {activity.length === 0 ? (
            <div className="px-6 py-6 text-[13px] text-ink-3">
              No activity yet.
            </div>
          ) : (
            <ul>
              {activity.map((a, i) => {
                const def = TYPE_LABEL[a.type] ?? {
                  verb: a.type,
                  icon: "activity" as IconName,
                  tone: "text-ink-3",
                };
                const channel =
                  typeof a.meta === "object" &&
                  a.meta !== null &&
                  !Array.isArray(a.meta)
                    ? (a.meta as Record<string, unknown>).channel
                    : undefined;
                const target =
                  (a.module_id && moduleName.get(a.module_id)) ||
                  (a.project_id && projectName.get(a.project_id)) ||
                  "Alef";
                const detail =
                  a.type === "brochure_shared" && channel
                    ? `${target} · ${String(channel)}`
                    : target;
                const d = new Date(a.created_at);
                return (
                  <li
                    key={a.id}
                    className={[
                      "flex items-center gap-4 px-6 py-3",
                      i < activity.length - 1 ? "border-b border-line" : "",
                    ].join(" ")}
                  >
                    <div className={["shrink-0", def.tone].join(" ")}>
                      <Icon name={def.icon} size={18} />
                    </div>
                    <div className="min-w-0 flex-1 text-[13.5px] font-semibold leading-snug text-ink">
                      {def.verb} <span className="text-ink-2">{detail}</span>
                    </div>
                    <div className="shrink-0 text-right text-[11px] text-ink-3">
                      <div className="font-semibold text-ink-2">
                        {DAY_FMT.format(d)}
                      </div>
                      <div>{TIME_FMT.format(d)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-[16px] font-bold text-ink">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.13em] text-ink-3">
        {label}
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <div className="text-[12.5px] font-semibold text-ink">{label}</div>
        <div className="text-[13px] font-bold text-ink">
          {value}
          <span className="ml-1 text-[10.5px] font-medium text-ink-3">
            / {target}
          </span>
        </div>
      </div>
      <Progress value={value} total={target} color={color} height={5} />
    </div>
  );
}
