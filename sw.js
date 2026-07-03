// Service worker for Ranger Sage's Treasure Hunt.
//
// Two caches, two strategies:
//  - SHELL (HTML/JS/CSS/images/fonts): stale-while-revalidate. The cached copy
//    is served instantly (no hanging on one bar of LTE) and a background fetch
//    refreshes it for next time. Deploys propagate on the *next* load.
//  - AUDIO (narration MP3s): cache-first, stored as full responses. Media
//    elements request byte ranges; we answer Range requests by slicing the
//    cached full body, because the Cache API cannot store 206 responses.

const SHELL_CACHE = "sage-shell-v4";
const AUDIO_CACHE = "sage-audio-v1";

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
  "./fonts/fonts.css",
  "./fonts/fredoka-500.woff2",
  "./fonts/fredoka-600.woff2",
  "./fonts/fredoka-700.woff2",
  "./fonts/nunito-400.woff2",
  "./fonts/nunito-600.woff2",
  "./fonts/nunito-700.woff2",
  "./fonts/nunito-800.woff2",
  "./fonts/patrickhand-400.woff2",
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
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      // If precache fails (e.g. mid-deploy 404), let install fail so the
      // browser retries on the next visit instead of running half-cached.
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([SHELL_CACHE, AUDIO_CACHE]);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !keep.has(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes("/audio/")) {
    event.respondWith(serveAudio(req, url));
  } else {
    event.respondWith(staleWhileRevalidate(event, req, url));
  }
});

async function staleWhileRevalidate(event, req, url) {
  const cache = await caches.open(SHELL_CACHE);
  const stripped = url.origin + url.pathname; // "app.js?v=x" caches as "app.js"
  const cached = await cache.match(stripped);

  // "no-cache" makes the refresh revalidate with the server instead of
  // silently re-reading the browser's own HTTP cache (which can be stale).
  const network = fetch(req.url, { cache: "no-cache" }).then(resp => {
    if (resp && resp.ok && resp.status === 200) {
      return cache.put(stripped, resp.clone()).catch(() => {}).then(() => resp);
    }
    return resp;
  }).catch(() => null);

  // Keep the worker alive until the background refresh lands — without this
  // the browser may kill the SW right after the cached response is returned,
  // and deploys would propagate only sometimes.
  event.waitUntil(network);

  if (cached) return cached;

  const resp = await network;
  if (resp) return resp;
  if (req.mode === "navigate") {
    const shell = await cache.match(url.origin + "/index.html") || await cache.match("./index.html");
    if (shell) return shell;
  }
  return Response.error();
}

async function serveAudio(req, url) {
  const cache = await caches.open(AUDIO_CACHE);
  const key = url.origin + url.pathname;
  let full = await cache.match(key);

  if (!full) {
    // Fetch the WHOLE file (no Range header) so the Cache API accepts it.
    let resp;
    try {
      resp = await fetch(key);
    } catch (e) {
      return Response.error();
    }
    if (!resp.ok || resp.status !== 200) return resp;
    await cache.put(key, resp.clone()).catch(() => {});
    full = resp;
  }

  const range = req.headers.get("range");
  if (!range) return full.clone ? full.clone() : full;

  const buf = await full.clone().arrayBuffer();
  const m = /bytes=(\d+)-(\d*)/.exec(range);
  if (!m) return new Response(buf, { status: 200, headers: baseAudioHeaders(buf.byteLength) });
  const start = Number(m[1]);
  const end = m[2] ? Math.min(Number(m[2]), buf.byteLength - 1) : buf.byteLength - 1;
  if (start >= buf.byteLength) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${buf.byteLength}` }
    });
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      ...baseAudioHeaders(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${buf.byteLength}`
    }
  });
}

function baseAudioHeaders(len) {
  return {
    "Content-Type": "audio/mpeg",
    "Content-Length": String(len),
    "Accept-Ranges": "bytes"
  };
}
