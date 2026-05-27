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
};

export function PhoneShell({ children, className = "" }: PhoneShellProps) {
  return (
    <div className="min-h-full flex items-center justify-center bg-bg sm:p-6">
      <div
        className={[
          "relative w-full bg-bg text-ink overflow-hidden flex flex-col",
          // Phone-sized viewport → full screen.
          "min-h-screen",
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
