# Ranger Sage's Treasure Hunt

A self-guided QR-code treasure hunt around Camp Gunnison — The Way Family Ranch.
Families scan QR signs at 26 stops, listen to real recorded narration, hunt for
stickers, and earn a prize at the end.

Static web app (no backend), installable as a PWA. Live at:
**https://gitjohnny90.github.io/sage-treasure-hunt/**

## How it works

- Each printed sign's QR encodes `https://gitjohnny90.github.io/sage-treasure-hunt/#stop/<id>`
- Scanning (native camera or in-app scanner) opens that stop's story page
- A stop checks off when its narration finishes playing
- Finishing all six Family Commons rooms auto-completes the Commons (stop 1)
- The prize screen (`#done`) only opens when all 26 stops are complete
- Progress lives in the phone's localStorage — no accounts, no server

## Local preview

```
python -m http.server 8080
# then open http://localhost:8080/
```

The camera scanner only works on `https://` or `http://localhost`.

## Demo mode (staff only)

Visit the app with `#demo` appended to toggle demo mode: skip-scan and
skip-audio buttons appear, marked with a red DEMO badge. Toggle off the same
way or via the menu. See `DEMO-NOTES.md`.

## Deploying

Push to `main`; GitHub Pages rebuilds in ~30-60 s. **Bump the `?v=` version
string in `index.html` when changing CSS/JS** so returning phones fetch the
new files promptly (the service worker serves cached files first and refreshes
in the background).

### Undoing a bad deploy

```
git revert HEAD
git push
```

## Rules that must not break

1. **Stop ids are frozen** — printed QR codes encode `#stop/<id>`. Renaming a
   stop is safe; renumbering/reusing ids is not.
2. **Audio completion is the completion rule** (per John's decision). Stops
   without audio show an explicit "I read it — check it off" button instead.
3. Audio files live in `audio/` (compressed mono 64k MP3, loudness-normalized).
   Source recordings are in Google Drive ("Tressure hunt" folder).

## File map

```
index.html            app shell; version-stamped script/style tags
app.js                routing, screens, real audio player, demo mode
data.js               all 26 stops: names, real transcripts, audio, clues
styles.css            camp-palette design system
qr-scanner.js         getUserMedia + jsQR wrapper (honest camera-denied path)
sw.js                 service worker: stale-while-revalidate shell,
                      cache-first audio with Range support
audio/                24 narration MP3s (~14 MB total)
fonts/                self-hosted Fredoka/Nunito/Patrick Hand
print-qr.html         printable QR sheet for all 26 stops (version-stamped)
assets/, icons/       Sage art, camp map, PWA icons
RECONCILE-STOPS.md    open stop-list decisions (Auditorium, Cabin 9, ...)
DEMO-NOTES.md         how to demo; what changed; open questions
PROJECT-REVIEW-2026-07-01.md   full three-pass review that drove this build
```
