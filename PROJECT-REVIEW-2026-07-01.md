# Ranger Sage's Treasure Hunt — Full Project Review
**Date:** July 1, 2026 · Three independent review passes (code, UX/content, launch-readiness), findings cross-checked and the biggest one re-verified by hand.
**Tags:** 🟢 verified in the actual files · 🟡 likely but depends on a decision or outside fact

---

## Bottom Line

You built the **right skeleton** — the app's bones (navigation, progress-saving, forgiving scanning, the whole look) are genuinely good and don't need rework. But **nothing a family reads, hears, or wins is real yet**, there is **one bug that makes the hunt literally unfinishable**, and there is **one irreversible decision (metal signs) that must not happen until the stop list is frozen and the QR links are made permanent**. The gap between "board demo" and "best-of-the-best" is well-defined, and all of it is fixable. Roughly: **1 week of decisions, 2–3 weeks of focused build.**

---

## The Best Parts (keep these — don't let anyone "improve" them)

1. 🟢 **The resume experience.** Close the app mid-hunt, come back tomorrow — you land exactly where you were, greeted with "You've found X of 26 so far." Progress is saved on the phone with no accounts or logins. This is exactly right for families.
2. 🟢 **Any-order scanning.** Kids can wander. Scanning stop 14 before stop 5 just works, and scanning a random non-Sage QR politely says "That's not a Sage QR" and keeps going. Forgiving in exactly the way a kids' activity must be.
3. 🟢 **The visual identity.** The paper/olive/mustard palette pulled from the camp map, the hand-drawn feel, Sage's poses, the stamps and confetti — it feels like a place, not a template. This is the brand of the 50th-anniversary experience and it's already there.
4. 🟢 **The safety of the code.** No injection vulnerabilities; the URL-handling was checked and is safe; all 26 QR links on the printable sheet match what the app expects.
5. 🟢 **The self-updating QR sheet.** `print-qr.html` reads live from the stop data, so staff can always reprint accurate signs — even offline. Genuinely good operational design.
6. 🟢 **The content exists.** All ~26 narration recordings and ~20 location photos are done and sitting in Drive. The hardest creative work is finished — it just isn't in the app yet.
7. 🟢 **Leadership is already warm.** Chandler and Audrey requested access; the demo did its job.

---

## What Must Change — ranked by "how much it hurts if we get it wrong"

### 🔴 TIER 1 — Irreversible: settle BEFORE any metal is cut

**1. QR codes currently encode the stop's position number, and the walking order has already changed.** 🟢
Signs link to `#stop/7`, `#stop/18`, etc. But the newly recorded content shows the route was re-sequenced (Cabin 8 now before Cabin 6), stop 18 was renamed (Grotto → Memorial Plaque), and three new stops exist (Auditorium, Cabin 9, Flagpole-Lectern). If metal signs are fabricated with today's numbers and the list shifts again, signs become scrap.
**Fix (small, cheap, huge insurance):** give every stop a permanent name-based link tied to the *place* — `#stop/swinging-bridge`, `#stop/memorial-plaque` — and keep the number as a separate display field that can reshuffle any season. The app's routing already supports this; it's mostly a data edit. **Metal signs then never go stale, ever.**

**2. The 7 open stop-list questions (RECONCILE-STOPS.md) are the true critical path.** 🟢
Audio wiring, QR printing, sign fabrication, and map pins all queue behind these answers: Memorial rename? Add Auditorium/Cabin 9/Flagpole-Lectern? Is County Road 9 the intro? Does the Library share the transition clip? Name changes? New order? Nothing downstream can be finalized first.

### 🔴 TIER 2 — Broken: the product doesn't work as designed

**3. The hunt cannot be finished. Families will be stuck at 25/26 forever.** 🟢 (re-verified by hand)
The total counts the Family Commons parent stop, but the map never offers a way to scan it — and worse, the app *shows the Commons row as complete* once the 6 interior rooms are done, while secretly still requiring the main Commons sign. A family that does everything visible sees every checkmark, a counter frozen at 25/26, and no prize screen, with no hint why.

**4. Anyone can win without playing.** 🟢 Four separate holes:
- Visible **DEMO ⏩ skip buttons** on every scan page and every stop page — a kid can complete all 26 stops from a bench in ten minutes.
- **Denying camera permission fakes a successful scan** — the app pretends you scanned the sign and gives you credit.
- Typing **`#done`** in the address bar shows the prize screen with zero stops done.
- The prize code (`GUN-XXXX-SAGE`) is random and **unverifiable** — staff at the prize table can't tell a real finisher from an invented code.
**Fix:** strip the demo buttons, make camera-denial show an honest "camera is blocked" message, gate the prize screen on actual completion, and decide the real prize-table procedure (the filled 26-stamp map on the phone is probably the honest "proof" — decide with camp staff).

**5. Nothing a family experiences is real content.** 🟢
All 26 transcripts literally begin "[Placeholder narration]" on screen. The audio player is a fake 14-second timer displaying a made-up "1:48." 24 of 26 stops show a dashed placeholder where a sticker image should be. Several clues reference objects nobody has confirmed exist on the ground ("find a heart carved in a trunk" also quietly invites tree-carving at a camp). Meanwhile the real narration MP3s and photos sit in Drive, finished.

