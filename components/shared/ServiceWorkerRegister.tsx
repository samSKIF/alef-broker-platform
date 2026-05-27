"use client";

import { useEffect } from "react";

// Registers /sw.js once per page load. Renders nothing — the whole purpose
// is the side effect inside useEffect. Mounted from the root layout so
// every route triggers the SW lifecycle.
//
// We guard on `navigator.serviceWorker` existing (older browsers + tests)
// and bail silently on failures — a broken SW must not break the page.
// PRD §11 only asks for an installable PWA with an offline shell; the SW
// itself is in public/sw.js.

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Intentionally swallowed — see comment above.
    });
  }, []);

  return null;
}
