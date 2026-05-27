"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

// Floating bottom-tab nav (PRD §6.5). Pill-style card hovering above the
// content with a gradient fade behind it. Uses next/navigation pathname for
// active-tab detection (hence "use client").

type Tab = {
  href: string;
  label: string;
  icon: IconName;
};

const TABS: Tab[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/academy", label: "Academy", icon: "academy" },
  { href: "/projects", label: "Projects", icon: "project" },
  { href: "/activity", label: "Activity", icon: "activity" },
];

type TabBarProps = {
  /** Per-tab badge counts shown as a red dot on the icon. */
  badges?: Partial<Record<Tab["href"], number>>;
};

export function TabBar({ badges = {} }: TabBarProps) {
  const pathname = usePathname();

  return (
    <nav className="absolute inset-x-0 bottom-0 z-40 px-4 pb-7 pt-2.5 bg-gradient-to-t from-bg from-60% to-transparent">
      <div className="flex h-16 items-center justify-around rounded-[28px] bg-card px-2 shadow-soft-md">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const badge = badges[tab.href];
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                "flex h-12 flex-1 flex-col items-center justify-center gap-[3px] transition-colors",
                active ? "text-accent" : "text-ink-3",
              ].join(" ")}
            >
              <span className="relative">
                <Icon
                  name={tab.icon}
                  size={22}
                  strokeWidth={active ? 1.9 : 1.6}
                />
                {badge && badge > 0 ? (
                  <span
                    className="absolute -right-2 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E53E3E] px-1 text-[10px] font-bold leading-none text-white"
                    style={{
                      border: "2px solid var(--color-card)",
                      boxShadow: "0 2px 6px rgba(229,62,62,0.4)",
                    }}
                  >
                    {badge}
                  </span>
                ) : null}
              </span>
              <span
                className={[
                  "text-[10.5px] tracking-[0.01em]",
                  active ? "font-bold" : "font-medium",
                ].join(" ")}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
