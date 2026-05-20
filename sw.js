// Service worker for Ranger Sage's Treasure Hunt.
// Strategy: network-first within scope, fall back to cache if offline.
// On install, pre-cache the shell so first offline visit works.

const CACHE_VERSION = "sage-v3";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./qr-scanner.js",
  "./jsQR.min.js",
  "./qrcode-generator.js",
  "./print-qr.html",
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
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Don't intercept cross-origin (fonts, etc)

  // Network-first: try the live response, fall back to cache when offline.
  // ignoreSearch so cached "app.js" matches "app.js?v=12345".
  event.respondWith(
    fetch(req).then(resp => {
      if (resp.ok) {
        const copy = resp.clone();
        // Cache under the URL stripped of any ?v= query for stable lookup.
        const stripped = new Request(url.origin + url.pathname);
        caches.open(CACHE_VERSION).then(c => c.put(stripped, copy)).catch(() => {});
      }
      return resp;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then(c =>
        c || (req.mode === "navigate" ? caches.match("./index.html") : Response.error())
      )
    )
  );
});
