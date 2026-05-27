"use client";

import { useState, type ReactNode } from "react";

type Tab = "overview" | "units" | "gallery" | "training";

type ProjectDetailTabsProps = {
  overview: ReactNode;
  units: ReactNode;
  gallery: ReactNode;
  training: ReactNode;
};

// PRD §6.9 — Project detail tabs: Overview · Units · Gallery · Training.
// Each tab's content is pre-rendered server-side and stuffed in; we just
// toggle which one is visible.
export function ProjectDetailTabs(props: ProjectDetailTabsProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const labels: ReadonlyArray<[Tab, string]> = [
    ["overview", "Overview"],
    ["units", "Units"],
    ["gallery", "Gallery"],
    ["training", "Training"],
  ];
  return (
    <div>
      <div className="sticky top-0 z-10 -mx-5 mb-3 border-b border-line bg-bg px-5">
        <div className="flex gap-5">
          {labels.map(([id, label]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={[
                  "relative py-3 text-[13px] font-semibold tracking-[-0.005em] transition-colors",
                  active ? "text-ink" : "text-ink-3",
                ].join(" ")}
              >
                {label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-sm bg-accent" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div>{props[tab]}</div>
    </div>
  );
}
