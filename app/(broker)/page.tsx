import { Logo, PhoneShell } from "@/components/shared";
import { getCurrentBroker } from "@/lib/auth";
import { SplashAutoAdvance } from "./_splash-auto-advance";

// PRD §6.1 — Splash. Animated logo, copper aurora behind, faint twinkles,
// concentric rings, "For brokers / للوسطاء" taglines. Auto-advances to
// /welcome (or /home if a broker session already exists).

// Twinkle constellation coordinates from the design's screens-splash.jsx.
const TWINKLES: ReadonlyArray<readonly [number, number]> = [
  [40, 80], [110, 140], [210, 60], [300, 120], [370, 90],
  [60, 260], [180, 210], [280, 250], [360, 300],
  [40, 750], [120, 810], [250, 780], [360, 820],
];

export const dynamic = "force-dynamic";

export default async function Splash() {
  const broker = await getCurrentBroker();
  const target = broker ? "/home" : "/welcome";

  return (
    <PhoneShell tone="dark">
      {/* Copper aurora rising from below — sparing accent. */}
      <div
        aria-hidden
        className="absolute left-1/2 -bottom-[260px] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-accent blur-[110px]"
        style={{ animation: "splashGlow 5s ease-in-out infinite" }}
      />

      {/* Faint constellation. */}
      <svg
        aria-hidden
        viewBox="0 0 420 874"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
      >
        {TWINKLES.map(([x, y], i) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 1.6 : 1}
            fill="#fff"
            style={{
              opacity: 0,
              animation: `splashTwinkle 2.6s ease ${0.4 + i * 0.08}s infinite alternate`,
            }}
          />
        ))}
      </svg>

      {/* Concentric rings behind the lockup. */}
      <div className="absolute left-1/2 top-[40%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-full border border-accent opacity-0"
            style={{
              animation: `splashRing 3.4s cubic-bezier(.2,.7,.2,1) ${i * 1.15}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Logo + taglines. */}
      <div className="relative z-10 -mt-8 mb-15 flex flex-1 flex-col items-center justify-center px-10 text-center">
        <div
          className="opacity-0"
          style={{
            animation:
              "splashLogoFade 1s cubic-bezier(.2,.7,.2,1) .3s forwards",
          }}
        >
          <Logo height={80} dark alt="Alef" />
        </div>

        <div
          className="mx-auto mt-7 mb-3 h-[1.5px] w-0 bg-accent"
          style={{
            animation: "splashLine 1s cubic-bezier(.2,.7,.2,1) 1.3s forwards",
          }}
        />

        <div
          className="text-[11px] font-medium uppercase tracking-[0.36em] text-white/60 opacity-0"
          style={{ animation: "splashFadeUp .8s ease 1.7s forwards" }}
        >
          For brokers
        </div>

        <div
          dir="rtl"
          className="mt-2 text-[13px] text-white/45 opacity-0"
          style={{
            fontFamily: "var(--font-ar)",
            animation: "splashFadeUp .8s ease 2s forwards",
          }}
        >
          للوسطاء
        </div>
      </div>

      {/* Progress shimmer + status label. */}
      <div
        className="absolute bottom-24 left-1/2 h-[2.5px] w-[140px] -translate-x-1/2 overflow-hidden rounded-sm bg-white/10 opacity-0"
        style={{ animation: "splashFade .5s ease 2.6s forwards" }}
      >
        <div
          className="absolute -left-[40%] top-0 h-full w-[40%]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            animation: "splashShimmer 1.8s ease-in-out 2.6s infinite",
          }}
        />
      </div>
      <div
        className="absolute bottom-[62px] left-0 right-0 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-white/35 opacity-0"
        style={{ animation: "splashFade .5s ease 2.9s forwards" }}
      >
        Preparing your dashboard
      </div>

      <SplashAutoAdvance target={target} delay={3800} />
    </PhoneShell>
  );
}
