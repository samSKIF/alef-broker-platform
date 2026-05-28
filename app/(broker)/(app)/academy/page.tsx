import Link from "next/link";
import {
  AppHeader,
  Card,
  Icon,
  type Tier,
} from "@/components/shared";
import {
  AcademyTabs,
  LiveModuleCard,
  ModuleCard,
} from "@/features/training";
import {
  listCompletedModuleIds,
  listPublishedModules,
} from "@/features/training/queries";
import { countSentNotifications } from "@/features/notifications/queries";
import { requireBroker } from "@/lib/auth";

// PRD §6.7 — Academy. Title · pending-for-you card · tier rail · segmented
// control (Online video / Face-to-face) · module list.

export const dynamic = "force-dynamic";

const TIERS: ReadonlyArray<{ name: Tier; threshold: number; color: string }> = [
  { name: "Bronze", threshold: 0, color: "var(--color-bronze)" },
  { name: "Silver", threshold: 1000, color: "var(--color-silver)" },
  { name: "Gold", threshold: 2500, color: "var(--color-gold)" },
  { name: "Preferred", threshold: 5000, color: "var(--color-preferred)" },
];

const TIER_RANK: Record<Tier, number> = {
  Bronze: 0,
  Silver: 1,
  Gold: 2,
  Preferred: 3,
};

// Map a module's title to a cover image filename in /public/assets, when
// the design uses one (the Hayyan lagoon module gets the Hayyan photo).
function coverImageForModule(title: string): string | null {
  if (title.toLowerCase().includes("hayyan")) {
    return "/assets/hayyan-outside.jpg";
  }
  return null;
}

export default async function AcademyPage() {
  const broker = await requireBroker();
  const [modules, completed, notifCount] = await Promise.all([
    listPublishedModules(),
    listCompletedModuleIds(broker.id),
    countSentNotifications(),
  ]);

  const brokerTier = broker.tier as Tier;
  const brokerRank = TIER_RANK[brokerTier] ?? 0;

  const onlineModules = modules.filter((m) => m.kind === "online");
  const liveModules = modules.filter((m) => m.kind === "live");

  // The first uncompleted module the broker has access to — drives the
  // "Pending for you" card.
  const nextUp =
    onlineModules.find(
      (m) =>
        !completed.has(m.id) &&
        (!m.tier_required ||
          TIER_RANK[m.tier_required as Tier] <= brokerRank),
    ) ?? null;

  return (
    <>
      <AppHeader
        brokerName={broker.name}
        brokerPhotoUrl={broker.photo_url}
        notificationCount={notifCount}
      />

      <div className="px-5 pb-3 pt-1">
        <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.13em] text-accent">
          The Academy
        </div>
        <h1 className="text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
          Learn. Earn.
          <br />
          Climb the tiers.
        </h1>
      </div>

      {/* Pending for you */}
      {nextUp && (
        <section className="px-4 pb-4">
          <div className="flex items-center gap-2 px-1 pb-2.5">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-[#E53E3E]"
              style={{ boxShadow: "0 0 0 4px rgba(229,62,62,0.18)" }}
            />
            <div className="text-[12px] font-bold uppercase tracking-[0.13em] text-ink">
              Pending for you
            </div>
            <div className="ml-auto text-[11px] font-semibold text-ink-3">
              1 item
            </div>
          </div>
          <Link href={`/academy/${nextUp.id}`}>
            <Card className="flex items-center gap-3 !p-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-tint text-accent">
                <Icon name="play" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.13em] text-accent">
                  Continue
                </div>
                <div className="text-[14px] font-bold leading-[1.2] tracking-[-0.005em] text-ink">
                  {nextUp.title}
                </div>
                {nextUp.duration && (
                  <div className="mt-0.5 text-[11.5px] text-ink-3">
                    {nextUp.duration}
                  </div>
                )}
              </div>
              <Icon name="chevron-right" size={18} className="text-ink-3" />
            </Card>
          </Link>
        </section>
      )}

      {/* Tier rail */}
      <section className="px-4 pb-4">
        <Card pad={18}>
          <TierRailHeader broker={{ tier: brokerTier, points: broker.points }} />
          <TierRail tier={brokerTier} points={broker.points} />
        </Card>
      </section>

      <AcademyTabs
        online={
          <div>
            {onlineModules.map((m) => (
              <ModuleCard
                key={m.id}
                module={m}
                coverImage={coverImageForModule(m.title)}
                done={completed.has(m.id)}
                locked={
                  !!m.tier_required &&
                  TIER_RANK[m.tier_required as Tier] > brokerRank
                }
              />
            ))}
          </div>
        }
        live={
          <div>
            {liveModules.map((m) => (
              <LiveModuleCard key={m.id} module={m} />
            ))}
          </div>
        }
      />
    </>
  );
}

function TierRailHeader({
  broker,
}: {
  broker: { tier: Tier; points: number };
}) {
  const next = TIERS.find((t) => broker.points < t.threshold);
  if (!next) {
    return (
      <div className="mb-3 text-[14px] font-bold text-ink">
        You&apos;ve reached <span className="text-accent">Preferred</span>.
      </div>
    );
  }
  const remaining = next.threshold - broker.points;
  return (
    <div className="mb-3.5 text-[14px] font-bold text-ink">
      You are <span className="text-accent">{remaining.toLocaleString()} pts</span>{" "}
      from <strong>{next.name}</strong>
    </div>
  );
}

function TierRail({ tier, points }: { tier: Tier; points: number }) {
  const curIdx = TIERS.findIndex((t) => t.name === tier);
  const next = TIERS[curIdx + 1];
  const segPct = next
    ? Math.max(0, Math.min(1, (points - TIERS[curIdx].threshold) / (next.threshold - TIERS[curIdx].threshold)))
    : 1;
  const railPct = ((curIdx + segPct) / (TIERS.length - 1)) * 100;

  return (
    <div>
      <div className="relative h-[30px]">
        <div className="absolute left-1.5 right-1.5 top-[13px] h-[3px] rounded-sm bg-[#EEE9E4]" />
        <div
          className="absolute left-1.5 top-[13px] h-[3px] rounded-sm bg-accent"
          style={{ width: `calc(${railPct}% - 6px)` }}
        />
        {TIERS.map((t, i) => {
          const reached = i <= curIdx;
          const isCurrent = i === curIdx;
          const x = (i / (TIERS.length - 1)) * 100;
          return (
            <div
              key={t.name}
              className="absolute top-[5px] h-5 w-5 rounded-full border-2"
              style={{
                left: `calc(${x}% - 10px)`,
                background: reached ? t.color : "#fff",
                borderColor: reached ? t.color : "#E0DDD7",
                boxShadow: isCurrent ? "0 0 0 4px var(--color-tint)" : undefined,
              }}
            />
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between">
        {TIERS.map((t, i) => (
          <div
            key={t.name}
            className={[
              "text-[10.5px] tracking-wide",
              i <= curIdx ? "text-ink" : "text-ink-3",
              i === curIdx ? "font-bold" : "font-medium",
            ].join(" ")}
          >
            {t.name}
          </div>
        ))}
      </div>
    </div>
  );
}
