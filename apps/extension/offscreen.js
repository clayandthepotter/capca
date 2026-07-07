// Offscreen document: the only extension context where MediaRecorder +
// getUserMedia can run under MV3. Receives a desktopCapture streamId from the
// background worker, records, and hands back a blob URL for download.

let recorder = null;
let chunks = [];
let streams = [];
let audioCtx = null;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "vc:offscreen-start") start(msg);
  if (msg.type === "vc:offscreen-stop") stop();
});

async function start({ streamId, withMic, withSystemAudio }) {
  try {
    const desktop = await navigator.mediaDevices.getUserMedia({
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: streamId,
          maxFrameRate: 30,
        },
      },
      audio: withSystemAudio
        ? {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: streamId,
            },
          }
        : false,
    });
    streams.push(desktop);

    let mic = null;
    if (withMic) {
      try {
        mic = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        streams.push(mic);
      } catch {
        // No mic permission yet — record without it rather than failing.
      }
    }

    const output = new MediaStream(desktop.getVideoTracks());
    const audioSources = [desktop, mic].filter(
      (s) => s && s.getAudioTracks().length > 0
    );
    if (audioSources.length > 0) {
      audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();
      for (const s of audioSources) {
        audioCtx.createMediaStreamSource(s).connect(dest);
      }
      dest.stream.getAudioTracks().forEach((t) => output.addTrack(t));
    }

    desktop.getVideoTracks()[0].addEventListener("ended", stop);

    chunks = [];
    recorder = new MediaRecorder(output, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm",
      videoBitsPerSecond: 8_000_000,
    });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType });
      chrome.runtime.sendMessage({
        type: "vc:recording-complete",
        blobUrl: URL.createObjectURL(blob),
      });
      cleanup();
    };
    recorder.start(1000);
    chrome.runtime.sendMessage({ type: "vc:recording-started" });
  } catch (err) {
    cleanup();
    chrome.runtime.sendMessage({
      type: "vc:recording-error",
      error: err?.message ?? String(err),
    });
  }
}

function stop() {
  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
  }
}

function cleanup() {
  streams.forEach((s) => s.getTracks().forEach((t) => t.stop()));
  streams = [];
  recorder = null;
  audioCtx?.close();
  audioCtx = null;
}
