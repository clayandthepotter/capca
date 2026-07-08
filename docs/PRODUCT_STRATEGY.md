# Product Strategy

Updated: 2026-07-08

## Positioning

Capca should not try to win as "another recorder." The durable wedge is:

> Fast async video for teams that want a polished Loom-like workflow without
> giving up ownership of recordings, storage, or deployment.

That means the product has to feel simple at the surface, but the engineering
bar is infrastructure-grade: reliable capture, recoverable uploads, predictable
share links, and privacy controls that work every time.

## Current Product State

The repository already has the outline of a real product:

- Next.js web app with landing page, auth, `/record`, dashboard, and public
  share pages.
- Browser recorder that captures screen, camera bubble, microphone, optional
  display audio, and produces a single WebM.
- S3-compatible storage with direct presigned uploads.
- Postgres + Drizzle schema for users, sessions, and recordings.
- Chrome extension scaffold with offscreen recording and in-page controls.
- Cap architecture research in `docs/CAP-INSIGHTS.md`.

The biggest gap is not product imagination; it is reliability. The web path is
usable but still basic. The extension path is in active refactor state and needs
to be made internally consistent before it is treated as shippable.

## Competitive Read

### Cap

Cap is now the closest reference product. Its public positioning is open source,
data ownership, instant links, Studio Mode, screenshots, AI summaries,
transcripts, comments, analytics, teams, custom domains, custom storage, and
self-hosting.

Cap's advantage is the native desktop app and media pipeline. It can promise
polished local editing, 4K/60fps-style quality, cross-platform desktop behavior,
and robust upload-while-recording. Competing head-on with that immediately is a
trap.

Our opportunity against Cap is narrower:

- Web-first and extension-first onboarding.
- Simpler self-hosting and operator story.
- More focused team workflow before deep desktop editing.
- Stronger reliability guarantees in the browser capture path.

### Loom

Loom owns the mainstream async-video expectation: one-click recording, instant
sharing, comments/reactions, transcripts, workspace organization, and AI meeting
notes. The free tier sets user expectations around short videos and fast
activation, but the lock-in and pricing create room for an ownership-first
alternative.

We do not beat Loom with more UI. We beat it with trust, portability, and a
flow that is still almost as fast.

### Bluedot

Bluedot is a different but important adjacent signal: meeting recording is
moving toward bot-free, privacy-first capture, transcripts, summaries, action
items, and CRM/Notion handoff. This matters because screen recording products
are converging with meeting memory products.

Capca should not become a meeting bot first. But it should treat transcript,
summary, highlight, and follow-up extraction as core post-recording primitives,
not optional decorations.

## Product Pillars

1. Reliable Capture

   Recording must never feel fragile. Users should understand what is being
   captured, see recording state everywhere, pause/stop safely, and recover if a
   browser or extension context crashes.

2. Instant Sharing

   The share link should exist at the start of a recording or very soon after.
   Uploading after stop is acceptable for early demos, but not for a complete
   product.

3. Ownership

   Bring-your-own S3/R2/MinIO and self-hosting should be first-class. This is
   not just a pricing story; it is the reason to trust the product.

4. Review Workflow

   Public share pages need comments, reactions, transcripts, chapters, viewer
   activity, and privacy controls. A plain video player is only the beginning.

5. Polish Without Fragility

   Backgrounds, zooms, cursor effects, screenshots, trimming, and captions can
   differentiate the product, but only after the capture/upload/share loop is
   dependable.

## Roadmap To A Complete Product

### P0: Make The Existing Core Trustworthy

- Fix extension consistency: popup manifest target, control surfaces, status
  messages, and mode handling must agree.
- Add automated extension smoke tests for start, cancel, stop, and local
  download fallback.
- Add web recorder smoke tests for screen/camera/mic permission paths where
  automation allows it.
- Make MIME and storage key handling format-aware; MP4 recordings cannot be
  stored as `.webm`.
- Add explicit error states for failed upload, failed media playback, expired
  presigned URLs, and missing storage configuration.
- Add basic observability: structured server logs for create/upload/patch/media.

### P1: Real Instant Sharing

- Create recording rows when recording starts.
- Upload chunks during recording with multipart upload or resumable upload
  semantics.
- Persist local chunks until upload is confirmed.
- Recover stranded recordings after crash or reload.
- Show upload progress and final link in both web and extension surfaces.

### P2: Share Page As A Workflow

- Comments and reactions on the timeline.
- Viewer counts and last-viewed activity.
- Password-protected and expiring links.
- Thumbnails and Open Graph previews.
- Transcript generated after upload.
- AI title, summary, and chapter generation.

### P3: Team Product

- Workspaces, members, and roles.
- Shared libraries and folders.
- Workspace-level storage configuration.
- Workspace-level default privacy policy.
- Audit trail for recording access and deletion.

### P4: Studio And Native Capture

- Trim, crop, cursor emphasis, click highlights, backgrounds, and captions.
- Server-side or local MP4 export path.
- Desktop app for Windows first if browser limitations block quality, global
  overlays, or full system audio.

## Quality Bar

A feature is not complete until it has:

- A clear owner state in the database where applicable.
- A recoverable failure mode.
- A user-visible loading/error/empty state.
- A test or repeatable manual verification script.
- Documentation in README or architecture docs when it changes setup or
  operating behavior.

## Immediate Recommendation

Do not add more visible product surface until the extension and upload lifecycle
are solid. The next engineering milestone should be:

> A user can record from the web or extension, stop, get a link, reload the app,
> open the link, and delete the recording without broken states or hidden manual
> recovery.

