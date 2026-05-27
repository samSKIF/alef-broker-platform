"use client";

import { useState, type ReactNode } from "react";

type AcademyTabsProps = {
  online: ReactNode;
  live: ReactNode;
};

// Client-side toggle between the Online · video and Face-to-face module
// lists (PRD §6.7 segmented control). Both lists are pre-rendered server-side
// and stuffed into this component; we just toggle which one is visible.
export function AcademyTabs({ online, live }: AcademyTabsProps) {
  const [tab, setTab] = useState<"online" | "live">("online");
  return (
    <>
      <div className="px-5 pb-3.5">
        <div className="inline-flex gap-1 rounded-pill border border-line bg-card p-1 shadow-soft-sm">
          {(
            [
              { id: "online", label: "Online · video" },
              { id: "live", label: "Face-to-face" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTab(opt.id)}
              className={[
                "rounded-pill px-4 py-2 text-[13px] font-semibold transition-colors",
                tab === opt.id
                  ? "bg-ink text-white"
                  : "bg-transparent text-ink-2",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4">{tab === "online" ? online : live}</div>
    </>
  );
}
