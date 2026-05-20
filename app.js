/* ============================================================
   Ranger Sage's Treasure Hunt — prototype app logic
   Vanilla JS, no build step. State in localStorage.
   ============================================================ */

const STORAGE_KEY = "sage-completed";
const STATE = {
  completed: new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")),
  audioInterval: null,
  audioElapsed: 0,
  audioDuration: 14, // seconds (demo mode — short for board demo)
  fakeTotalSeconds: 108, // what we *display* as the "real" length (1:48)
};

const app = () => document.getElementById("app");
const toastHost = () => document.getElementById("toast-host");
const confettiHost = () => document.getElementById("confetti-host");

/* ---------- Persistence ---------- */
function saveCompleted() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...STATE.completed]));
}
function resetProgress() {
  STATE.completed.clear();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("sage-prize-code");
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
  stopFakeAudio();
  const r = currentRoute();
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
  route();
  wireMenu();
});

/* ---------- Menu ---------- */
function wireMenu() {
  const btn = document.getElementById("menu-btn");
  const panel = document.getElementById("menu-panel");
  btn.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
  });
  panel.addEventListener("click", e => {
    const action = e.target.dataset.action;
    if (!action) return;
    panel.hidden = true;
    if (action === "map") nav("map");
    if (action === "close") { /* already closed */ }
    if (action === "reset") {
      resetProgress();
      nav("welcome");
      route();
    }
  });
}

