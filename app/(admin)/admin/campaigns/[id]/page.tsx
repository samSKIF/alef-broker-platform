import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/shared";
import { CampaignAdminForm } from "@/features/campaigns";
import { getCampaignById } from "@/features/campaigns/queries";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <Link
        href="/admin/campaigns"
        className="mb-4 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3 hover:text-ink"
      >
        <Icon name="chevron-left" size={14} />
        Campaigns
      </Link>
      <h1 className="mb-1 text-h2 font-bold tracking-[-0.01em] text-ink">
        {campaign.title}
      </h1>
      <div className="mb-5 text-caption text-ink-3">
        Edit campaign · id <span className="font-mono">{campaign.id}</span>
      </div>
      <CampaignAdminForm campaign={campaign} />
    </div>
  );
}
