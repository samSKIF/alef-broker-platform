import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/shared";
import { deleteCampaign } from "../actions";
import type { Campaign } from "../types";

export function CampaignAdminRow({ campaign }: { campaign: Campaign }) {
  return (
    <tr className="border-b border-line last:border-b-0 hover:bg-bg">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-tint">
            {campaign.image && (
              <Image
                src={campaign.image}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            )}
            {!campaign.image && campaign.kind === "commission" && (
              <div className="flex h-full w-full items-center justify-center bg-ink text-accent">
                <Icon name="sparkle" size={14} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/admin/campaigns/${campaign.id}`}
              className="text-[13.5px] font-bold text-ink hover:underline"
            >
              {campaign.title}
            </Link>
            {campaign.subtitle && (
              <div className="text-[11.5px] text-ink-3">
                {campaign.subtitle}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-5 py-3 text-[12px] text-ink-2">
        {campaign.tag ?? "—"}
      </td>
      <td className="px-5 py-3 text-[12px] text-ink-2">
        {campaign.schedule ?? "—"}
      </td>
      <td className="px-5 py-3">
        <span
          className={[
            "rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]",
            campaign.published
              ? "bg-success/15 text-success"
              : "bg-line text-ink-3",
          ].join(" ")}
        >
          {campaign.published ? "Published" : "Draft"}
        </span>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/campaigns/${campaign.id}`}
            className="rounded-pill border border-line bg-card px-2.5 py-1 text-[11.5px] font-semibold text-ink hover:bg-bg"
          >
            Edit
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteCampaign(campaign.id);
            }}
          >
            <button
              type="submit"
              aria-label={`Delete ${campaign.title}`}
              className="flex h-6 w-6 items-center justify-center rounded-pill text-ink-3 hover:bg-[#E53E3E]/10 hover:text-[#E53E3E]"
            >
              <Icon name="close" size={14} />
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
