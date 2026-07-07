# @video-capture/extension

Chrome MV3 extension. No build step — load the folder directly.

## Install (dev)

1. `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select this folder (`apps/extension`)
3. Pin the extension and click it on any normal page (not `chrome://` pages)

## How it works

- **background.js** — service worker. Injects the UI, runs
  `chrome.desktopCapture.chooseDesktopMedia` (screen picker), creates the
  offscreen document, downloads the finished file.
- **content.js / content.css** — draggable camera bubble + control bar injected
  into the page. The bubble is page DOM, so the screen capture records it —
  that's the whole compositing story (same trick Loom uses).
- **bubble.html / bubble.js** — the camera view inside the bubble. It's an
  iframe on the extension origin so camera+mic permission is granted once for
  the extension instead of per-site.
- **offscreen.html / offscreen.js** — MediaRecorder lives here (MV3 service
  workers have no DOM/media APIs). Mixes desktop audio + mic, records WebM,
  returns a blob URL.

## Known gaps (P0)

- Output downloads locally; uploading to the web app API is P1.
- No recording timer or countdown in the control bar yet.
- Picking the same tab you're on records the bubble (intended); picking a
  different window records that window but the bubble stays on the original tab.
