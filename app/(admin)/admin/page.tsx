import { Card } from "@/components/shared";
import {
  EngagementDistribution,
  Funnel,
  Kpi,
  Leaderboard,
  WeeklyChart,
} from "@/features/engagement";
import { getAdminOverview } from "@/features/engagement/queries";

// PRD §7.1 — Admin Overview, the ROI screen.
// KPIs · weekly multi-series chart · engagement distribution · activity →
// transaction funnel · top-brokers leaderboard. All derived from the live
// `brokers` and `activity` tables — see PRD §12 for the Phase 1
// simplification on the funnel tail (tour/offer/transaction synthesised
// from visits via documented ratios).
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Active brokers"
          value={overview.activeBrokers}
          icon="user"
        />
        <Kpi
          label="Visits booked"
          value={overview.totalVisits}
          icon="calendar"
        />
        <Kpi
          label="Brochures shared"
          value={overview.totalShares}
          icon="share"
        />
        <Kpi
          label="Avg engagement"
          value={overview.avgEngagement}
          icon="activity"
          accent
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card pad={22} className="lg:col-span-2">
          <SectionHeader
            title="This week"
            sub="Network activity, last 7 days"
          />
          <WeeklyChart data={overview.weekly} />
        </Card>
        <Card pad={22}>
          <SectionHeader
            title="Engagement"
            sub="Broker score distribution"
          />
          <EngagementDistribution data={overview.distribution} />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card pad={22}>
          <SectionHeader
            title="Activity → transaction funnel"
            sub="Network conversion at each stage"
          />
          <Funnel stages={overview.funnel} />
        </Card>
        <Card pad={22}>
          <SectionHeader
            title="Top brokers"
            sub="Ranked by engagement score"
          />
          <Leaderboard brokers={overview.topBrokers} />
        </Card>
      </div>
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4">
      <div className="text-h3 font-semibold tracking-[-0.005em] text-ink">
        {title}
      </div>
      <div className="text-caption text-ink-3">{sub}</div>
    </div>
  );
}
