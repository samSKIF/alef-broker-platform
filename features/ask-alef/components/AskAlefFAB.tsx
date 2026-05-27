import Link from "next/link";
import { AlefAIAvatar } from "./AlefAIAvatar";

// Floating "Ask Alef AI" entry point — sits above the TabBar on Home
// (PRD §6.5 / §6.6). Tap to open /ask-alef.
//
// Positioned absolute against the nearest positioned ancestor — that's
// PhoneShell when rendered inside the (broker)(app) layout. Right side,
// just above the floating tab bar.

export function AskAlefFAB() {
  return (
    <Link
      href="/ask-alef"
      className="group absolute bottom-[102px] right-3.5 z-40 flex items-center gap-2.5 overflow-hidden rounded-pill bg-ink py-2 pl-2 pr-4 text-white shadow-[0_14px_30px_rgba(51,63,72,0.32),0_0_0_1px_rgba(255,255,255,0.06)]"
    >
      {/* Copper halo behind the pill */}
      <span
        aria-hidden
        className="absolute -inset-1 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 18% 50%, color-mix(in srgb, var(--color-accent) 33%, transparent), transparent 60%)",
        }}
      />
      <span className="relative flex items-center gap-2.5">
        <AlefAIAvatar size={32} pulse dark />
        <span className="flex flex-col leading-tight">
          <span className="text-[13px] font-bold tracking-[-0.005em]">
            Ask Alef AI
          </span>
          <span className="mt-0.5 text-[10px] tracking-[0.02em] text-white/60">
            your sales co-pilot
          </span>
        </span>
      </span>
    </Link>
  );
}