/* ---------- Helpers ---------- */
function isComplete(id) {
  return STATE.completed.has(typeof id === "number" ? id : String(id));
}
function markComplete(id) {
  STATE.completed.add(typeof id === "number" ? id : String(id));
  saveCompleted();
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

// A static fake QR pattern (good enough for board demo)
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
  // Three big corner markers
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

function devSkipButtonHtml() {
  return `<button class="demo-skip" onclick="skipAudio()">DEMO ⏩</button>`;
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
        <p class="welcome-helper">${isReturning ? `You've found ${STATE.completed.size} of ${TOTAL_STOPS} so far.` : "Tap a stop on the map &mdash; or scan a sign around camp."}</p>
      </div>
    </section>
  `;
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
    const stopDone = stop.hasSubStops ? commonsAllDone() : isComplete(stop.id);
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
      if (done === total) {
        statusHtml = `<span class="row-check">${checkmarkStampSvg()}</span>`;
        rowClass = "complete";
      } else {
        statusHtml = `<span class="commons-progress">${done} / ${total} inside</span>`;
      }
    } else {
      target = `scan/${stop.id}`;
      if (isComplete(stop.id)) {
        statusHtml = `<span class="row-check">${checkmarkStampSvg()}</span>`;
        rowClass = "complete";
      } else {
        statusHtml = `<span class="row-empty" aria-hidden="true"></span>`;
      }
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
  const allDone = STATE.completed.size === TOTAL_STOPS;

  app().innerHTML = `
    <section class="screen map">
      <div class="progress-strip">
        <div class="progress-count">
          <span>Your hunt</span>
          <span>${STATE.completed.size} / ${TOTAL_STOPS}</span>
        </div>
        <div class="progress-tally">${tally}</div>
      </div>

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
          <div class="clipboard-header">Tap a stop to begin</div>
          ${rows}
        </div>
      </div>

      ${allDone ? `<p class="map-footer-tip"><a href="#done" style="color:var(--pop);">All found! Get your prize &rarr;</a></p>` : ""}
    </section>
  `;

  if (allDone) setTimeout(() => nav("done"), 1500);
}

function buildTally(count, total) {
  let out = "";
  for (let i = 0; i < total; i++) {
    out += i < count
      ? `<span class="star">★</span>`
      : `<span style="color:var(--wood-light); opacity:0.4;">★</span>`;
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
    return `
      <button class="clipboard-row ${complete ? "complete" : ""}" onclick="nav('scan/${stop.id}')">
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
        <button class="btn btn-link demo-skip" onclick="simulateScan('${stop.id}')">
          DEMO ⏩ Skip scan
        </button>
        <p class="scan-helper">Look for a sign like this around camp, then tap to scan.</p>
      </div>
    </section>
  `;
}

function startScan(expectedStopId) {
  // Try the real camera scanner first; fall back to simulated if unsupported.
  if (typeof openQrScanner !== "function") {
    simulateScan(expectedStopId);
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
      simulateScan(expectedStopId);
    }
  });
}

function simulateScan(stopId) {
  // Show a brief viewfinder overlay, then navigate to the stop page.
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

  setTimeout(() => {
    overlay.classList.add("found");
    overlay.querySelector(".scan-label").textContent = "Got it!";
  }, 1100);

  setTimeout(() => {
    overlay.remove();
    nav(`stop/${stopId}`);
  }, 1700);
}

function renderStop(id) {
  const stop = ALL_STOPS.find(s => String(s.id) === String(id));
  if (!stop) { nav("map"); return; }

  const stickerImg = CLUE_STICKERS[stop.clueSticker];
  const stickerHtml = stickerImg
    ? `<img class="clue-sticker-img" src="${stickerImg}" alt="${escapeHtml(stop.clueSticker)}">`
    : `<div class="clue-sticker-placeholder">${escapeHtml(stop.clueSticker)} sticker</div>`;

  const backTarget = typeof stop.id === "string" && stop.id.startsWith("commons") ? "commons" : "map";

  app().innerHTML = `
    <section class="screen stop">
      <div class="stop-header">
        <button class="back-btn" onclick="nav('${backTarget}')">← ${backTarget === "commons" ? "Commons" : "Map"}</button>
        <span class="stop-num-tag">Stop ${stop.num}</span>
      </div>
      <h2 class="stop-title">${escapeHtml(stop.name)}</h2>
      <div class="stop-intro">"${escapeHtml(stop.sageIntro)}" &mdash; <em>Sage</em></div>

      <div class="audio-player">
        ${devSkipButtonHtml()}
        <button class="play-btn" id="play-btn" aria-label="Play"></button>
        <div class="audio-bar">
          <div class="audio-progress-track">
            <div class="audio-progress-fill" id="audio-fill"></div>
          </div>
          <div class="audio-time">
            <span id="audio-elapsed">0:00</span>
            <span id="audio-total">${formatTime(STATE.fakeTotalSeconds)}</span>
          </div>
        </div>
      </div>

      <div class="transcript">
        <div class="eyebrow">Transcript</div>
        <p>${escapeHtml(stop.transcript)}</p>
      </div>

      <div class="clue-card">
        <div class="clue-tape"></div>
        <div class="clue-eyebrow">🔍 Bonus Hunt</div>
        <p class="clue-text">${escapeHtml(stop.clue)}</p>
        ${stickerHtml}
      </div>

      <img class="sage-stop" src="${POSE_IMAGES[stop.pose] || POSE_IMAGES["pointing"]}" alt="">
    </section>
  `;

  document.getElementById("play-btn").addEventListener("click", togglePlay);
  // Auto-start audio for demo
  setTimeout(() => togglePlay(), 250);
}

function renderDone() {
  const code = generatePrizeCode();
  app().innerHTML = `
    <section class="screen done">
      <div class="eyebrow done-eyebrow">You finished the hunt!</div>
      <h1 class="done-title">YOU DID IT!</h1>
      <img class="done-sage" src="${POSE_IMAGES["arms-open"]}" alt="Sage celebrating">
      <p class="done-sub">All 26 stops explored. Take this screen to a counselor at the Family Commons for your prize.</p>
      <div class="prize-code">
        <div class="label">Tour Pass</div>
        <div class="code">${code}</div>
      </div>
      <a href="#welcome" class="start-over" onclick="resetProgress()">Start over &nbsp;↻</a>
    </section>
  `;
  setTimeout(() => burstConfetti(60), 200);
}

/* ============================================================
   FAKE AUDIO PLAYER
   ============================================================ */
function togglePlay() {
  if (STATE.audioInterval) {
    stopFakeAudio();
    document.getElementById("play-btn")?.classList.remove("playing");
    return;
  }
  document.getElementById("play-btn")?.classList.add("playing");
  startFakeAudio();
}

function startFakeAudio() {
  STATE.audioElapsed = 0;
  updateAudioUi();
  STATE.audioInterval = setInterval(() => {
    STATE.audioElapsed += 0.1;
    updateAudioUi();
    if (STATE.audioElapsed >= STATE.audioDuration) {
      stopFakeAudio();
      onAudioComplete();
    }
  }, 100);
}

function stopFakeAudio() {
  if (STATE.audioInterval) clearInterval(STATE.audioInterval);
  STATE.audioInterval = null;
}

function updateAudioUi() {
  const pct = Math.min(100, (STATE.audioElapsed / STATE.audioDuration) * 100);
  const fill = document.getElementById("audio-fill");
  const elapsed = document.getElementById("audio-elapsed");
  if (fill) fill.style.width = pct + "%";
  if (elapsed) {
    // Map the fake elapsed (0..audioDuration) onto the display total (0..fakeTotalSeconds)
    const display = Math.floor((STATE.audioElapsed / STATE.audioDuration) * STATE.fakeTotalSeconds);
    elapsed.textContent = formatTime(display);
  }
}

function skipAudio() {
  STATE.audioElapsed = STATE.audioDuration;
  updateAudioUi();
  stopFakeAudio();
  onAudioComplete();
}

function onAudioComplete() {
  const r = currentRoute();
  if (!r.startsWith("stop/")) return;
  const raw = r.split("/")[1];
  const id = /^\d+$/.test(raw) ? parseInt(raw, 10) : raw;
  const stop = ALL_STOPS.find(s => String(s.id) === String(id));
  if (!stop) return;

  const wasAlreadyComplete = isComplete(stop.id);
  markComplete(stop.id);

  // Visual: paw stamp + toast + confetti
  triggerPawStamp();
  setTimeout(() => burstConfetti(28), 200);
  showToast(`Stop ${stop.num} complete! &nbsp;${STATE.completed.size} of ${TOTAL_STOPS} down.`);

  // Decide where to go next
  const allDone = STATE.completed.size === TOTAL_STOPS;
  setTimeout(() => {
    if (allDone) nav("done");
    else {
      const wasCommonsStop = typeof stop.id === "string" && stop.id.startsWith("commons");
      nav(wasCommonsStop ? "commons" : "map");
    }
  }, 2400);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ============================================================
   VISUAL EFFECTS
   ============================================================ */
function triggerPawStamp() {
  const overlay = document.createElement("div");
  overlay.className = "paw-stamp-overlay";
  overlay.innerHTML = `<div class="paw-stamp">${pawPrintSvg("var(--olive)")}</div>`;
  document.querySelector(".screen")?.appendChild(overlay);
  setTimeout(() => overlay.remove(), 1800);
}

function showToast(htmlMsg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = htmlMsg;
  toastHost().appendChild(t);
  setTimeout(() => t.remove(), 2700);
}

function burstConfetti(count = 30) {
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
