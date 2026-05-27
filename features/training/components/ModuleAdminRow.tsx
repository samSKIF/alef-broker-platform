import Link from "next/link";
import { Icon } from "@/components/shared";
import { deleteModule } from "../actions";
import type { Module } from "../types";

export function ModuleAdminRow({
  mod,
  projectName,
}: {
  mod: Module;
  projectName?: string;
}) {
  return (
    <tr className="border-b border-line last:border-b-0 hover:bg-bg">
      <td className="px-5 py-3">
        <Link
          href={`/admin/academy/${mod.id}`}
          className="text-[13.5px] font-bold text-ink hover:underline"
        >
          {mod.title}
        </Link>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-3">
          <span className="capitalize">{mod.kind}</span>
          {projectName && (
            <>
              <span className="text-ink-4">·</span>
              <span>{projectName}</span>
            </>
          )}
          {mod.tier_required && (
            <>
              <span className="text-ink-4">·</span>
              <span>{mod.tier_required} tier</span>
            </>
          )}
        </div>
      </td>
      <td className="px-5 py-3 text-[12px] text-ink-2">
        {mod.kind === "online" ? (mod.duration ?? "—") : (mod.when_at ?? "—")}
      </td>
      <td className="px-5 py-3 text-[13px] font-bold text-accent">
        +{mod.points}
      </td>
      <td className="px-5 py-3">
        <span
          className={[
            "rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]",
            mod.published
              ? "bg-success/15 text-success"
              : "bg-line text-ink-3",
          ].join(" ")}
        >
          {mod.published ? "Published" : "Draft"}
        </span>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/academy/${mod.id}`}
            className="rounded-pill border border-line bg-card px-2.5 py-1 text-[11.5px] font-semibold text-ink hover:bg-bg"
          >
            Edit
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteModule(mod.id);
            }}
          >
            <button
              type="submit"
              aria-label={`Delete ${mod.title}`}
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
