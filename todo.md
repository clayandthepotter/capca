# Todo

Updated: 2026-07-08

## In Progress

- [ ] Stabilize the Chrome extension refactor so manifest, popup/control UI,
  content script, background status machine, and offscreen recorder agree.
- [ ] Verify the current web record/upload/share/delete loop against local
  Postgres + MinIO.
- [ ] Decide the first competitive wedge: web/extension-first self-hostable
  async video, not desktop Studio Mode parity.

## Next

- [ ] Add extension smoke tests for start, cancel, stop, upload fallback, and
  service-worker restart resync.
- [ ] Make storage object keys respect actual recording format instead of always
  using `.webm`.
- [ ] Add upload-while-recording with resumable local chunk recovery.
- [ ] Add share-page comments, viewer activity, password links, and expiring
  links.
- [ ] Add transcript, summary, and chapter generation after upload.
- [ ] Add thumbnails and Open Graph previews for shared recordings.
- [ ] Add workspace/team model once the individual workflow is reliable.

## Done

- [x] Reviewed the local repo shape and existing Cap architecture notes.
- [x] Compared the current product direction against Cap, Loom, and Bluedot.
- [x] Captured the recommended product positioning and roadmap in
  `docs/PRODUCT_STRATEGY.md`.

