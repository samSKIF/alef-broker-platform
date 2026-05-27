import type { ReactNode } from "react";

// Container for the broker app.
//   On a phone-sized viewport: just full-screen, no chrome.
//   On a desktop viewport: 390×844 rounded device frame with soft shadow,
//   centered on the page — useful when previewing the PWA in a browser.
// We do NOT recreate iOS status bar / home indicator (per PRD §3 — the
// real app is a PWA so the OS chrome is the OS chrome).

type PhoneShellProps = {
  children: ReactNode;
  className?: string;
  /** "light" (default — Wild Sand bg, ink text) for app screens; "dark" (navy
   *  bg, white text) for the splash and other ink-on-dark moments. */
  tone?: "light" | "dark";
};

export function PhoneShell({
  children,
  className = "",
  tone = "light",
}: PhoneShellProps) {
  const inner =
    tone === "dark" ? "bg-ink text-white" : "bg-bg text-ink";
  return (
    <div className="min-h-full flex items-center justify-center bg-bg sm:p-6">
      <div
        className={[
          "relative w-full overflow-hidden flex flex-col",
          inner,
          // Phone-sized viewport → exactly the dynamic visible area.
          // `h-dvh` (100dvh) excludes the iOS Safari chrome and shrinks
          // when the on-screen keyboard appears — without it, `flex-1`
          // children collapse and bottom-pinned inputs (Ask Alef chat,
          // onboarding form) get pushed below the keyboard. `h-screen`
          // is the fallback for browsers that don't support dvh.
          "h-screen h-dvh",
          // Desktop-sized viewport → 390×844 device frame.
          "sm:w-[390px] sm:h-[844px] sm:min-h-0",
          "sm:rounded-[44px] sm:shadow-[0_30px_70px_rgba(51,63,72,0.18),0_0_0_1px_rgba(51,63,72,0.10)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
