"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Tiny client-only helper: after `delay` ms, navigates to `target`.
// Lives next to the splash page so the page itself stays a server component
// (and can read the broker cookie to decide whether to skip onboarding).
export function SplashAutoAdvance({
  target,
  delay,
}: {
  target: string;
  delay: number;
}) {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace(target), delay);
    return () => clearTimeout(t);
  }, [router, target, delay]);
  return null;
}
