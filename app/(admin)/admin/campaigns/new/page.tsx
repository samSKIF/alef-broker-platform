import Link from "next/link";
import { Icon } from "@/components/shared";
import { CampaignAdminForm } from "@/features/campaigns";

export default function NewCampaignPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7">
      <Link
        href="/admin/campaigns"
        className="mb-4 inline-flex items-center gap-1 text-[12px] font-semibold text-ink-3 hover:text-ink"
      >
        <Icon name="chevron-left" size={14} />
        Campaigns
      </Link>
      <h1 className="mb-5 text-h2 font-bold tracking-[-0.01em] text-ink">
        New campaign
      </h1>
      <CampaignAdminForm />
    </div>
  );
}
