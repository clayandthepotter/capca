// Runs on the extension origin inside the bubble iframe. Requesting camera AND
// mic here grants both permissions to the extension origin in one prompt, so
// the offscreen recorder can later open the mic without prompting.
//
// The recorder captures this bubble as part of the tab/screen video, while mic
// audio is captured separately in the offscreen document. A tiny visual delay
// keeps the presenter bubble aligned with the separately captured mic track.
const CAMERA_VIDEO_DELAY_MS = 120;

(async () => {
  const msg = document.querySelector(".msg");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 640 },
      audio: true,
    });
    // Mic is only needed at record time (in the offscreen doc); release it here.
    stream.getAudioTracks().forEach((t) => t.stop());

    const video = document.createElement("video");
    video.srcObject = new MediaStream(stream.getVideoTracks());
    video.muted = true;
    video.playsInline = true;
    await video.play();

    if (!("requestVideoFrameCallback" in video)) {
      msg.replaceWith(video);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      msg.replaceWith(video);
      return;
    }

    const size = 640;
    canvas.width = size;
    canvas.height = size;
    msg.replaceWith(canvas);

    function scheduleFrame() {
      video.requestVideoFrameCallback(() => {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          createImageBitmap(video)
            .then((frame) => {
              setTimeout(() => {
                ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
                frame.close();
              }, CAMERA_VIDEO_DELAY_MS);
            })
            .catch(() => {});
        }
        scheduleFrame();
      });
    }

    scheduleFrame();
  } catch (err) {
    msg.textContent =
      err && err.name === "NotAllowedError"
        ? "Camera blocked. Allow it for this extension in Chrome settings."
        : `Camera error: ${err?.message ?? err}`;
  }
})();
