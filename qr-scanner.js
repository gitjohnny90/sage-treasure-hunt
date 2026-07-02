// Real QR scanner wrapper around jsQR + getUserMedia.
// Exposes openQrScanner(expectedStopId, callbacks) and closeQrScanner() globally.
// Reports onUnsupported if no camera / permission denied so the caller can
// show an honest message (never a fake scan).

(function () {
  "use strict";

  const SCAN_INTERVAL_MS = 100;   // jsQR runs ~10x/sec
  const DECODE_MAX_WIDTH = 640;   // downscale frames; full 1080p decode saturates phone CPUs

  let activeCleanup = null;       // lets route changes force-close the scanner

  function parseStopIdFromText(text) {
    // Accept either a raw "#stop/7" / "stop/7" or a full URL containing one
    if (!text) return null;
    const m = String(text).match(/(?:#|\/)stop\/([A-Za-z0-9_-]+)/);
    return m ? m[1] : null;
  }

  function makeOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "scan-overlay live";
    overlay.innerHTML = `
      <video class="scan-video" autoplay playsinline muted></video>
      <div class="scan-vignette"></div>
      <div class="scan-viewfinder">
        <span class="vf-corner tl"></span>
        <span class="vf-corner tr"></span>
        <span class="vf-corner bl"></span>
        <span class="vf-corner br"></span>
        <div class="vf-scanline"></div>
      </div>
      <div class="scan-label">Point at the QR sign</div>
      <button class="scan-cancel" type="button" aria-label="Cancel">Cancel</button>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  async function openQrScanner(expectedStopId, opts) {
    opts = opts || {};
    const onSuccess = opts.onSuccess || function () {};
    const onCancel  = opts.onCancel  || function () {};

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof jsQR !== "function") {
      opts.onUnsupported && opts.onUnsupported();
      return;
    }

    // Only one scanner at a time.
    if (activeCleanup) activeCleanup();

    const overlay = makeOverlay();
    const video = overlay.querySelector(".scan-video");
    const cancelBtn = overlay.querySelector(".scan-cancel");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    let stream = null;
    let scanTimer = null;
    let cancelled = false;

    function cleanup() {
      cancelled = true;
      if (scanTimer) clearInterval(scanTimer);
      if (stream) stream.getTracks().forEach(t => t.stop());
      stream = null;
      overlay.remove();
      if (activeCleanup === cleanup) activeCleanup = null;
    }
    activeCleanup = cleanup;

    cancelBtn.addEventListener("click", () => {
      cleanup();
      onCancel();
    });

    try {
      const pending = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      // If the user hit Cancel (or navigated away) while the permission
      // prompt was open, stop the tracks immediately — otherwise the
      // camera light stays on with nobody watching.
      if (cancelled) {
        pending.getTracks().forEach(t => t.stop());
        return;
      }
      stream = pending;
      video.srcObject = stream;
      await video.play();
    } catch (err) {
      console.warn("Camera unavailable:", err);
      cleanup();
      opts.onUnsupported && opts.onUnsupported();
      return;
    }

    scanTimer = setInterval(() => {
      if (cancelled) return;
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

      // Downscale the frame before decoding — accuracy holds, CPU drops ~4-8x.
      const scale = Math.min(1, DECODE_MAX_WIDTH / (video.videoWidth || DECODE_MAX_WIDTH));
      const w = Math.max(1, Math.round(video.videoWidth * scale));
      const h = Math.max(1, Math.round(video.videoHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.drawImage(video, 0, 0, w, h);
      const img = ctx.getImageData(0, 0, w, h);
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
      if (!code) return;

      const scannedId = parseStopIdFromText(code.data);
      if (!scannedId) {
        const label = overlay.querySelector(".scan-label");
        if (label) label.textContent = "That's not a Sage QR";
        return;
      }

      // Success
      overlay.classList.add("found");
      const label = overlay.querySelector(".scan-label");
      if (label) label.textContent = "Got it!";
      clearInterval(scanTimer);
      scanTimer = null;
      setTimeout(() => {
        cleanup();
        onSuccess(scannedId, expectedStopId != null && String(scannedId) === String(expectedStopId));
      }, 450);
    }, SCAN_INTERVAL_MS);
  }

  function closeQrScanner() {
    if (activeCleanup) activeCleanup();
  }

  // Belt and braces: never leave the camera running when the page hides.
  window.addEventListener("pagehide", closeQrScanner);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") closeQrScanner();
  });

  window.openQrScanner = openQrScanner;
  window.closeQrScanner = closeQrScanner;
})();
