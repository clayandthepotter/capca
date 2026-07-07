// Service worker: orchestrates capture. UI lives in the content script,
// recording happens in the offscreen document (MediaRecorder can't run here).

let recordingTabId = null;

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || tab.url?.startsWith("chrome://")) return;
  await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ["content.css"] });
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
});

async function ensureOffscreen() {
  const has = await chrome.offscreen.hasDocument?.();
  if (has) return;
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["USER_MEDIA", "DISPLAY_MEDIA"],
    justification: "Record the selected screen with MediaRecorder",
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "vc:start-recording") {
    const tab = sender.tab;
    recordingTabId = tab?.id ?? null;
    chrome.desktopCapture.chooseDesktopMedia(
      ["screen", "window", "tab", "audio"],
      tab,
      async (streamId, options) => {
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
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === "vc:stop-recording") {
    chrome.runtime.sendMessage({ type: "vc:offscreen-stop" });
  }

  if (msg.type === "vc:recording-started") {
    notifyTab(msg);
  }

  if (msg.type === "vc:recording-complete") {
    chrome.downloads.download({
      url: msg.blobUrl,
      filename: `recording-${Date.now()}.webm`,
      saveAs: true,
    });
    notifyTab({ type: "vc:recording-complete" });
  }

  if (msg.type === "vc:recording-error") {
    notifyTab(msg);
  }
});

function notifyTab(msg) {
  if (recordingTabId != null) {
    chrome.tabs.sendMessage(recordingTabId, msg).catch(() => {});
  }
}
