// Service worker for Ranger Sage's Treasure Hunt.
// Strategy: cache-first for shell + assets, network-first for HTML (so deploys propagate).
// Bump CACHE_VERSION whenever the shell file list changes.

const CACHE_VERSION = "sage-v1";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./qr-scanner.js",
  "./jsQR.min.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./assets/camp-map_rotated.png",
  "./assets/sage_welcoming.png",
  "./assets/sage_arms-open.png",
  "./assets/sage_pointing.png",
  "./assets/sage_pointing-reverse.png",
  "./assets/sage_pointing-with-sign.png",
  "./assets/sage_circle-look-around.png",
  "./assets/sage_leaning.png",
  "./assets/sage_question-mark.png",
  "./assets/stickers/sticker_silver-dump-truck.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isHTML = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    // Network-first for navigations so new deploys show up
    event.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req).then(c => c || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        if (resp.ok && url.origin === self.location.origin) {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        }
        return resp;
      });
    })
  );
});
