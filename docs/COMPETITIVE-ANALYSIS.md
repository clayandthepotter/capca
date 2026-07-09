# Competitive Analysis

Updated: 2026-07-09

This document compares Capca against Loom, Bluedot, and Cap using public
marketing/pricing pages plus the saved screenshots in:

`C:\Users\hello\OneDrive\Pictures\Screenshots\Competitor Screenshots`

The goal is not to copy every surface. The goal is to define what Capca must
ship to feel like a complete product and where it can win with a generous,
ownership-first free tier.

## Executive Takeaways

Capca should compete on three promises:

1. **Unlimited free recording when users bring storage.** If a user connects
   Google Drive, they should be able to record unlimited videos of any length
   within practical browser/device limits because Capca is not carrying the
   video storage bill.
2. **Open source without the rough edges.** Open source is only a wedge if the
   hosted and local product feels reliable: clear onboarding, reliable capture,
   recoverable uploads, useful errors, and polished share pages.
3. **Loom-like speed with Bluedot-style meeting memory.** The core workflow is
   async screen recording, but the product must treat transcripts, summaries,
   action items, and searchable meeting memory as first-class follow-up
   experiences.

The easiest market gap is the free tier. Loom's free plan is constrained by a
25-video and 5-minute limit. Bluedot's free plan is a 5-meeting lifetime trial.
Cap's free product has strong local recording, but cloud share links and
Google Drive/S3 support are Pro-gated. Capca can differentiate by making
Google Drive export a free, central workflow instead of a paid add-on.

## Sources

- Loom homepage: https://www.loom.com/
- Loom pricing: https://www.loom.com/pricing
- Bluedot homepage: https://www.bluedothq.com/
- Bluedot pricing: https://www.bluedothq.com/pricing
- Bluedot Chrome Web Store listing:
  https://chromewebstore.google.com/detail/bluedot-ai-notetaker-meet/aeeninnnlhgaojlolnbpljadhbionlal
- Cap homepage: https://cap.so/
- Cap pricing: https://cap.so/pricing
- Google Drive upload API:
  https://developers.google.com/workspace/drive/api/guides/manage-uploads
- Google Drive API scopes:
  https://developers.google.com/workspace/drive/api/guides/api-specific-auth

## Positioning Matrix

| Product | Public Position | Practical Wedge | Free Tier Signal |
| --- | --- | --- | --- |
| Loom | AI-powered video messages for teammates and customers | Mature async video workflow: recorder, dashboard, sharing, comments, transcripts, AI editing, integrations | 25 videos/person, 5 minutes/video, 720p, comments, transcriptions, privacy controls, integrations |
| Bluedot | Invisible, privacy-first AI note taker | Bot-free meeting capture, transcription, summaries, AI chat, CRM/Notion automation | 5 meetings lifetime, max 1 hour/recording, Chrome extension, desktop/mobile apps |
| Cap | Beautiful screen recordings, owned by you | Open-source Loom alternative with local desktop recording, Studio Mode, screenshots, cloud sharing, AI, BYO storage on Pro | Free personal plan, 5-minute shareable links, local Studio Mode; Google Drive/S3 support requires Pro |
| Capca | Open-source video messaging with user-owned storage | Web/extension-first recorder with unlimited Google Drive export on free tier | Proposed: unlimited videos and length when exporting to user's Drive |

## Feature Inventory

### Loom

Publicly visible features:

- Screen and camera bubble recording.
- System audio capture.
- Chrome extension, desktop app, and mobile app.
- Unlimited screenshots on the Starter plan.
- Personal, shared, and team libraries.
- Folders, archiving, search, and workspace spaces.
- Viewer insights, engagement insights on paid plans.
- Comments, emoji reactions, transcriptions, closed captions, watch later.
- Privacy controls; password-protected videos on Business and above.
- Recording canvas, camera frames, virtual backgrounds, background noise
  suppression, speaker notes.
- Business plan adds unlimited videos, unlimited recording time, 4K, upload and
  download, waveform editing, trim/stitch, custom thumbnails, embedded links,
  drawing, mouse emphasis, blur, custom branding, and priority support.
