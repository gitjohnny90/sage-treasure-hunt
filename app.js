/* ============================================================
   Ranger Sage's Treasure Hunt — app logic
   Vanilla JS, no build step. State in localStorage.
   Audio: one shared <audio> element; a stop completes when
   its narration finishes playing (the 'ended' event).
   ============================================================ */

const STORAGE_KEY = "sage-completed";
const DEMO_KEY = "sage-demo-mode";

function loadCompleted() {
  // Corrupted or foreign data in localStorage must never brick the app.
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(v) ? v : []);
  } catch (e) {
    return new Set();
  }
}

const STATE = {
  completed: loadCompleted(),
  timers: [],        // pending setTimeouts cleared on every route change
  audio: null,       // the shared Audio element
  audioStopId: null, // which stop the audio belongs to
};

const app = () => document.getElementById("app");
const toastHost = () => document.getElementById("toast-host");
const confettiHost = () => document.getElementById("confetti-host");

/* ---------- Persistence ---------- */
function saveCompleted() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...STATE.completed]));
  } catch (e) { /* storage full/blocked — keep in-memory progress */ }
}
function resetProgress() {
  STATE.completed.clear();
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("sage-prize-code");
  } catch (e) { /* ignore */ }
}

function isDemoMode() {
  try { return localStorage.getItem(DEMO_KEY) === "1"; } catch (e) { return false; }
}
function setDemoMode(on) {
  try {
    if (on) localStorage.setItem(DEMO_KEY, "1");
    else localStorage.removeItem(DEMO_KEY);
  } catch (e) { /* ignore */ }
  updateDemoBadge();
}

/* ---------- Timers (cleared on navigation) ---------- */
function later(fn, ms) {
  const t = setTimeout(fn, ms);
  STATE.timers.push(t);
  return t;
}
function clearTimers() {
  STATE.timers.forEach(clearTimeout);
  STATE.timers = [];
}

/* ---------- Routing (hash-based) ---------- */
function nav(hash) {
  window.location.hash = hash;
}
function currentRoute() {
  const h = window.location.hash.replace(/^#\/?/, "");
  return h || "welcome";
}
function route() {
  clearTimers();
  stopAudio();
  if (typeof closeQrScanner === "function") closeQrScanner();
  const r = currentRoute();
  if (r === "demo") {
    // Hidden staff/demo toggle: visiting #demo flips demo mode.
    const on = !isDemoMode();
    setDemoMode(on);
    showToast(on ? "Demo mode ON — skip buttons enabled." : "Demo mode off.");
    nav("welcome");
    return;
  }
  if (r === "welcome") return renderWelcome();
  if (r === "map") return renderMap();
  if (r === "commons") return renderCommons();
  if (r === "done") return renderDone();
  if (r.startsWith("stop/")) {
    const raw = r.split("/")[1];
    const id = /^\d+$/.test(raw) ? parseInt(raw, 10) : raw;
    return renderStop(id);
  }
  if (r.startsWith("scan/")) {
    const raw = r.split("/")[1];
    const id = /^\d+$/.test(raw) ? parseInt(raw, 10) : raw;
    return renderScanPrep(id);
  }
  renderWelcome();
}
window.addEventListener("hashchange", route);
window.addEventListener("load", () => {
  reconcileCommonsParent();
  route();
  wireMenu();
  updateDemoBadge();
});

/* If a family finished all six Commons rooms before this version,
   make sure the Family Commons parent stop is credited too. */
function reconcileCommonsParent() {
  if (commonsAllDone() && !isComplete(1)) {
    STATE.completed.add(1);
    saveCompleted();
  }
}

/* ---------- Menu ---------- */
function wireMenu() {
  const btn = document.getElementById("menu-btn");
  const panel = document.getElementById("menu-panel");
  btn.setAttribute("aria-expanded", "false");
  btn.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    btn.setAttribute("aria-expanded", String(!panel.hidden));
  });
  panel.addEventListener("click", e => {
    const action = e.target.dataset.action;
    if (!action) return;
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (action === "map") nav("map");
    if (action === "reset") {
      confirmDialog(
        "Start over?",
        "This erases all " + TOTAL_STOPS + " stops of progress on this phone. There's no undo.",
        "Erase & start over",
        () => {
          resetProgress();
          nav("welcome");
          route();
          showToast("Fresh clipboard. Happy hunting!");
        }
      );
    }
    if (action === "demo-off") {
      setDemoMode(false);
      showToast("Demo mode off.");
      route();
    }
  });
  refreshMenuItems();
}

