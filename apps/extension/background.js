// Service worker: orchestrates capture and upload. UI lives in the content
// script; recording happens in the offscreen document (no DOM/media APIs here).

// Where to try uploading finished recordings (first one that has a session wins).
const API_BASES = ["http://localhost:3000", "https://capca-cam.vercel.app"];

let recordingTabId = null;

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  // Don't gate on tab.url — it's only populated for origins we hold host
  // permissions on. activeTab grants injection rights on whatever tab was
  // clicked; restricted pages (chrome://, Web Store) just throw, so catch.
  try {
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ["content.css"] });
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
  } catch {
    // page doesn't allow extension scripts — nothing to do
  }
});

async function ensureOffscreen() {
  // Always start from a fresh offscreen document so no state (or stale code
  // from a previous extension version) leaks between recordings.
  if (await chrome.offscreen.hasDocument?.()) {
    await chrome.offscreen.closeDocument().catch(() => {});
  }
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["USER_MEDIA", "DISPLAY_MEDIA"],
    justification: "Record the selected screen with MediaRecorder",
  });
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.type) {
    case "vc:start-recording": {
      recordingTabId = sender.tab?.id ?? null;
      console.log("[capca] start requested from tab", recordingTabId);
      try {
        // NOTE: no targetTab argument — passing one binds the streamId to that
        // tab's origin, and consuming it from the offscreen document then fails
        // with "Error starting tab capture". Omitting it issues the streamId to
        // the extension itself, which is what the offscreen recorder needs.
        chrome.desktopCapture.chooseDesktopMedia(
          ["screen", "window", "tab", "audio"],
          async (streamId, options) => {
            console.log("[capca] picker result:", streamId ? "granted" : "cancelled");
            if (!streamId) {
              notifyTab({ type: "vc:recording-cancelled" });
              return;
            }
            await ensureOffscreen();
            chrome.runtime.sendMessage({
              type: "vc:offscreen-start",
              streamId,
              withMic: msg.withMic,
              withSystemAudio: options?.canRequestAudioTrack ?? false,
            });
          }
        );
      } catch (err) {
        console.error("[capca] chooseDesktopMedia failed:", err);
        notifyTab({ type: "vc:recording-error", error: `open picker: ${err.message}` });
      }
      break;
    }
    case "vc:stop-recording":
    case "vc:pause-recording":
    case "vc:resume-recording":
    case "vc:set-mic": {
      // relay control messages to the offscreen document
      chrome.runtime.sendMessage({ ...msg, type: msg.type.replace("vc:", "vc:offscreen-") });
      break;
    }
    case "vc:recording-started":
    case "vc:recording-paused":
    case "vc:recording-resumed":
    case "vc:recording-error": {
      notifyTab(msg);
      break;
    }
    case "vc:recording-complete": {
      void handleRecordingComplete(msg);
      break;
    }
  }
});

/** Try uploading to the Capca API (uses the browser session cookie). Falls back to download. */
async function handleRecordingComplete({ blobUrl, mimeType }) {
  notifyTab({ type: "vc:upload-started" });
  try {
    const blob = await fetch(blobUrl).then((r) => r.blob());

    for (const base of API_BASES) {
      try {
        const create = await fetch(`${base}/api/recordings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: `Recording ${new Date().toLocaleString()}`,
            mimeType: mimeType || "video/webm",
          }),
        });
        if (create.status === 401) continue; // not signed in here — try next base
        if (!create.ok) continue;

        const { id, uploadUrl, shareUrl } = await create.json();
        const put = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": mimeType || "video/webm" },
          body: blob,
        });
        if (!put.ok) throw new Error(`upload failed: ${put.status}`);

        await fetch(`${base}/api/recordings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sizeBytes: blob.size }),
        });

        const absolute = `${base}${shareUrl}`;
        notifyTab({ type: "vc:upload-complete", shareUrl: absolute });
        chrome.tabs.create({ url: absolute });
        return;
      } catch {
        // network error against this base — try the next one
      }
    }

    // No session anywhere — keep the recording locally.
    notifyTab({ type: "vc:upload-skipped" });
    await chrome.downloads.download({
      url: blobUrl,
      filename: `capca-recording-${Date.now()}.webm`,
      saveAs: true,
    });
  } catch (err) {
    notifyTab({ type: "vc:recording-error", error: String(err) });
  }
}

function notifyTab(msg) {
  if (recordingTabId != null) {
    chrome.tabs.sendMessage(recordingTabId, msg).catch(() => {});
  }
}
