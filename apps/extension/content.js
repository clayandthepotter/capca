// Injected on toolbar click. Renders the draggable camera bubble (an iframe on
// the extension origin, so camera permission is granted once for the extension
// rather than per-site) plus a control bar. Because the bubble is real page
// DOM, the screen capture records it — no compositing needed.

(() => {
  if (document.getElementById("__vc_root")) {
    document.getElementById("__vc_root").remove(); // toggle off
    return;
  }

  let recording = false;

  const root = document.createElement("div");
  root.id = "__vc_root";

  // --- camera bubble ---
  const bubble = document.createElement("div");
  bubble.className = "vc-bubble";
  const frame = document.createElement("iframe");
  frame.src = chrome.runtime.getURL("bubble.html");
  frame.allow = "camera; microphone";
  frame.className = "vc-bubble-frame";
  bubble.appendChild(frame);

  // --- control bar ---
  const bar = document.createElement("div");
  bar.className = "vc-bar";
  const recordBtn = document.createElement("button");
  recordBtn.className = "vc-btn vc-btn-record";
  recordBtn.textContent = "● Record";
  const closeBtn = document.createElement("button");
  closeBtn.className = "vc-btn";
  closeBtn.textContent = "✕";
  bar.append(recordBtn, closeBtn);

  root.append(bubble, bar);
  document.documentElement.appendChild(root);

  recordBtn.addEventListener("click", () => {
    if (!recording) {
      chrome.runtime.sendMessage({ type: "vc:start-recording", withMic: true });
      recordBtn.textContent = "…";
      recordBtn.disabled = true;
    } else {
      chrome.runtime.sendMessage({ type: "vc:stop-recording" });
    }
  });

  closeBtn.addEventListener("click", () => {
    if (recording) chrome.runtime.sendMessage({ type: "vc:stop-recording" });
    root.remove();
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "vc:recording-started") {
      recording = true;
      recordBtn.textContent = "■ Stop";
      recordBtn.disabled = false;
      recordBtn.classList.add("vc-btn-stop");
    }
    if (msg.type === "vc:recording-cancelled" || msg.type === "vc:recording-complete") {
      recording = false;
      recordBtn.textContent = "● Record";
      recordBtn.disabled = false;
      recordBtn.classList.remove("vc-btn-stop");
    }
    if (msg.type === "vc:recording-error") {
      recording = false;
      recordBtn.textContent = "● Record";
      recordBtn.disabled = false;
      alert(`Recording error: ${msg.error}`);
    }
  });

  // --- dragging (bubble and bar share the logic) ---
  for (const el of [bubble, bar]) {
    el.addEventListener("pointerdown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const rect = el.getBoundingClientRect();
      const move = (ev) => {
        el.style.left = `${rect.left + (ev.clientX - startX)}px`;
        el.style.top = `${rect.top + (ev.clientY - startY)}px`;
        el.style.right = "auto";
        el.style.bottom = "auto";
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
  }
})();
