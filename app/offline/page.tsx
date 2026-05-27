import { Logo, PhoneShell } from "@/components/shared";

// PRD §11 — Offline shell. Served by the service worker (public/sw.js)
// when a navigation request fails (no network). Keeps the brand intact
// even when there's no signal — better than the browser's default
// "site can't be reached" page.
//
// Static-friendly: no DB queries, no cookies, no dynamic data. Safe to
// pre-cache at SW install time.

export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <PhoneShell tone="dark">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-10 text-center">
        <Logo height={56} dark />
        <div className="mx-auto h-px w-12 bg-accent" />
        <h1 className="text-h1 font-bold leading-tight tracking-[-0.02em] text-white">
          You&rsquo;re offline
        </h1>
        <p className="max-w-xs text-[13px] leading-relaxed text-white/65">
          Reconnect to load fresh projects, training, and notifications.
          Your last visited screens may still be available from cache.
        </p>
      </div>
    </PhoneShell>
  );
}