- Business + AI adds auto enhancement, advanced editing, video-to-text
  automation, meeting recap emails, auto meeting notes, auto titles,
  summaries, chapters, tasks, filler word removal, and silence removal.
- Integrations include Slack, Jira, Confluence, GitHub, Gmail, FigJam, Notion,
  Intercom, Zendesk, Dropbox, GitLab, and more.

Screenshot observations:

- Onboarding is multi-step and role-aware: sign-in, Atlassian setup, use-case
  selection, work role, record-or-discover choice, calendar integration,
  meeting recording rules, and recorder selection.
- The dashboard is dense but familiar: left nav, workspace switcher, teammate
  invite, library tabs, filters, video cards with duration/status/engagement,
  search, upgrade, notifications, and profile.
- Recorder UI is highly polished: dark floating control panel, left-side
  recording rail, camera bubble, tabbed video/screenshot modes, camera and mic
  selectors, effects, blur, settings, notifications, about, and contextual
  tooltips.
- The free limit is visible inside the recorder, which reinforces why users
  upgrade.
- Post-recording editor pushes AI heavily: clean up video, remove silences,
  remove filler words, captions, transform into docs/Jira, share, activity,
  transcript, and generated content panels.

What this means for Capca:

- Users expect more than "record and download." They expect a library, share
  links, comments, transcripts, privacy, and recovery.
- The recorder must always show exactly what is being captured: screen, camera,
  mic, system/tab audio, quality, and free-tier constraints.
- AI is becoming part of the editor and follow-up workflow, not a side feature.

### Bluedot

Publicly visible features:

- Bot-free meeting recorder and AI note taker.
- Records Zoom, Google Meet, Microsoft Teams, phone calls, and in-person
  meetings.
- Chrome extension, desktop apps, iOS, Android, and Apple Watch support.
- Transcription and summaries in 100+ languages.
- Meeting notes tailored by team/use case.
- AI chat across meetings.
- Shared searchable meeting memory.
- Share links, comments on key moments, and highlight clips.
- Post-meeting automation to CRM, ATS, Notion, and other tools through API,
  MCP, webhooks, Zapier, and Make.
- Security positioning around GDPR and SOC 2.
- Free plan: 5 meetings lifetime, 1 hour max per recording, Chrome extension,
  desktop/mobile apps, Slack/Notion/Zapier/Make.
- Paid plans add unlimited audio meetings, unlimited storage, webhooks, MCP,
  unlimited meetings with video, unlimited recording duration, custom note
  templates, Zoom and Google Drive imports, CRM/ATS integrations, admin
  controls, SSO/SCIM, custom retention, and unlimited imports.

Screenshot observations:

- Bluedot sells "privacy-first" hard: minimal white UI, strong blue hero,
  GDPR/SOC 2 badges, and "data never used to train AI" copy.
- Onboarding is meeting-platform-first: pick Google Meet, Zoom, Teams, or
  Other, then install the extension.
- The app dashboard is much simpler than Loom: Home, AI chat, Screen
  recordings, Meetings, collections, automation, extension install, upload, and
  a visible meeting quota.
- The recorder panel is app-like and calm: screen/camera/mic rows, language,
  video/audio settings, start button, and a floating timer/control pill.
- The product centers around meeting memory more than async video libraries.

What this means for Capca:

- Meeting capture is converging with searchable AI memory.
- A privacy-first product needs specific UX: clear data policies, minimal
  scopes, no hidden bots, and explicit storage location.
- Capca does not need to become a meeting-only product, but Google Meet capture,
  transcript, summary, action items, and searchable history should be treated
  as core workflows.

### Cap

Publicly visible features:

- Open-source screen recorder with Instant Mode, Studio Mode, and Screenshot
  Mode.
- Web, Chrome extension, macOS, and Windows presence.
- "Record and share in seconds" positioning.
- User-owned storage: Google Drive, S3 bucket, Cap Cloud, or local-only.
- Uploads while recording for instant links.
- AI-generated title, summary, chapters, and transcript.
- Share pages with activity, summary, transcript, comments, links, and browser
  viewing.
- Studio Mode for high-quality local recording and editing before sharing.
- Custom backgrounds, padding, rounded corners, motion blur, shadows, borders,
  cursor effects, click effects.
