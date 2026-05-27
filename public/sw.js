// Alef Broker Platform — minimal service worker for PRD §11 offline shell.
//
// Strategy is deliberately small for the POC:
//   1. On install: precache the /offline page.
//   2. On fetch: only intercept navigation requests (HTML pages). Try the
//      network first; if it fails (no signal, server down), serve the
//      cached /offline page instead of the browser's default error.
//   3. Static assets (JS, CSS, images, fonts) are NOT precached because
//      Next.js fingerprints them per build — listing them statically would
//      go stale immediately. The browser cache handles them well enough.
//
// Bumping VERSION invalidates the old cache; clients will pick up the
// new SW on next navigation and discard the stale precache.

const VERSION = "v1";
const STATIC_CACHE = `alef-static-${VERSION}`;
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.add(OFFLINE_URL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // We only care about top-level page navigations. Sub-resource requests
  // (chunks, API calls, images) fall through to the network as usual.
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request).catch(async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(OFFLINE_URL);
      return (
        cached ??
        new Response(
          "<h1>Offline</h1><p>Reconnect to continue.</p>",
          {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          },
        )
      );
    }),
  );
});
