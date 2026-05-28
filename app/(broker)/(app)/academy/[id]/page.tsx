import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader, Card, Icon } from "@/components/shared";
import { MarkCompleteButton } from "@/features/training";
import {
  listCompletedModuleIds,
  listPublishedModules,
} from "@/features/training/queries";
import { countSentNotifications } from "@/features/notifications/queries";
import { requireBroker } from "@/lib/auth";

// PRD §6.7 — Module detail. Video + quiz proper is Phase 2; for Phase 1
// we show the module metadata and let the broker mark it complete (writes
// a module_completed activity row).

export const dynamic = "force-dynamic";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const broker = await requireBroker();
  const [modules, completed, notifCount] = await Promise.all([
    listPublishedModules(),
    listCompletedModuleIds(broker.id),
    countSentNotifications(),
  ]);
  const mod = modules.find((m) => m.id === id);
  if (!mod) notFound();

  return (
    <>
      <AppHeader
        brokerName={broker.name}
        brokerPhotoUrl={broker.photo_url}
        notificationCount={notifCount}
      />
      <div className="px-5 pt-1">
        <Link
          href="/academy"
          className="mb-3 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3"
        >
          <Icon name="chevron-left" size={16} />
          Academy
        </Link>
        <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.13em] text-accent">
          {mod.kind === "online" ? "Online · video" : "Workshop"}
        </div>
        <h1 className="text-h2 font-bold leading-[1.2] tracking-[-0.01em]">
          {mod.title}
        </h1>
        {mod.duration && (
          <div className="mt-1.5 text-[13px] text-ink-3">{mod.duration}</div>
        )}
      </div>

      <div className="px-4 py-4">
        <Card>
          <div className="flex items-baseline justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-3">
              Reward
            </div>
            <div>
              <span className="text-[22px] font-bold tracking-[-0.02em] text-accent">
                +{mod.points}
              </span>
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-3">
                pts
              </span>
            </div>
          </div>
          {mod.tier_required && (
            <div className="mt-3 flex items-center gap-1.5 text-[13px] text-ink-2">
              <Icon name="lock" size={14} className="text-ink-3" />
              {mod.tier_required} tier required
            </div>
          )}
          {mod.when_at && (
            <div className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-2">
              <Icon name="calendar" size={14} className="text-ink-3" />
              {mod.when_at}
              {mod.location ? ` · ${mod.location}` : ""}
            </div>
          )}
        </Card>
      </div>

      <div className="px-5 pb-6 pt-2">
        <MarkCompleteButton
          brokerId={broker.id}
          moduleId={mod.id}
          done={completed.has(mod.id)}
        />
      </div>

      <div className="px-5 pb-6 text-[12px] text-ink-3">
        <Icon
          name="sparkle"
          size={12}
          className="mr-1 inline-block align-text-bottom text-accent"
        />
        Quiz-taking arrives in Phase 2 (PRD §6.7) — for now, mark the module
        complete to log credit and earn points.
      </div>
    </>
  );
}
