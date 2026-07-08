const el = {
  status: document.getElementById("status"),
  mode: document.getElementById("mode"),
  mic: document.getElementById("mic"),
  camera: document.getElementById("camera"),
  primary: document.getElementById("primary"),
  controls: document.getElementById("open-controls"),
  message: document.getElementById("message"),
};

let currentStatus = { phase: "idle" };

function send(message) {
  return chrome.runtime.sendMessage(message).catch((err) => {
    el.message.textContent = err?.message ?? String(err);
  });
}

async function activeTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
}

async function showControls() {
  const tabId = await activeTabId();
  if (tabId == null) return;
  await chrome.tabs
    .sendMessage(tabId, { type: "vc:show-controls", status: currentStatus })
    .catch(() => {
      el.message.textContent = "Open a normal web page before showing controls.";
    });
}

function render(status) {
  currentStatus = status ?? { phase: "idle" };
  const phase = currentStatus.phase;
  const active = phase === "recording" || phase === "paused";

  el.primary.disabled = phase === "creating" || phase === "uploading";
  el.primary.classList.toggle("stop", active);
  el.primary.textContent = active
    ? "Stop recording"
    : phase === "creating"
      ? "Starting..."
      : phase === "uploading"
        ? "Uploading..."
        : "Start recording";

  el.mode.disabled = active || phase === "creating" || phase === "uploading";
  el.mic.disabled = phase === "creating" || phase === "uploading";
  el.camera.disabled = phase === "creating" || phase === "uploading";

  el.status.textContent =
    phase === "recording"
      ? "Recording"
      : phase === "paused"
        ? "Paused"
        : phase === "uploading"
          ? "Uploading recording"
          : phase === "error"
            ? "Error"
            : "Ready to record";

  if (currentStatus.error) {
    el.message.textContent = currentStatus.error;
  } else if (currentStatus.shareUrl) {
    el.message.textContent = "Link opened in a new tab.";
  } else if (currentStatus.savedLocally) {
    el.message.textContent = "Saved locally because no signed-in session was found.";
  } else if (phase !== "error") {
    el.message.textContent = "";
  }
}

el.primary.addEventListener("click", async () => {
  const phase = currentStatus.phase;
  if (phase === "recording" || phase === "paused") {
    await send({ type: "vc:stop-recording" });
    return;
  }

  await send({
    type: "vc:start-recording",
    mode: el.mode.value,
    withMic: el.mic.checked,
    withCamera: el.camera.checked,
  });
  await showControls();
});

el.controls.addEventListener("click", () => {
  void showControls();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "vc:status") render(msg.status);
});

send({ type: "vc:get-status" }).then((response) => {
  render(response?.status ?? { phase: "idle" });
});
