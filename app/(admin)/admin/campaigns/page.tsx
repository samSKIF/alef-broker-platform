import Link from "next/link";
import { Button, Card, Icon } from "@/components/shared";
import { CampaignAdminRow } from "@/features/campaigns";
import { listAllCampaigns } from "@/features/campaigns/queries";

// PRD §7.5 — Campaigns list. Author the "Alef · this week" carousel.
export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const campaigns = await listAllCampaigns();
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <div className="mb-5 flex items-baseline justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-[-0.01em] text-ink">
            Campaigns
          </h1>
          <div className="mt-0.5 text-caption text-ink-3">
            {campaigns.length} cards ·{" "}
            {campaigns.filter((c) => c.published).length} published
          </div>
        </div>
        <Button
          href="/admin/campaigns/new"
          kind="accent"
          icon={<Icon name="plus" size={16} />}
        >
          New campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <div className="py-6 text-center text-[13px] text-ink-3">
            No campaigns yet —{" "}
            <Link
              href="/admin/campaigns/new"
              className="font-semibold text-accent hover:underline"
            >
              create the first one
            </Link>
            .
          </div>
        </Card>
      ) : (
        <Card pad={0} className="overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-bg">
              <tr className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-3">
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3">Tag</th>
                <th className="px-5 py-3">Schedule</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <CampaignAdminRow key={c.id} campaign={c} />
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
