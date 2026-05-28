import {
  AppHeader,
  Avatar,
  Card,
  Icon,
  Progress,
  TierBadge,
  type IconName,
  type Tier,
} from "@/components/shared";
import { EngagementRing } from "@/features/engagement";
import type { ActivityRow } from "@/features/engagement";
import {
  getBrokerBreakdown,
  listBrokerActivity,
} from "@/features/engagement/queries";
import { listPublishedProjects } from "@/features/projects/queries";
import { listPublishedModules } from "@/features/training/queries";
import { countSentNotifications } from "@/features/notifications/queries";
import { requireBroker } from "@/lib/auth";
import { signOutBroker } from "@/features/brokers";

// PRD §6.14 — Activity dashboard. Engagement ring · breakdown bars · stat
// tiles · recent-activity timeline.

export const dynamic = "force-dynamic";

const DAY_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});
const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

// Per-metric "target ceilings" for the breakdown bars. Engagement scoring
// (PRD §8.8) uses normalized(metric, target) — the same targets feed the bar
// fills here so they read consistently with the composite score.
const TARGETS = {
  visits: 30,
  shares: 100,
  modules: 24,
} as const;

const TYPE_LABEL: Record<string, { verb: string; icon: IconName; tone: string }> = {
  visit_booked: { verb: "Booked a visit at", icon: "calendar", tone: "text-balance" },
  tour_completed: { verb: "Completed a tour at", icon: "pin", tone: "text-success" },
  brochure_shared: { verb: "Shared", icon: "share", tone: "text-possibilities" },
  brochure_downloaded: { verb: "Downloaded brochure for", icon: "download", tone: "text-balance" },
  module_completed: { verb: "Completed", icon: "academy", tone: "text-success" },
  quiz_passed: { verb: "Passed quiz for", icon: "check", tone: "text-success" },
  workshop_attended: { verb: "Attended workshop", icon: "video", tone: "text-accent" },
};

export default async function ActivityPage() {
  const broker = await requireBroker();
  const [breakdown, activity, projects, modules, notifCount] = await Promise.all([
    getBrokerBreakdown(broker.id),
    listBrokerActivity(broker.id, 20),
    listPublishedProjects(),
    listPublishedModules(),
    countSentNotifications(),
  ]);

  const projectName = new Map(projects.map((p) => [p.id, p.name]));
  const moduleName = new Map(modules.map((m) => [m.id, m.title]));

  return (
    <>
      <AppHeader
        brokerName={broker.name}
        brokerPhotoUrl={broker.photo_url}
        notificationCount={notifCount}
      />

      <div className="px-5 pb-3 pt-1">
        <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.13em] text-accent">
          Your activity
        </div>
        <h1 className="text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
          Effort, measured.
        </h1>
      </div>

      {/* Engagement ring + identity card */}
      <div className="px-4 pb-4">
        <Card pad={18}>
          <div className="flex items-center gap-4">
            <EngagementRing score={broker.engagement_score} size={132} />
            <div className="min-w-0 flex-1">
              <Avatar
                name={broker.name}
                src={broker.photo_url}
                size={48}
                className="mb-3"
              />
              <div className="text-[15px] font-bold leading-tight text-ink">
                {broker.name}
              </div>
              {broker.brokerage && (
                <div className="mb-2 text-[12px] text-ink-3">
                  {broker.brokerage}
                </div>
              )}
              <TierBadge tier={broker.tier as Tier} compact />
            </div>
          </div>
        </Card>
      </div>

      {/* Breakdown bars */}
      <div className="px-4 pb-4">
        <Card pad={18}>
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-ink-3">
            Breakdown
          </div>
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
            last
          />
        </Card>
      </div>

      {/* Stat tiles */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <StatTile icon="calendar" v={breakdown.visits} label="visits" />
          <StatTile icon="share" v={breakdown.shares} label="shares" />
          <StatTile icon="academy" v={breakdown.modulesCompleted} label="modules" />
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 pb-4">
        <div className="mb-2.5 px-1 text-[13px] font-bold uppercase tracking-[0.13em] text-ink-3">
          Recent activity
        </div>
        {activity.length === 0 ? (
          <Card>
            <div className="py-2 text-[13px] text-ink-3">
              No activity yet. Share a brochure or book a visit to start
              earning engagement.
            </div>
          </Card>
        ) : (
          <Card pad={4}>
            {activity.map((a, i) => (
              <TimelineRow
                key={a.id}
                row={a}
                projectName={a.project_id ? projectName.get(a.project_id) : undefined}
                moduleName={a.module_id ? moduleName.get(a.module_id) : undefined}
                last={i === activity.length - 1}
              />
            ))}
          </Card>
        )}
      </div>

      {/* Sign-out row (PROJECT_PLAN 2.1). Lives at the bottom of the
          activity tab — least likely place for an accidental tap. */}
      <div className="px-5 pb-2 pt-2">
        <form action={signOutBroker}>
          <button
            type="submit"
            className="w-full rounded-md py-3 text-center text-[12.5px] font-semibold text-ink-3 underline decoration-ink-4 underline-offset-2 hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}

function BreakdownRow({
  label,
  value,
  target,
  color,
  last,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-3"}>
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

function StatTile({
  icon,
  v,
  label,
}: {
  icon: IconName;
  v: number;
  label: string;
}) {
  return (
    <Card pad={14}>
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-tint text-accent">
        <Icon name={icon} size={15} />
      </div>
      <div className="text-h2 font-bold tracking-[-0.02em] text-ink">{v}</div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">
        {label}
      </div>
    </Card>
  );
}

function TimelineRow({
  row,
  projectName,
  moduleName,
  last,
}: {
  row: ActivityRow;
  projectName?: string;
  moduleName?: string;
  last?: boolean;
}) {
  const def = TYPE_LABEL[row.type] ?? {
    verb: row.type,
    icon: "activity" as IconName,
    tone: "text-ink-3",
  };
  const channel =
    typeof row.meta === "object" && row.meta !== null && !Array.isArray(row.meta)
      ? (row.meta as Record<string, unknown>).channel
      : undefined;
  const d = new Date(row.created_at);
  const target = moduleName ?? projectName ?? "Alef";
  const detail =
    row.type === "brochure_shared" && channel
      ? `${target} · ${String(channel)}`
      : target;
  return (
    <div
      className={[
        "flex items-start gap-3 px-3 py-3",
        last ? "" : "border-b border-line",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={["mt-0.5 shrink-0", def.tone].join(" ")}>
        <Icon name={def.icon} size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold leading-snug text-ink">
          {def.verb} <span className="text-ink-2">{detail}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[11px] font-semibold text-ink-2">
          {DAY_FMT.format(d)}
        </div>
        <div className="text-[10px] text-ink-3">{TIME_FMT.format(d)}</div>
      </div>
    </div>
  );
}
