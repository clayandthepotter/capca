# Cap deep dive — architecture insights

Source: [CapSoftware/Cap](https://github.com/CapSoftware/Cap) (studied from a
local clone, 2026-07-08). Cap is the closest open-source product to what we're
building; this document extracts how it actually works so Capca can adopt the
same architecture.

## Repo shape

Turborepo monorepo:

```
apps/
  desktop           Tauri v2 + SolidStart — native recorder/editor (their flagship)
  web               Next.js — dashboard, share pages, API (Effect-based), marketing
  chrome-extension  Vite + React MV3 extension (full recorder — see below)
  cli, media-server, mobile, discord-bot, web-cluster
packages/
  recorder-core     ★ shared browser-recording engine (extension + web dashboard recorder)
  web-api-contract  typed API contract shared by clients
  database          Drizzle ORM (MySQL)
  s3, ui, ui-solid, sdk-recorder, sdk-embed, env, config
crates/             ~45 Rust crates for the desktop pipeline
  scap-*            screen capture per backend (Direct3D, ScreenCaptureKit, ffmpeg, cpal)
  camera-*          camera per platform (MediaFoundation, DirectShow, AVFoundation)
  enc-*             hardware encoders (MediaFoundation, AVFoundation, ffmpeg, gif)
  recording/editor/rendering/export/project/media  session mgmt, editor, GPU compositing
```

Licensing: AGPL-3.0 overall; `scap-*` and `camera-*` crates are MIT (reusable
by anyone — including us — without AGPL obligations).

## The Chrome extension (the blueprint that matters most right now)

Cap's extension is a complete product (~250KB of TS) with Playwright e2e
tests. Architectural decisions, in order of importance to us:

### 1. Capture APIs — this explains our "records only the tab" bug

- **They never use `chrome.desktopCapture`.** Screen/window recording calls
  **`getDisplayMedia()` directly inside the offscreen document** (that's what
  the `DISPLAY_MEDIA` offscreen reason exists for). Chrome shows its native
  picker; no streamId hand-off, no origin binding, no
  "Error starting tab capture", no tab-bound captures.
- Tab recording is its own explicit mode using
  `chrome.tabCapture.getMediaStreamId({ targetTabId })`, consumed in the
  offscreen document with `chromeMediaSource: "tab"`.
- Mode-specific picker preferences via extended `getDisplayMedia` options
  (`monitorTypeSurfaces`, `selfBrowserSurface`, `preferCurrentTab`,
  `surfaceSwitching`), with layered fallbacks when a browser/OS rejects the
  advanced options or system audio.
- After capture they detect what the user actually picked from
  `track.getSettings().displaySurface` and adapt the UX.

### 2. Recording engine (`packages/recorder-core`)

- **MP4 first**: prefers `video/mp4;codecs=avc1…,mp4a…` MediaRecorder output
  (modern Chrome muxes MP4 natively), WebM VP9/VP8 as fallback. Seekable,
  universally playable files with no server-side transcode.
- 1080p30 ideal constraints; 1s timeslice chunks.
- **Instant mode for real**: a recording row + multipart upload is created at
  start; chunks upload *while recording*; the share URL exists before you
  stop. Upload progress is broadcast (throttled to 500ms).
- **Crash recovery spool**: chunks also persist locally; recordings stranded
  by a crash are recoverable for 14 days; memory backup capped at 256MB.
- Start/stop sounds, duration guard timers, codec description logging.

### 3. UI architecture

- **Popup is the control center** (React): recording-mode selector
  (fullscreen / window / tab / camera-only), camera + microphone device
  dropdowns, system-audio toggle, sign-in view, dashboard link.
- **A tiny bootstrap content script is declared in the manifest** for all
  pages (`document_idle`) and lazy-loads the real overlay UI on demand. The
  recording bar/bubble therefore appears on any page and survives navigation
  — no on-demand injection races, no stale-content-script problem.
- **Camera bubble**: the offscreen document owns the camera stream (it's being
  recorded); the in-page preview iframe receives the same feed over a local
  **WebRTC loopback** connection. One camera acquisition, two consumers.
- **Auto Picture-in-Picture**: when you switch away from the tab during
  fullscreen/window recording, the overlay automatically enters Document PiP
  so the presenter keeps their self-view (`overlay-enter-auto-pip`). The same
  mechanism we prototyped manually — Cap does it automatically.
- Mic-permission warning gate before starting; 3-2-1 countdown overlay;
  drawing-over-the-page overlay; confirm dialog for risky starts.

### 4. Resilience state machine

- Recording status is a phase machine (`idle / creating / recording / paused /
  uploading / error`) broadcast to every surface (popup, overlay bars in all
  tabs) and mirrored to session storage.
- **MV3 service workers die at will** — Cap treats that as normal: on SW
  restart it re-queries the offscreen document for ground-truth status and
  re-broadcasts, so the UI never freezes in a stale state. The offscreen
  recorder — not the SW — is the source of truth.
- Extension badge reflects recording state.

### 5. Auth & API

- `identity` permission + cap.so session; sign-in state lives in extension
  storage; every upload path is contract-typed (`web-api-contract`).

## Web platform notes

- Share pages carry comments, transcripts, analytics (Tinybird), password
  protection, custom domains; MySQL via Drizzle; Effect-based API runtime.
- The dashboard has a **web recorder built on the same `recorder-core`** as
  the extension — one engine, two surfaces.

## Desktop notes (later phase for us)

- Tauri v2 + SolidStart shell; all capture/encode in Rust crates;
  per-platform capture (`scap-direct3d` on Windows) + hardware encoders
  (`enc-mediafoundation`); GPU compositing (wgpu/Skia) for the editor;
  "instant" vs "studio" modes at the product level.
- The MIT-licensed `scap-*`/`camera-*` crates are directly reusable for a
  future Capca desktop app.

## What Capca adopts (priority order)

1. **Extension capture rewrite on Cap's model** — offscreen `getDisplayMedia`
   for screen/window (kills the tab-binding bug family), `tabCapture` for tab
   mode, surface-preference + fallback ladder, MP4-first mime selection.
2. **Declared bootstrap content script** instead of on-demand injection.
3. **Status state machine** broadcast + session-storage mirror + SW-restart
   resync; offscreen as source of truth.
4. **Popup control center** with mode + device selection.
5. **Instant upload** (multipart while recording) — our API already issues
   presigned URLs; extend to multipart parts per chunk.
6. **Auto-PiP self-view** on tab switch.
7. Later: desktop app on the MIT capture crates; comments/transcripts on
   share pages.
