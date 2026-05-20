# Ranger Sage's Treasure Hunt

A self-guided QR-code treasure hunt around Camp Gunnison — The Way Family Ranch. Families scan QR signs at 26 stops, listen to Ranger Sage's stories, hunt for stickers, and earn a prize at the end.

Built as a static web app (no backend) — also installable as a PWA on phones.

## Local preview

```
python -m http.server 8080
# then open http://localhost:8080/
```

The camera (real QR scanner) only works on `https://` or `http://localhost`. On mobile use the deployed GitHub Pages URL.

## Stop QR codes

Each printed sign's QR encodes the deployed URL with a stop-specific hash, e.g.:

```
https://gitjohnny90.github.io/sage-treasure-hunt/#stop/7
```

Scanning with the phone's native camera opens the app at that stop. Scanning from inside the app (via the in-app scanner) navigates to that stop too.
