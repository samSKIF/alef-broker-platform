import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { Logo } from "./Logo";

// Desktop admin chrome — navy sidebar + topbar + scrolling content column.
// Matches the design's `AdminShell` API but uses Next.js <Link> for navigation
// (the design uses an onNav callback against an in-memory router).

export const ADMIN_ROUTES = [
  {
    id: "overview",
    href: "/admin",
    label: "Overview",
    icon: "activity" as IconName,
    sub: "Headline metrics across the broker network",
  },
  {
    id: "brokers",
    href: "/admin/brokers",
    label: "Brokers",
    icon: "user" as IconName,
    sub: "Roster · engagement · per-broker activity",
  },
  {
    id: "projects",
    href: "/admin/projects",
    label: "Projects",
    icon: "project" as IconName,
    sub: "Author and publish Alef communities",
  },
  {
    id: "academy",
    href: "/admin/academy",
    label: "Academy",
    icon: "academy" as IconName,
    sub: "Training modules + quiz builder",
  },
  {
    id: "campaigns",
    href: "/admin/campaigns",
    label: "Campaigns",
    icon: "sparkle" as IconName,
    sub: 'The "Alef · this week" carousel',
  },
  {
    id: "push",
    href: "/admin/push",
    label: "Push notifications",
    icon: "bell" as IconName,
    sub: "Compose · target · schedule",
  },
  {
    id: "ai-training",
    href: "/admin/ai-training",
    label: "AI Training",
    icon: "sparkle" as IconName,
    sub: "Edit the Ask Alef assistant's instructions and knowledge",
  },
] as const;

export type AdminRouteId = (typeof ADMIN_ROUTES)[number]["id"];

type AdminShellProps = {
  route: AdminRouteId;
  children: ReactNode;
};

export function AdminShell({ route, children }: AdminShellProps) {
  const current = ADMIN_ROUTES.find((r) => r.id === route);
  return (
    <div className="flex h-screen bg-[#F4F4F2] text-ink">
      <AdminSidebar route={route} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-[72px] shrink-0 items-center gap-6 border-b border-line bg-card px-8">
          <div className="min-w-0 flex-1">
            <div className="text-h3 font-semibold tracking-[-0.01em]">
              {current?.label}
            </div>
            <div className="text-caption text-ink-3">{current?.sub}</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function AdminSidebar({ route }: { route: AdminRouteId }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/5 bg-ink py-6 text-white">
      {/* Brand row */}
      <div className="flex items-center justify-between px-[22px] pb-7 pt-1">
        <Logo height={20} dark />
        <span className="rounded-md border border-white/10 bg-white/[0.08] px-[7px] py-[3px] text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        <div className="px-2.5 pb-2.5 pt-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/40">
          Workspace
        </div>
        {ADMIN_ROUTES.map((item) => {
          const on = route === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "relative mb-0.5 flex items-center gap-[11px] rounded-[10px] px-3 py-2.5",
                "text-[13.5px]",
                on
                  ? "bg-white/[0.08] font-semibold text-white"
                  : "font-medium text-white/65 hover:bg-white/[0.04]",
              ].join(" ")}
            >
              {on && (
                <span
                  aria-hidden
                  className="absolute -left-3 top-2 bottom-2 w-[3px] rounded-sm bg-accent"
                />
              )}
              <Icon name={item.icon} size={17} strokeWidth={on ? 1.8 : 1.6} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Round-trip pill (the "publishing here lights up the broker app" reminder) */}
      <div className="px-[14px] pb-1 pt-3">
        <div className="rounded-xl border border-accent/30 bg-accent/15 p-3">
          <div className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-accent">
            Live link
          </div>
          <div className="text-[11.5px] leading-[1.4] text-white/[0.78]">
            Publishing here lights up the broker app in real time.
          </div>
        </div>
      </div>
    </aside>
  );
}
