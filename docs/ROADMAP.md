# Capca Roadmap

Updated: 2026-07-09

Capca's product goal is simple:

> Record as much as you want. Keep every file in your Google Drive. Share a
> polished link when you need one.

This public roadmap keeps the release plan focused on a complete product, not a
demo.

## Product Rules

### Free Means User-Owned

Free users can record without artificial time or count limits when recordings
are stored in their own Google Drive. Capca should not pay video storage or
video delivery costs for unlimited free usage.

Free tier should include:

- Local browser recording.
- Chrome extension recording.
- Export to the user's Google Drive.
- Drive-owned source files.
- Basic personal library metadata.
- Direct Drive file actions: open, copy link, download original.

### Capca-Cost Features Are Paid

Anything that creates real variable cost for Capca belongs behind a paid tier,
a usage quota, or a bring-your-own-provider option.

Paid or quotaed capabilities:

- Capca-hosted video storage.
- Capca-proxied video streaming bandwidth.
- AI transcription, summaries, chapters, action items, and embeddings when
  Capca pays the model provider.
- Large team workspaces and admin controls.
- Automated integrations that create ongoing worker/API costs.
- Long retention of analytics, audit logs, and processing artifacts.
- Priority support and managed deployment help.

Free alternatives can exist when the user brings the paid resource:

- User-owned Google Drive for storage.
- Self-hosted object storage.
- Bring-your-own AI key for local/self-hosted deployments.

## Completion Roadmap

### P0: Trustworthy Capture

- Web and extension recorders support screen, window, and tab selection.
- Camera bubble never appears before recording starts.
- Repeat recording on the same tab works.
- Google Meet participant audio works when tab audio is selected.
- Permission errors explain what happened and how to fix it.
- Recording state is visible everywhere: idle, starting, recording, stopping,
  preview, uploading, ready, failed.

### P1: Google Drive Free Tier

- Google OAuth connection state.
- Minimal Drive scopes.
- Default `Capca Recordings` folder.
- Resumable Drive uploads.
- Local retry/recovery for interrupted uploads.
- Dashboard shows Drive destination, upload progress, and source-file actions.
- Share links use Drive-hosted media without Capca paying streaming bandwidth
  when possible.

### P2: Real Library And Sharing

- Thumbnails, duration, owner, storage destination, share state, and processing
  state.
- Rename, search, filter, delete metadata, open in Drive, copy link, download.
- Public share page with player, title, owner, date, transcript, summary, and
  comments.
- Password and expiry controls before broad team sharing.

### P3: Knowledge Layer

- Transcript generation.
- Summary, chapters, decisions, and action items.
- Search across title, transcript, and summary.
- Google Meet recording recipe.
- Exports to Markdown and Google Docs.

### P4: Teams And Polish

- Workspaces, members, and roles.
- Workspace-level Drive/storage defaults.
- Custom branding and domains.
- Cursor emphasis, click highlights, blur, crop, trim, captions, and screenshots.
- Desktop app only if browser limitations block quality or overlays.

## Quality Bar

A feature is not complete until it has:

- A clear UI state.
- A recoverable failure mode.
- A meaningful empty/loading/error state.
- A repeatable manual or automated verification path.
- Documentation when setup, permissions, pricing, or data ownership changes.
