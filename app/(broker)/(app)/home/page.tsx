import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AppHeader,
  Card,
  Icon,
  Progress,
  TierBadge,
  type Tier,
} from "@/components/shared";
import { CampaignCard } from "@/features/campaigns";
import { AskAlefFAB } from "@/features/ask-alef";
import { getBrokerById } from "@/features/brokers/queries";
import { listPublishedCampaigns } from "@/features/campaigns/queries";
import { countSentNotifications } from "@/features/notifications/queries";
import { getBrokerIdFromCookie } from "@/lib/dummy-account";

// PRD §6.5 + §6.7 — Home dashboard.
// Header + dated greeting · "Alef · this week" carousel · snapshot card
// (points/tier/progress) · 3-up quick actions.

export const dynamic = "force-dynamic";

// Tier ladder used by the snapshot card. Thresholds taken from the design's
// commission card ("Gold now from 2,500 pts") and the seed-data points
// distribution. Documented in PRD §12.
const TIERS: ReadonlyArray<{ tier: Tier; threshold: number }> = [
  { tier: "Bronze", threshold: 0 },
  { tier: "Silver", threshold: 1000 },
  { tier: "Gold", threshold: 2500 },
  { tier: "Preferred", threshold: 5000 },
];

function nextTier(points: number): { name: string; remaining: number } | null {
  for (const t of TIERS) {
    if (points < t.threshold) return { name: t.tier, remaining: t.threshold - points };
  }
  return null; // Already Preferred.
}

function progressTowardNext(points: number): { value: number; total: number } {
  // Find the next-up threshold; if none, return 100%.
  const next = TIERS.find((t) => points < t.threshold);
  if (!next) return { value: 1, total: 1 };
  // Find the previous threshold (i.e. the tier we're sitting in).
  const prevs = TIERS.filter((t) => t.threshold <= points);
  const prev = prevs[prevs.length - 1] ?? TIERS[0];
  return { value: points - prev.threshold, total: next.threshold - prev.threshold };
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default async function HomePage() {
  const brokerId = await getBrokerIdFromCookie();
  if (!brokerId) redirect("/welcome");
  const [broker, campaigns, notifCount] = await Promise.all([
    getBrokerById(brokerId),
    listPublishedCampaigns(),
    countSentNotifications(),
  ]);
  if (!broker) redirect("/welcome");

  const firstName = broker.name.split(/\s+/)[0] ?? broker.name;
  const next = nextTier(broker.points);
  const progress = progressTowardNext(broker.points);

  return (
    <>
      <AppHeader brokerName={broker.name} notificationCount={notifCount} />

      {/* Greeting */}
      <div className="px-5 pb-4 pt-1">
        <div className="text-[13px] font-medium tracking-[0.02em] text-ink-3">
          {DATE_FMT.format(new Date())}
        </div>
        <h1 className="mt-1 text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
          {greeting()},
          <br />
          {firstName}.
        </h1>
      </div>

      {/* "Alef · this week" carousel */}
      <section className="mb-4.5">
        <div className="flex items-baseline justify-between px-5 pb-2.5">
          <div className="text-[13px] font-bold uppercase tracking-[0.13em] text-ink-3">
            Alef · this week
          </div>
          <div className="text-[12px] font-semibold text-accent">See all</div>
        </div>
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
          <div className="w-1 shrink-0" aria-hidden />
        </div>
      </section>

      {/* Snapshot card */}
      <div className="px-4 pb-3.5">
        <div className="relative overflow-hidden rounded-2xl bg-ink p-4 pt-3.5 text-white">
          <div
            aria-hidden
            className="absolute -right-12 -top-12 h-[140px] w-[140px] rounded-full bg-accent opacity-[0.22]"
          />
          <div className="relative flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white/55">
                Your snapshot
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-bold leading-none tracking-[-0.025em]">
                  {broker.points.toLocaleString("en-US")}
                </span>
                <span className="text-[11px] font-bold tracking-[0.03em] text-accent">
                  PTS
                </span>
                {next && (
                  <span className="ml-1.5 text-[11px] text-white/55">
                    · {next.remaining.toLocaleString("en-US")} to {next.name}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <Progress
                  value={progress.value}
                  total={progress.total}
                  color="var(--color-accent)"
                  bgColor="rgba(255,255,255,0.12)"
                  height={4}
                />
              </div>
            </div>
            <TierBadge tier={broker.tier as Tier} compact />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 pb-4">
        <div className="mb-3 px-1 text-[13px] font-bold uppercase tracking-[0.13em] text-ink-3">
          Quick actions
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <QuickAction
            href="/booking"
            icon="calendar"
            label="Book a visit"
            sub="With client"
          />
          <QuickAction
            href="/brochure"
            icon="share"
            label="Share brochure"
            sub="Personalised"
          />
          <QuickAction
            href="/academy"
            icon="video"
            label="Resume training"
            sub="Pick up where you left off"
          />
        </div>
      </div>

      {/* Floating "Ask Alef AI" — sits above the tab bar (PRD §6.5 / §6.6). */}
      <AskAlefFAB />
    </>
  );
}

function QuickAction({
  href,
  icon,
  label,
  sub,
}: {
  href: string;
  icon: "calendar" | "share" | "video";
  label: string;
  sub: string;
}) {
  return (
    <Link href={href} className="block">
      <Card>
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-[10px] bg-tint text-accent">
          <Icon name={icon} size={17} />
        </div>
        <div className="text-[12.5px] font-bold leading-[1.15] tracking-[-0.005em] text-ink">
          {label}
        </div>
        <div className="mt-0.5 text-[10.5px] leading-[1.2] text-ink-3">
          {sub}
        </div>
      </Card>
    </Link>
  );
}