- Screenshot mode with beautification, annotations, copy/save, and hotkeys.
- 4K/60fps export, export to any format, custom domains, password-protected
  shares, viewer analytics, team workspaces, Loom importer, custom S3, Google
  Drive support, self-hosting, and enterprise security controls.
- Free plan: personal use, Studio Mode, 4K/60fps export, export formats, team
  workspaces, community support, but shareable links are capped up to 5 minutes
  and Google Drive/S3 support is not included.

Screenshot observations:

- Cap's dashboard is the closest design reference for Capca: left nav,
  organization switcher, spaces, search, My Caps, analytics, record/import,
  upgrade CTA, and empty-state recording CTAs.
- The recorder modal is simpler than Loom's but productized: full screen row,
  camera, mic permission, system audio, settings, free badge, tips, and a
  camera bubble.
- Cap invests in explainers inside the product, such as "uploads while you
  record," "instant shareable link," and "keep your webcam visible."
- Share pages are real product pages: player, title, owner, share state,
  analytics, comments, summary, transcript, and a free-plan limit banner.

What this means for Capca:

- Cap is the toughest direct competitor because it already owns the
  open-source and user-owned-storage narrative.
- Capca cannot win by saying "open source" alone. It needs a sharper free-tier
  promise and a more reliable web/extension-first path.
- The most promising distinction is: **Google Drive export is free and
  unlimited by default, not Pro-gated.**

## Capca Differentiation

### Primary Wedge

> Capca is the open-source recorder for people who want Loom-speed sharing
> without Loom storage limits. Connect Google Drive and record unlimited videos
> of any length into storage you own.

This is differentiated because:

- It directly attacks Loom's free-tier limits.
- It directly attacks Bluedot's trial-like free plan.
- It directly attacks Cap's Pro-gated custom Google Drive/S3 storage.
- It makes Capca's operating costs rational: free users bring storage.
- It aligns with the open-source promise: user ownership is a product behavior,
  not a marketing claim.

### Free Tier Principles

The free tier should be generous but not reckless:

- Unlimited local recording.
- Unlimited Google Drive exports after the user connects Drive.
- Unlimited recording duration subject to browser/device/storage constraints.
- Unlimited private Drive-hosted files owned by the user.
- Capca-hosted share pages for Drive-backed videos should be allowed, with
  metadata, thumbnails, and access controls stored by Capca.
- Capca-hosted storage can remain limited because it costs money.
- AI processing can have fair-use limits because transcripts and summaries
  cost money.
- Team admin, custom domains, enterprise security, and heavy automation can be
  paid later.

### Google Drive Product Requirements

The Drive integration must be a first-class product path, not an export button
hidden after recording.

Required UX:

- During onboarding, offer "Use my Google Drive for unlimited free recording."
- Explain the bargain clearly: "Videos are saved to your Drive. Capca stores
  metadata and share-page settings."
- Use a preflight checklist before recording: Drive connected, available
  browser permissions, mic/camera/system audio status, and estimated storage
  destination.
- Create a `Capca Recordings` folder by default.
- Allow users to choose or create a Drive folder later.
- Start upload during recording when technically possible.
- If upload-while-recording is interrupted, continue from local chunks or
  retry after stop.
- Show upload progress, Drive file status, share permission status, and final
  Capca link.
- Expose "Open in Drive," "Copy Drive link," "Copy Capca link," "Download," and
  "Delete from Capca metadata" separately.
- Never delete a user's Drive file without an explicit destructive action.

Technical implications:

- Use the Drive API `drive.file` scope where possible so Capca can create and
  manage files it owns without broad Drive access.
- Use resumable uploads for long recordings. Google's Drive API supports a
  resumable session URI, chunked upload, progress monitoring, and resuming
  after interrupted transfers.
- Persist the resumable session URI, Drive file id, MIME type, byte offsets,
  chunk state, and local chunk references.
- Name files with stable extensions based on actual MIME type, not always
  `.webm`.
- Store Capca metadata separately: title, owner, thumbnail, duration, transcript
  status, visibility, comments, and analytics.
- For share pages, support both Drive-private playback through authenticated
  proxy and public/domain Drive permission modes. The MVP can start with
  "Capca creates an unlisted Drive permission when the user chooses public
  sharing."