function refreshMenuItems() {
  const panel = document.getElementById("menu-panel");
  const existing = panel.querySelector('[data-action="demo-off"]');
  if (isDemoMode() && !existing) {
    const b = document.createElement("button");
    b.className = "menu-item";
    b.dataset.action = "demo-off";
    b.textContent = "Demo mode: ON";
    panel.appendChild(b);
  } else if (!isDemoMode() && existing) {
    existing.remove();
  }
}

function updateDemoBadge() {
  let badge = document.getElementById("demo-badge");
  if (isDemoMode()) {
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "demo-badge";
      badge.textContent = "DEMO";
      document.getElementById("device-frame").appendChild(badge);
    }
  } else if (badge) {
    badge.remove();
  }
  const panel = document.getElementById("menu-panel");
  if (panel) refreshMenuItems();
}

/* ---------- Confirm dialog (in-app; never window.confirm) ---------- */
function confirmDialog(title, body, confirmLabel, onConfirm) {
  document.querySelector(".confirm-overlay")?.remove();
  const overlay = document.createElement("div");
  overlay.className = "confirm-overlay";
  overlay.innerHTML = `
    <div class="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      <h3 id="confirm-title">${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
      <div class="confirm-actions">
        <button class="btn btn-secondary" data-confirm="no">Cancel</button>
        <button class="btn btn-danger" data-confirm="yes">${escapeHtml(confirmLabel)}</button>
      </div>
    </div>
  `;
  overlay.addEventListener("click", e => {
    const v = e.target.dataset.confirm;
    if (v === "yes") { overlay.remove(); onConfirm(); }
    else if (v === "no" || e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
  overlay.querySelector('[data-confirm="no"]').focus();
}

/* ---------- Helpers ---------- */
function isComplete(id) {
  return STATE.completed.has(typeof id === "number" ? id : String(id));
}
function markComplete(id) {
  STATE.completed.add(typeof id === "number" ? id : String(id));
  saveCompleted();
}
function allStopsDone() {
  return STATE.completed.size >= TOTAL_STOPS;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

/* ---------- Inline SVG helpers ---------- */
function pawPrintSvg(color = "var(--olive)") {
  return `
    <svg class="paw-svg" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="${color}" stroke="var(--olive-deep)" stroke-width="3">
        <ellipse cx="50" cy="72" rx="28" ry="24"/>
        <ellipse cx="22" cy="35" rx="11" ry="14"/>
        <ellipse cx="50" cy="22" rx="11" ry="14"/>
        <ellipse cx="78" cy="35" rx="11" ry="14"/>
      </g>
    </svg>`;
}

function pushpinSvg() {
  return `
    <svg viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="14" cy="32" rx="6" ry="2" fill="rgba(0,0,0,0.25)"/>
      <path d="M 14 14 L 12 30 L 16 30 Z" fill="#7A2515"/>
      <circle cx="14" cy="12" r="10" fill="#C24A2C" stroke="#7A2515" stroke-width="2"/>
      <ellipse cx="11" cy="9" rx="3" ry="2.5" fill="#E68E7E" opacity="0.75"/>
    </svg>
  `;
}

function checkmarkStampSvg() {
  return `
    <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M 6 27 Q 13 31 20 41 Q 26 18 44 8"
            fill="none"
            stroke="currentColor"
            stroke-width="7"
            stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
  `;
}

/* Clue "what to look for" icons — one per sticker type. */
function clueIconSvg(kind) {
  const wrap = inner => `
    <svg class="clue-icon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${kind} sticker">
      <circle cx="50" cy="50" r="46" fill="#FBF3DF" stroke="var(--wood)" stroke-width="4"/>
      ${inner}
    </svg>`;
  if (kind === "paw-print") return wrap(`
      <g fill="var(--olive-deep)">
        <ellipse cx="50" cy="62" rx="17" ry="14"/>
        <ellipse cx="32" cy="40" rx="7" ry="9" transform="rotate(-15 32 40)"/>
        <ellipse cx="50" cy="33" rx="7" ry="9"/>
        <ellipse cx="68" cy="40" rx="7" ry="9" transform="rotate(15 68 40)"/>
      </g>`);
  if (kind === "dove") return wrap(`
      <g fill="#FFFFFF" stroke="var(--wood)" stroke-width="3" stroke-linejoin="round">
        <path d="M 30 58 Q 26 42 40 36 Q 52 31 58 40 L 74 34 Q 66 46 58 50 Q 60 62 48 66 Q 36 69 30 58 Z"/>
        <path d="M 44 48 Q 34 40 24 44 Q 32 52 42 53 Z"/>
      </g>
      <circle cx="61" cy="41" r="1.8" fill="var(--wood)"/>
      <path d="M 66 39 L 73 37" stroke="var(--mustard-deep)" stroke-width="3" stroke-linecap="round"/>`);
  if (kind === "compass") return wrap(`
      <circle cx="50" cy="50" r="26" fill="#FFFFFF" stroke="var(--wood)" stroke-width="4"/>
      <path d="M 50 30 L 57 50 L 50 70 L 43 50 Z" fill="var(--pop)"/>
      <path d="M 50 30 L 57 50 L 43 50 Z" fill="var(--olive-deep)"/>
      <circle cx="50" cy="50" r="4" fill="var(--mustard)" stroke="var(--wood)" stroke-width="2"/>`);
  if (kind === "leaf") return wrap(`
      <path d="M 50 24 Q 74 40 68 62 Q 63 78 50 78 Q 37 78 32 62 Q 26 40 50 24 Z"
            fill="var(--sage-green)" stroke="var(--olive-deep)" stroke-width="4" stroke-linejoin="round"/>
      <path d="M 50 32 L 50 76 M 50 46 L 61 42 M 50 46 L 39 42 M 50 60 L 63 55 M 50 60 L 37 55"
            stroke="var(--olive-deep)" stroke-width="3" stroke-linecap="round" fill="none"/>`);
  return wrap(`<circle cx="50" cy="50" r="20" fill="var(--mustard)"/>`);
}

// A static fake QR pattern (sign illustration only — not scannable)
function fakeQrSvg() {
  const cells = [
    "1110011110011001010",
    "1000010100110110101",
    "1011101011001010011",
    "1011101100101101100",
    "1011101010100001010",
    "1000010110011010111",
    "1111111010101010101",
    "0000000110110011001",
    "1101011010101101010",
    "0110101001010011100",
    "1011011101101010110",
    "1101010010001101011",
    "0010110101110001010",
    "0000000101101010110",
    "1111111011010101001",
    "1000001100101010111",
    "1011101010110101010",
    "1011101101010001101",
    "1011101010101010100"
  ];
  let rects = "";
  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[y].length; x++) {
      if (cells[y][x] === "1") {
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="#1a1a1a"/>`;
      }
    }
  }
  const corner = (cx, cy) => `
    <rect x="${cx}" y="${cy}" width="7" height="7" fill="#1a1a1a"/>
    <rect x="${cx+1}" y="${cy+1}" width="5" height="5" fill="#FAF0DC"/>
    <rect x="${cx+2}" y="${cy+2}" width="3" height="3" fill="#1a1a1a"/>
  `;
  return `
    <svg viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"
         style="background:#FAF0DC; shape-rendering:crispEdges;">
      ${rects}
      ${corner(0, 0)}
      ${corner(12, 0)}
      ${corner(0, 12)}
    </svg>
  `;
}

/* ============================================================
   SCREEN RENDERERS
   ============================================================ */

function renderWelcome() {
  const isReturning = STATE.completed.size > 0;
  app().innerHTML = `
    <section class="screen welcome">
      <div>
        <div class="eyebrow welcome-eyebrow">Camp Gunnison&mdash;The Way Family Ranch&trade;</div>
        <h1 class="welcome-title">
          <span class="ranger-sage">Ranger Sage's</span>
          Treasure Hunt
        </h1>
      </div>
      <div class="welcome-sage-wrap">
        <img class="welcome-sage" src="${POSE_IMAGES["welcoming"]}" alt="Ranger Sage waving">
        <span class="welcome-bubble-text">WELCOME!</span>
        <span class="welcome-sign-text">CAMP<br>GUNNISON</span>
      </div>
      <p class="welcome-pitch">
        Find all the spots around camp,<br>
        listen to Sage's stories,<br>
        hunt for stickers, win a prize!
      </p>
      <div class="welcome-cta">
        <button class="btn btn-primary" onclick="nav('map')">
          ${isReturning ? "Keep Exploring" : "Start the Hunt"}
        </button>
        <p class="welcome-helper">${isReturning ? `You've found ${STATE.completed.size} of ${TOTAL_STOPS} so far.` : "Tap a stop on the list &mdash; or scan a sign around camp."}</p>
        <button class="btn-link download-hunt" id="download-hunt-btn" onclick="downloadHunt()">
          &#11015;&#65039; Save Sage's stories for offline
        </button>
        <p class="download-status" id="download-status" role="status"></p>
      </div>
    </section>
  `;
  updateDownloadButton();
}

function commonsCompletedCount() {
  return COMMONS_STOPS.filter(s => isComplete(s.id)).length;
}
function commonsAllDone() {
  return commonsCompletedCount() === COMMONS_STOPS.length;
}

function renderMap() {
  // Display-only check stamps at completed locations on the map (no clickable pins).
  const stamps = OUTDOOR_STOPS.map(stop => {
    const stopDone = isComplete(stop.id);
    if (!stopDone) return "";
    return `
      <span class="map-check-stamp"
            style="left:${stop.mapX}%; top:${stop.mapY}%;"
            aria-hidden="true">${checkmarkStampSvg()}</span>
    `;
  }).join("");

  // Clipboard rows for the 20 outdoor stops
  const rows = OUTDOOR_STOPS.map(stop => {
    let statusHtml;
    let target;
    let rowClass = "";

    if (stop.hasSubStops) {
      const done = commonsCompletedCount();
      const total = COMMONS_STOPS.length;
      target = "commons";
      if (isComplete(stop.id)) {
        statusHtml = `<span class="row-check">${checkmarkStampSvg()}</span>`;
        rowClass = "complete";
      } else {
        statusHtml = `<span class="commons-progress">${done} / ${total} inside</span>`;
      }
    } else if (isComplete(stop.id)) {
      // Completed stops reopen the story directly — no need to re-scan.
      target = `stop/${stop.id}`;
      statusHtml = `<span class="row-check">${checkmarkStampSvg()}</span>`;
      rowClass = "complete";
    } else {
      target = `scan/${stop.id}`;
      statusHtml = `<span class="row-empty" aria-hidden="true"></span>`;
    }

    return `
      <button class="clipboard-row ${rowClass}" onclick="nav('${target}')">
        <span class="row-num">${stop.num}</span>
        <span class="row-name">${escapeHtml(stop.name)}</span>
        ${statusHtml}
      </button>
    `;
  }).join("");

  const tally = buildTally(STATE.completed.size, TOTAL_STOPS);
  const allDone = allStopsDone();

  app().innerHTML = `
    <section class="screen map">
      <div class="progress-strip">
        <div class="progress-count">
          <span>Your hunt</span>
          <span>${STATE.completed.size} / ${TOTAL_STOPS}</span>
        </div>
        <div class="progress-tally">${tally}</div>
      </div>

      ${allDone ? `
        <button class="btn btn-primary prize-banner" onclick="nav('done')">
          &#127881; All ${TOTAL_STOPS} found &mdash; claim your prize!
        </button>` : ""}

      <div class="map-canvas">
        <div class="map-tilted">
          <div class="map-pushpin">${pushpinSvg()}</div>
          <img class="map-img" src="assets/camp-map_rotated.png" alt="Camp Gunnison map">
          <div class="map-stamp-overlay">${stamps}</div>
        </div>
      </div>

      <div class="clipboard">
        <div class="clipboard-clip"></div>
        <div class="clipboard-paper">
          <div class="clipboard-header">${allDone ? "Tap any stop to hear it again" : "Tap a stop to begin"}</div>
          ${rows}
        </div>
      </div>
    </section>
  `;
}

function buildTally(count, total) {
  let out = "";
  for (let i = 0; i < total; i++) {
    out += i < count
      ? `<span class="star">★</span>`
      : `<span class="star-empty">★</span>`;
    if ((i + 1) % 5 === 0 && i < total - 1) out += " ";
  }
  return out;
}

function renderCommons() {
  const rows = COMMONS_STOPS.map(stop => {
    const complete = isComplete(stop.id);
    const statusHtml = complete
      ? `<span class="row-check">${checkmarkStampSvg()}</span>`
      : `<span class="row-empty" aria-hidden="true"></span>`;
    const target = complete ? `stop/${stop.id}` : `scan/${stop.id}`;
    return `
      <button class="clipboard-row ${complete ? "complete" : ""}" onclick="nav('${target}')">
        <span class="row-num">${stop.num}</span>
        <span class="row-name">${escapeHtml(stop.name)}</span>
        ${statusHtml}
      </button>
    `;
  }).join("");

  const doneCount = commonsCompletedCount();
  const total = COMMONS_STOPS.length;

  app().innerHTML = `
    <section class="screen commons">
      <div class="stop-header">
        <button class="back-btn" onclick="nav('map')">← Map</button>
        <span class="stop-num-tag">Stop 1 · Inside</span>
      </div>
      <h2 class="commons-title">The Family Commons</h2>
      <p class="commons-sub">${doneCount} of ${total} explored. Take your time.</p>
      <div class="clipboard inset">
        <div class="clipboard-paper">
          ${rows}
        </div>
      </div>
    </section>
  `;
}

function renderScanPrep(id) {
  const stop = ALL_STOPS.find(s => String(s.id) === String(id));
  if (!stop) { nav("map"); return; }
  const backTarget = typeof stop.id === "string" && stop.id.startsWith("commons") ? "commons" : "map";
  const sageImg = POSE_IMAGES[stop.pose] || POSE_IMAGES["pointing"];

  app().innerHTML = `
    <section class="screen scan-prep">
      <div class="stop-header">
        <button class="back-btn" onclick="nav('${backTarget}')">← ${backTarget === "commons" ? "Commons" : "Map"}</button>
        <span class="stop-num-tag">Stop ${stop.num}</span>
      </div>
      <h2 class="scan-prep-title">Find this QR sign at</h2>
      <p class="scan-prep-location">${escapeHtml(stop.name)}</p>

      <div class="qr-sign-mockup">
        <div class="sign-post"></div>
        <div class="sign-board">
          <div class="sign-banner">RANGER SAGE</div>
          <img class="sign-sage" src="${sageImg}" alt="">
          <div class="sign-name-plaque">${escapeHtml(stop.name)}</div>
          <div class="sign-qr">${fakeQrSvg()}</div>
          <div class="sign-scan-hint">Scan me!</div>
        </div>
      </div>

      <div class="scan-cta-row">
        <button class="btn btn-primary scan-cta" onclick="startScan('${stop.id}')">
          <span class="cam-icon">📷</span> Scan QR Code
        </button>
        ${isDemoMode() ? `
        <button class="btn-link scan-skip" onclick="demoSkipScan('${stop.id}')">
          DEMO ⏩ Skip scan
        </button>` : ""}
        <p class="scan-helper">Look for a sign like this around camp, then tap to scan.</p>
        <p class="scan-helper scan-camera-note" id="scan-camera-note" hidden></p>
      </div>
    </section>
  `;
}

function startScan(expectedStopId) {
  if (typeof openQrScanner !== "function") {
    cameraUnavailable();
    return;
  }
  openQrScanner(expectedStopId, {
    onSuccess: (scannedId, isExpected) => {
      // Whether it matched the expected stop or a different one, navigate to whatever was scanned.
      // Real users can find signs in any order, so we honor the scanned ID.
      nav(`stop/${scannedId}`);
    },
    onCancel: () => {
      // user backed out — stay on the pre-scan page
    },
    onUnsupported: () => {
      cameraUnavailable();
    }
  });
}

function cameraUnavailable() {
  const note = document.getElementById("scan-camera-note");
  if (note) {
    note.hidden = false;
    note.innerHTML = `Sage can't see through your camera right now. Check that camera
      access is allowed for this site &mdash; or scan the sign with your phone's own
      camera app instead. It opens the same story!`;
  } else {
    showToast("Camera unavailable — try your phone's camera app on the sign.");
  }
}

/* Demo-mode-only: pretend a sign was scanned (for indoor demonstrations). */
function demoSkipScan(stopId) {
  if (!isDemoMode()) return;
  const overlay = document.createElement("div");
  overlay.className = "scan-overlay";
  overlay.innerHTML = `
    <div class="scan-viewfinder">
      <span class="vf-corner tl"></span>
      <span class="vf-corner tr"></span>
      <span class="vf-corner bl"></span>
      <span class="vf-corner br"></span>
      <div class="vf-scanline"></div>
    </div>
    <div class="scan-label">Scanning&hellip;</div>
  `;
  document.body.appendChild(overlay);

  later(() => {
    overlay.classList.add("found");
    overlay.querySelector(".scan-label").textContent = "Got it!";
  }, 1100);

  later(() => {
    overlay.remove();
    nav(`stop/${stopId}`);
  }, 1700);
}

/* ============================================================
   STOP PAGE + REAL AUDIO PLAYER
   ============================================================ */

function renderStop(id) {
  const stop = ALL_STOPS.find(s => String(s.id) === String(id));
  if (!stop) { nav("map"); return; }
  // The Family Commons parent is a hub, not a listening stop.
  if (stop.hasSubStops) { nav("commons"); return; }

  const alreadyDone = isComplete(stop.id);
  const backTarget = typeof stop.id === "string" && stop.id.startsWith("commons") ? "commons" : "map";

  const stickerImg = CLUE_STICKERS[stop.clueSticker];
  const stickerHtml = stickerImg
    ? `<img class="clue-sticker-img" src="${stickerImg}" alt="${escapeHtml(stop.clueSticker)} sticker">`
    : clueIconSvg(stop.clueSticker);

  const hasAudio = Boolean(stop.audio);
  const totalSecs = stop.audioDuration || 0;

  const playerHtml = hasAudio ? `
      <div class="audio-player" data-stop="${stop.id}">
        ${isDemoMode() ? `<button class="demo-skip" onclick="demoSkipAudio()">DEMO ⏩</button>` : ""}
        <button class="play-btn" id="play-btn" aria-label="Play Sage's story" aria-pressed="false"></button>
        <div class="audio-bar">
          <input type="range" class="audio-seek" id="audio-seek" min="0" max="${totalSecs}" step="0.1" value="0"
                 aria-label="Story position">
          <div class="audio-time">
            <span id="audio-elapsed">0:00</span>
            <span id="audio-total">${formatTime(totalSecs)}</span>
          </div>
        </div>
      </div>
      <p class="audio-hint" id="audio-hint">${alreadyDone
        ? "Play it again any time."
        : "Listen to the whole story to check off this stop."}</p>
      <p class="audio-error" id="audio-error" hidden></p>
  ` : `
      <div class="no-audio-card">
        <p>Sage's recording for this stop is still on its way.
           Read the story below, then check it off.</p>
        ${alreadyDone ? "" : `
        <button class="btn btn-primary" onclick="completeCurrentStop()">
          I read it &mdash; check it off!
        </button>`}
      </div>
  `;

  app().innerHTML = `
    <section class="screen stop">
      <div class="stop-header">
        <button class="back-btn" onclick="nav('${backTarget}')">← ${backTarget === "commons" ? "Commons" : "Map"}</button>
        <span class="stop-num-tag">Stop ${stop.num}${alreadyDone ? " ✓" : ""}</span>
      </div>
      <h2 class="stop-title">${escapeHtml(stop.name)}</h2>
      <div class="stop-intro">"${escapeHtml(stop.sageIntro)}" &mdash; <em>Sage</em></div>

      ${playerHtml}

      <div class="transcript">
        <div class="eyebrow">Story</div>
        <p>${escapeHtml(stop.transcript)}</p>
      </div>

      ${stop.stickerHunt ? `
      <div class="clue-card">
        <div class="clue-tape"></div>
        <div class="clue-eyebrow">🔍 Sticker Hunt</div>
        <p class="clue-text">Hidden near this stop is a small clear box with your sticker inside.
          Sage's first hint is a verse — figure out what it's pointing to!</p>
        <button class="btn btn-secondary hint-btn" id="hint1-btn" onclick="revealHint(1)">
          Hint 1: A verse to ponder
        </button>
        <div id="hint1-body" hidden>
          <blockquote class="hint-scripture">
            ${escapeHtml(stop.stickerHunt.scriptureText)}
            <cite>&mdash; ${escapeHtml(stop.stickerHunt.scriptureRef)}</cite>
          </blockquote>
          <button class="btn btn-secondary hint-btn" id="hint2-btn" onclick="revealHint(2)">
            Still hunting? Hint 2
          </button>
          <p class="hint-obvious" id="hint2-body" hidden>${escapeHtml(stop.stickerHunt.obviousHint)}</p>
        </div>
        ${stickerHtml}
      </div>` : `
      <div class="clue-card">
        <div class="clue-tape"></div>
        <div class="clue-eyebrow">🔍 Bonus Hunt</div>
        <p class="clue-text">${escapeHtml(stop.clue)}</p>
        ${stickerHtml}
      </div>`}

      <img class="sage-stop" src="${POSE_IMAGES[stop.pose] || POSE_IMAGES["pointing"]}" alt="">
    </section>
  `;

  if (hasAudio) setupAudioPlayer(stop);
}

function setupAudioPlayer(stop) {
  const playBtn = document.getElementById("play-btn");
  const seek = document.getElementById("audio-seek");
  const elapsedEl = document.getElementById("audio-elapsed");
  const totalEl = document.getElementById("audio-total");
  const errEl = document.getElementById("audio-error");

  const audio = new Audio();
  audio.src = stop.audio;
  audio.preload = "auto";
  STATE.audio = audio;
  STATE.audioStopId = stop.id;

  const setPlaying = playing => {
    playBtn.classList.toggle("playing", playing);
    playBtn.setAttribute("aria-pressed", String(playing));
    playBtn.setAttribute("aria-label", playing ? "Pause Sage's story" : "Play Sage's story");
  };

  audio.addEventListener("loadedmetadata", () => {
    if (isFinite(audio.duration) && audio.duration > 0) {
      seek.max = audio.duration;
      totalEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (!seekDragging) {
      seek.value = audio.currentTime;
      elapsedEl.textContent = formatTime(audio.currentTime);
      const pct = seek.max > 0 ? (audio.currentTime / seek.max) * 100 : 0;
      seek.style.setProperty("--fill", pct + "%");
    }
  });

  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));

  audio.addEventListener("ended", () => {
    setPlaying(false);
    completeCurrentStop();
  });

  audio.addEventListener("error", () => {
    if (errEl) {
      errEl.hidden = false;
      errEl.innerHTML = `Sage's voice couldn't load &mdash; the connection may be weak out here.
        Read the story below instead, then
        <button class="btn-link" onclick="completeCurrentStop()">check off this stop</button>.`;
    }
  });

  let seekDragging = false;
  seek.addEventListener("input", () => {
    seekDragging = true;
    elapsedEl.textContent = formatTime(Number(seek.value));
    const pct = seek.max > 0 ? (Number(seek.value) / seek.max) * 100 : 0;
    seek.style.setProperty("--fill", pct + "%");
  });
  seek.addEventListener("change", () => {
    audio.currentTime = Number(seek.value);
    seekDragging = false;
  });

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        if (errEl) {
          errEl.hidden = false;
          errEl.textContent = "Tap the play button again to start Sage's story.";
        }
      });
    } else {
      audio.pause();
    }
  });
}

function stopAudio() {
  if (STATE.audio) {
    try { STATE.audio.pause(); STATE.audio.src = ""; } catch (e) { /* ignore */ }
    STATE.audio = null;
    STATE.audioStopId = null;
  }
}

/* Demo-mode-only: jump to the end of the story. */
function demoSkipAudio() {
  if (!isDemoMode()) return;
  if (STATE.audio) { try { STATE.audio.pause(); } catch (e) {} }
  completeCurrentStop();
}

function completeCurrentStop() {
  const r = currentRoute();
  if (!r.startsWith("stop/")) return;
  const raw = r.split("/")[1];
  const id = /^\d+$/.test(raw) ? parseInt(raw, 10) : raw;
  const stop = ALL_STOPS.find(s => String(s.id) === String(id));
  if (!stop) return;

  const wasAlreadyComplete = isComplete(stop.id);
  markComplete(stop.id);

  // Finishing the last Commons room also completes the Family Commons itself.
  const wasCommonsStop = typeof stop.id === "string" && stop.id.startsWith("commons");
  let commonsJustFinished = false;
  if (wasCommonsStop && commonsAllDone() && !isComplete(1)) {
    markComplete(1);
    commonsJustFinished = true;
  }

  if (wasAlreadyComplete) return; // replay of a finished stop — no fanfare, no nav

  triggerPawStamp();
  later(() => burstConfetti(28), 200);
  showToast(commonsJustFinished
    ? `The whole Family Commons — done! ${STATE.completed.size} of ${TOTAL_STOPS}.`
    : `Stop ${stop.num} complete! &nbsp;${STATE.completed.size} of ${TOTAL_STOPS} down.`);

  // Offer the next step rather than yanking the family off the page.
  const nextWrap = document.createElement("div");
  nextWrap.className = "next-step-row";
  if (allStopsDone()) {
    nextWrap.innerHTML = `<button class="btn btn-primary" onclick="nav('done')">&#127881; Claim your prize!</button>`;
  } else if (wasCommonsStop && !commonsJustFinished) {
    nextWrap.innerHTML = `<button class="btn btn-primary" onclick="nav('commons')">Next room &rarr;</button>`;
  } else {
    nextWrap.innerHTML = `<button class="btn btn-primary" onclick="nav('map')">Back to the map &rarr;</button>`;
  }
  document.querySelector(".screen.stop")?.appendChild(nextWrap);
}

function renderDone() {
  // The prize screen is earned: every stop must actually be checked off.
  if (!allStopsDone()) { nav("map"); return; }
  const code = generatePrizeCode();
  app().innerHTML = `
    <section class="screen done">
      <div class="eyebrow done-eyebrow">You finished the hunt!</div>
      <h1 class="done-title">YOU DID IT!</h1>
      <img class="done-sage" src="${POSE_IMAGES["arms-open"]}" alt="Sage celebrating">
      <p class="done-sub">All ${TOTAL_STOPS} stops explored. Show this screen to a counselor
        at the Family Commons for your prize.</p>
      <div class="prize-code">
        <div class="label">Tour Pass &middot; ${STATE.completed.size}/${TOTAL_STOPS} stops</div>
        <div class="code">${code}</div>
      </div>
      <button class="start-over" onclick="confirmStartOver()">Start over &nbsp;↻</button>
    </section>
  `;
  later(() => burstConfetti(60), 200);
}

function confirmStartOver() {
  confirmDialog(
    "Start the hunt over?",
    "This erases all " + TOTAL_STOPS + " stops and your Tour Pass code on this phone. There's no undo.",
    "Erase & start over",
    () => {
      resetProgress();
      nav("welcome");
    }
  );
}

/* ============================================================
   OFFLINE STORY DOWNLOAD (best on the Commons WiFi)
   ============================================================ */
async function downloadHunt() {
  const status = document.getElementById("download-status");
  const btn = document.getElementById("download-hunt-btn");
  if (!("caches" in window)) {
    if (status) status.textContent = "This browser can't save stories for offline.";
    return;
  }
  const files = ALL_STOPS.filter(s => s.audio).map(s => s.audio);
  if (btn) btn.disabled = true;
  let done = 0, failed = 0;
  try {
    const cache = await caches.open("sage-audio-v1");
    for (const f of files) {
      try {
        const existing = await cache.match(f);
        if (!existing) {
          const resp = await fetch(f);
          if (resp.ok && resp.status === 200) await cache.put(f, resp);
          else { failed++; continue; }
        }
        done++;
        if (status) status.textContent = `Saving Sage's stories… ${done} of ${files.length}`;
      } catch (e) { failed++; }
    }
    if (status) {
      status.textContent = failed === 0
        ? `All ${done} stories saved! The hunt works anywhere at camp now.`
        : `${done} of ${files.length} stories saved — tap again on WiFi to finish.`;
    }
    try { localStorage.setItem("sage-audio-saved", failed === 0 ? "1" : ""); } catch (e) {}
  } finally {
    if (btn) btn.disabled = false;
    updateDownloadButton();
  }
}

async function updateDownloadButton() {
  const btn = document.getElementById("download-hunt-btn");
  const status = document.getElementById("download-status");
  if (!btn) return;
  if (!("caches" in window)) { btn.hidden = true; return; }
  try {
    const cache = await caches.open("sage-audio-v1");
    const files = ALL_STOPS.filter(s => s.audio).map(s => s.audio);
    let saved = 0;
    for (const f of files) {
      if (await cache.match(f)) saved++;
    }
    if (saved === files.length && files.length > 0) {
      btn.hidden = true;
      if (status) status.textContent = "Sage's stories are saved on this phone — the hunt works offline.";
    }
  } catch (e) { /* leave the button visible */ }
}

/* Sticker-hunt hints: reveal one tier at a time. */
function revealHint(n) {
  const btn = document.getElementById(`hint${n}-btn`);
  const body = document.getElementById(`hint${n}-body`);
  if (btn) btn.hidden = true;
  if (body) body.hidden = false;
}

/* ============================================================
   UTILITIES + VISUAL EFFECTS
   ============================================================ */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function triggerPawStamp() {
  const overlay = document.createElement("div");
  overlay.className = "paw-stamp-overlay";
  overlay.innerHTML = `<div class="paw-stamp">${pawPrintSvg("var(--olive)")}</div>`;
  document.querySelector(".screen")?.appendChild(overlay);
  later(() => overlay.remove(), 1800);
}

function showToast(htmlMsg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = htmlMsg;
  toastHost().appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function burstConfetti(count = 30) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host = confettiHost();
  const colors = ["#E8A93D", "#6B7A2F", "#C24A2C", "#9DAA5E", "#5C3A1E"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = (Math.random() * 0.4) + "s";
    p.style.animationDuration = (1.8 + Math.random() * 1.4) + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    host.appendChild(p);
    setTimeout(() => p.remove(), 3500);
  }
}