### 🟠 TIER 3 — Will fail at camp: rural-Colorado network reality

**6. The app re-downloads everything on every open and hangs on weak signal.** 🟢
Every page load cache-busts all files with a fresh timestamp (defeating the phone's cache), and the offline fallback only kicks in when the network *fully fails* — on one-bar LTE a request can stall 30–75 seconds first. Standing at a sign, that's a minute of blank beige screen. Fonts also load from Google's CDN, so offline the whole hand-crafted look collapses to system fonts. **Fix:** serve from cache instantly and update in the background; a fixed version number bumped per release; self-host the three fonts.

**7. The audio integration has five known traps — cheaper to avoid than to debug.** 🟢/🟡
(a) iPhones block auto-play — the current design auto-plays and only grants credit when audio *finishes*, so on iOS stops would never complete. Completion needs a decision: credit on scan, or on listen-with-fallback-button. (b) The service worker mishandles how iPhones fetch audio (range requests), so audio would never actually get cached. (c) Files must live in the repo, not Drive (Drive links won't stream reliably). (d) Compress first: these are voice recordings — the ~40 MB of files should become ~10–15 MB with zero audible loss (the 15 MB intro → ~2 MB). (e) Don't pre-download all audio at install; fetch each stop's file when needed, plus an optional "download the whole hunt on WiFi" button at the welcome screen. 🟡 *Confirm camp WiFi exists at the Commons.*

### 🟡 TIER 4 — Quality bar: "best of the best" details

- **Crash-proofing:** corrupted saved data currently blanks the entire app permanently 🟢; one tap on "Start over" erases a family's whole afternoon with no "are you sure?" 🟢; the camera can stay on after closing the scanner 🟢.
- **Revisit:** completed stops can't be re-opened to re-read a story without re-scanning the sign 🟢; after finishing, the map force-bounces you to the prize screen forever 🟢.
- **Accessibility:** helper text fails contrast standards right where sunlight-readability matters most 🟢; pinch-zoom is disabled (grandparents can't enlarge the story text) 🟢; no reduced-motion support; screen-reader labels never update. Real transcripts are also the deaf/hard-of-hearing version of the tour — worth doing well.
- **Voice:** Sage is specced "cool and kind of tough," but most intros are interchangeable park-brochure pleasantries. The two lines that land — "Stop and listen — they actually whisper" and "acquired it on a handshake" — are the tone to rewrite toward, with the heritage register for adults layered in. 🟢
- **Measurement (the "is it working?" question):** zero analytics — after the 50th-anniversary season, nobody can answer "how many families did the hunt, where did they quit?" A cookie-free, kid-appropriate counter (e.g., GoatCounter — one line of code, no personal data) gives starts, per-stop drop-off, and completions. Do **not** use Google Analytics for a children's activity. 🟢
- **Safety net:** one bad edit to the repo instantly breaks the live site on every phone at camp. Minimum viable process: a staging copy to phone-test changes first, plus a one-paragraph "how to undo a bad deploy" note in the README. 🟢
- **Small stuff:** iPhone home-screen installs track progress separately from Safari (families would "lose" stops — worth guidance or de-emphasizing install); QR sheet needs a printed date/version stamp; the 1.6 MB sticker image should be ~100 KB; hardcoded "26" and "six interior spots" texts will go stale when stops change.

---

## The Path to Near-Finish (sequenced — order matters)

**Phase 0 — Decisions (this week, mostly John + camp staff, no code):**
1. Answer the 7 stop-list questions in RECONCILE-STOPS.md → freeze the list.
2. Decide prize-table procedure with staff.
3. Decide completion rule (credit on scan vs. on listen).
4. Confirm Commons WiFi. Confirm which physical stickers will actually exist at stops.

**Phase 1 — Foundation (before ANY sign fabrication):**
5. Permanent place-based QR links (kills the metal-sign risk forever).
6. Fix the 25/26 dead-end. Strip DEMO buttons. Gate the prize screen. Honest camera-denied message.

**Phase 2 — Real content (the big build):**
7. Compress + commit audio; build the real player around the five known traps.
8. Real transcripts (recoverable from the sign photos) rewritten in Sage's actual voice, dual register.
9. Sticker art for the four missing types; location photos on stop pages; clue list reconciled with reality.

**Phase 3 — Camp-network hardening:**
10. Cache-first serving with background updates; fixed release version; self-hosted fonts; "download the hunt" button.

**Phase 4 — Polish + operations:**
11. Crash-proofing, confirm-before-reset, revisit path, contrast/zoom/motion/labels.
12. GoatCounter analytics; staging copy + rollback note; staff one-pagers (prize table, reprinting signs, changing a stop next season); version-stamped QR sheet.

**The one rule that must not bend:** no metal sign gets fabricated until Phase 0 and item 5 are done. Everything else is recoverable; etched metal is not.

---

## Your Decisions (nobody else can make these)

| # | Decision | Blocks |
|---|----------|--------|
| 1 | The 7 stop-list questions (RECONCILE-STOPS.md) | Everything |
| 2 | Prize: what does the table actually accept? | Prize screen design |
| 3 | Completion: credit on scan, or on listen? | Audio player build |
| 4 | Add analytics (GoatCounter), yes/no? | Phase 4 |
| 5 | Sticker plan: which physical stickers will exist? | Clue rewrite |
