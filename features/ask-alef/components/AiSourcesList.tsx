import Link from "next/link";
import { Card, Icon } from "@/components/shared";
import { deleteAiSource, toggleAiSource } from "../actions";
import type { AiSource } from "../types";

// Admin list of ai_sources rows. Each row has inline toggle and delete.

export function AiSourcesList({
  sources,
  projectName,
}: {
  sources: AiSource[];
  projectName: Map<string, string>;
}) {
  if (sources.length === 0) {
    return (
      <Card>
        <div className="py-6 text-center text-[13px] text-ink-3">
          No knowledge sources yet —{" "}
          <Link
            href="/admin/ai-training/source/new"
            className="font-semibold text-accent hover:underline"
          >
            add the first one
          </Link>
          .
        </div>
      </Card>
    );
  }
  return (
    <Card pad={0} className="overflow-hidden">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-bg">
          <tr className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-3">
            <th className="px-5 py-3">Source</th>
            <th className="px-5 py-3">Kind</th>
            <th className="px-5 py-3">Project</th>
            <th className="px-5 py-3">Content</th>
            <th className="px-5 py-3">Enabled</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {sources.map((s, i) => (
            <tr
              key={s.id}
              className={i < sources.length - 1 ? "border-b border-line" : ""}
            >
              <td className="px-5 py-3">
                <Link
                  href={`/admin/ai-training/source/${s.id}`}
                  className="font-bold text-ink hover:underline"
                >
                  {s.title}
                </Link>
                {s.file_url && (
                  <div className="mt-0.5">
                    <a
                      href={s.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-accent hover:underline"
                    >
                      view file ↗
                    </a>
                  </div>
                )}
              </td>
              <td className="px-5 py-3 text-[12px] text-ink-2">{s.kind}</td>
              <td className="px-5 py-3 text-[12px] text-ink-2">
                {s.project_id ? (projectName.get(s.project_id) ?? s.project_id) : "—"}
              </td>
              <td className="px-5 py-3 text-[12px] text-ink-3">
                {s.content ? `${s.content.length.toLocaleString()} chars` : "—"}
              </td>
              <td className="px-5 py-3">
                <form
                  action={async () => {
                    "use server";
                    await toggleAiSource(s.id, !s.enabled);
                  }}
                >
                  <button
                    type="submit"
                    aria-pressed={s.enabled}
                    className={[
                      "relative h-5 w-9 rounded-full transition-colors",
                      s.enabled ? "bg-accent" : "bg-ink-4",
                    ].join(" ")}
                    aria-label={s.enabled ? "Disable source" : "Enable source"}
                  >
                    <span
                      className={[
                        "absolute top-0.5 inline-block h-4 w-4 rounded-full bg-white shadow-soft-sm transition-transform",
                        s.enabled ? "translate-x-4" : "translate-x-0.5",
                      ].join(" ")}
                    />
                  </button>
                </form>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/ai-training/source/${s.id}`}
                    className="rounded-pill border border-line bg-card px-2.5 py-1 text-[11.5px] font-semibold text-ink hover:bg-bg"
                  >
                    Edit
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteAiSource(s.id);
                    }}
                  >
                    <button
                      type="submit"
                      aria-label={`Delete ${s.title}`}
                      className="flex h-6 w-6 items-center justify-center rounded-pill text-ink-3 hover:bg-[#E53E3E]/10 hover:text-[#E53E3E]"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