## Complete Product Quality Bar

Capca is not complete until the following workflows are boring and repeatable:

### Capture

- Web recorder and Chrome extension both support screen/window/tab selection.
- Camera bubble is stable, draggable, hideable, and does not leak into browser
  tabs before recording starts.
- Mic, tab/system audio, and camera permissions show clear states.
- Google Meet participant audio works when the user chooses a tab with shared
  audio.
- Users can stop, cancel, pause, restart, and record again on the same tab.
- Browser-owned pages fail gracefully with a helpful explanation.

### Upload And Recovery

- Recording rows are created when capture starts.
- Upload progresses while recording, or immediately after stop with a visible
  queue.
- Local chunks survive reload/crash until upload succeeds or the user discards.
- Failed uploads can resume or retry.
- The product never silently loses a recording.
- File extensions and MIME types match the real recording format.

### Library

- Dashboard shows thumbnails, duration, date, owner, storage destination, share
  status, and upload status.
- Users can search, filter, rename, delete metadata, and open the source file.
- Empty states teach the next action without feeling like a demo.
- Workspace/team structure can wait, but the personal library must feel real.

### Share Page

- Public share page has a polished player, title, owner, date, link copy,
  privacy state, transcript tab, summary tab, and comments.
- Viewer analytics are visible to the owner.
- Password and expiry support are planned before external/team use.
- Drive-backed videos clearly show that the source file is user-owned.

### AI And Meeting Memory

- Transcription is a default post-processing state, not a hidden paid upsell.
- Summary, chapters, and action items are generated after upload.
- AI limits are explicit and fair.
- Users can search across titles, transcripts, and summaries.
- Google Meet recordings should produce meeting notes that can be exported to
  Docs/Notion/Markdown later.

### Documentation And Onboarding

- README remains enough to run the product locally.
- Extension install/reload workflow is documented with Chrome restrictions.
- Google Drive setup is documented end to end, including OAuth scopes and
  consent-screen requirements.
- Production deployment docs explain Postgres, storage, auth, and Drive OAuth.
- "How it works" inside the product explains upload, ownership, and sharing.

## Roadmap To Compete

### P0: Reliability Before New Surfaces

- Add extension smoke tests for repeat recording, stop/cancel, page reload,
  activeTab limitations, and Chrome native picker flows.
- Finish upload recovery for web recordings.
- Make MIME/storage key handling format-aware.
- Add explicit browser permission and unsupported-page states.
- Add dashboard status labels for processing, uploaded, failed, and local-only.

### P1: Google Drive Free Tier

- Add Google OAuth and Drive connection state.
- Create or select the default Drive folder.
- Implement Drive resumable uploads.
- Store Drive file ids and source metadata in recordings.
- Add Drive-backed share page playback.
- Add Drive export status to web recorder, extension, and dashboard.
- Document OAuth setup and local development.

### P2: Share Workflow

- Add comments, reactions, and viewer activity.
- Add transcript, summary, and chapters.
- Add thumbnails and Open Graph previews.
- Add privacy controls: public, unlisted, password, expiry.
- Add search over titles and transcripts.

### P3: Meeting Memory

- Add Google Meet recording recipe inside onboarding.
- Add meeting-note summary format with decisions, action items, and follow-ups.
- Add calendar-aware naming and metadata later, after core recording is stable.
- Add exports to Markdown/Google Docs/Notion after transcript quality is solid.

### P4: Polish And Studio Features

- Add blur, cursor emphasis, click highlights, crop, trim, captions, and
  background/padding controls.
- Add screenshot capture only after recording and sharing are robust.
- Consider desktop app only when browser constraints block quality or global
  overlays.

## Product Stance

Capca should not race Loom feature-for-feature or clone Cap's desktop editor.
The elite product path is narrower:

- Web and extension recorder that works every time.
- Drive-backed unlimited free recordings.
- A real personal library and share page.
- Meeting audio that works reliably.
- Transcripts and summaries that turn recordings into usable knowledge.
- Documentation good enough for open-source contributors and self-hosters.

The winning claim is simple:

> Record as much as you want. Keep it in your Google Drive. Share it with a
> polished Capca link.
