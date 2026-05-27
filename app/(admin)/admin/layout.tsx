"use client";

import { usePathname } from "next/navigation";
import {
  AdminShell,
  type AdminRouteId,
} from "@/components/shared";

// PRD §7 admin chrome wrapper. Determines the active sidebar item from
// the current pathname so the layout can stay generic. Marked 'use client'
// only because usePathname is a client hook; the children (pages) can
// still be server components.

function routeFromPath(pathname: string): AdminRouteId {
  if (pathname.startsWith("/admin/brokers")) return "brokers";
  if (pathname.startsWith("/admin/projects")) return "projects";
  if (pathname.startsWith("/admin/academy")) return "academy";
  if (pathname.startsWith("/admin/campaigns")) return "campaigns";
  if (pathname.startsWith("/admin/push")) return "push";
  if (pathname.startsWith("/admin/ai-training")) return "ai-training";
  return "overview";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return <AdminShell route={routeFromPath(pathname)}>{children}</AdminShell>;
}
