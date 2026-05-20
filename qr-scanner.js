// Real QR scanner wrapper around jsQR + getUserMedia.
// Exposes openQrScanner(expectedStopId, callbacks) globally.
// Falls back to simulated scan if no camera / permission denied / running on file://.

(function () {
  "use strict";

  const SCAN_INTERVAL_MS = 100; // jsQR runs ~10x/sec, light enough on phones

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

  function showError(overlay, msg) {
    const label = overlay.querySelector(".scan-label");
    if (label) label.textContent = msg;
    overlay.classList.add("error");
  }

  async function openQrScanner(expectedStopId, opts) {
    opts = opts || {};
    const onSuccess = opts.onSuccess || function () {};
    const onCancel  = opts.onCancel  || function () {};

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof jsQR !== "function") {
      // No camera support — fall back: simulated scan flow handled by caller
      opts.onUnsupported && opts.onUnsupported();
      return;
    }

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
      overlay.remove();
    }

    cancelBtn.addEventListener("click", () => {
      cleanup();
      onCancel();
    });

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      video.srcObject = stream;
      await video.play();
    } catch (err) {
      console.warn("Camera unavailable:", err);
      showError(overlay, "Camera blocked. Tap Cancel to go back.");
      // Still allow cancel; caller may want to surface fallback
      if (opts.onUnsupported) {
        cleanup();
        opts.onUnsupported();
      }
      return;
    }

    scanTimer = setInterval(() => {
      if (cancelled) return;
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
      if (!code) return;

      const scannedId = parseStopIdFromText(code.data);
      if (!scannedId) {
        // It was a QR but not one of ours
        const label = overlay.querySelector(".scan-label");
        if (label) label.textContent = "That's not a Sage QR";
        return;
      }

      // Success
      overlay.classList.add("found");
      const label = overlay.querySelector(".scan-label");
      if (label) label.textContent = "Got it!";
      // Brief flash, then close
      setTimeout(() => {
        cleanup();
        onSuccess(scannedId, expectedStopId != null && String(scannedId) === String(expectedStopId));
      }, 450);
    }, SCAN_INTERVAL_MS);
  }

  window.openQrScanner = openQrScanner;
})();
