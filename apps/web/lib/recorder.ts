/**
 * CompositeRecorder — draws the shared screen and a circular camera bubble
 * onto a canvas, mixes mic + display audio, and records the result with
 * MediaRecorder. Produces a single WebM blob.
 *
 * The bubble position is read from a mutable ref-like object each frame so
 * the UI can drag it while recording.
 */

export interface BubbleState {
  /** Bubble center, normalized 0..1 relative to canvas width/height. */
  x: number;
  y: number;
  /** Bubble diameter as a fraction of canvas height. */
  size: number;
  visible: boolean;
}

export interface CompositeRecorderOptions {
  screen: MediaStream;
  camera: MediaStream | null;
  mic: MediaStream | null;
  bubble: BubbleState;
  fps?: number;
  onScreenEnded?: () => void;
}

function pickMimeType(): string {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

function createLowLatencyAudioContext() {
  try {
    return new AudioContext({ latencyHint: 0.003 });
  } catch {
    return new AudioContext({ latencyHint: "interactive" });
  }
}

async function attachVideo(stream: MediaStream): Promise<HTMLVideoElement> {
  const video = document.createElement("video");
  video.srcObject = stream;
  video.muted = true;
  video.playsInline = true;
  await video.play();
  return video;
}

export class CompositeRecorder {
  readonly bubble: BubbleState;

  private opts: CompositeRecorderOptions;
  private canvas = document.createElement("canvas");
  private ctx: CanvasRenderingContext2D;
  private screenVideo: HTMLVideoElement | null = null;
  private cameraVideo: HTMLVideoElement | null = null;
  private audioCtx: AudioContext | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private rafId = 0;
  private stopped = false;

  constructor(opts: CompositeRecorderOptions) {
    this.opts = opts;
    this.bubble = opts.bubble;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
  }

  get mimeType(): string {
    return this.recorder?.mimeType ?? "video/webm";
  }

  async start(): Promise<void> {
    const { screen, camera, mic, fps = 30 } = this.opts;

    this.screenVideo = await attachVideo(screen);
    this.canvas.width = this.screenVideo.videoWidth || 1920;
    this.canvas.height = this.screenVideo.videoHeight || 1080;

    if (camera) {
      this.cameraVideo = await attachVideo(camera);
    }

    // Stop automatically when the user hits the browser's "Stop sharing" bar.
    screen.getVideoTracks()[0]?.addEventListener("ended", () => {
      this.opts.onScreenEnded?.();
    });

    const output = new MediaStream(
      this.canvas.captureStream(fps).getVideoTracks(),
    );

    // Preserve native timestamps when there is only one audio source. Web
    // Audio mixing is only needed when mic and display/tab audio both exist.
    const audioSources = [
      ...(mic ? [mic] : []),
      ...(screen.getAudioTracks().length ? [screen] : []),
    ];
    if (audioSources.length === 1) {
      audioSources[0].getAudioTracks().forEach((t) => output.addTrack(t));
    } else if (audioSources.length > 1) {
      this.audioCtx = createLowLatencyAudioContext();
      const dest = this.audioCtx.createMediaStreamDestination();
      for (const s of audioSources) {
        this.audioCtx.createMediaStreamSource(s).connect(dest);
      }
      dest.stream.getAudioTracks().forEach((t) => output.addTrack(t));
      await this.audioCtx.resume();
    }

    this.recorder = new MediaRecorder(output, {
      mimeType: pickMimeType() || undefined,
      videoBitsPerSecond: 8_000_000,
    });
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };

    this.drawLoop();
    // Timesliced chunks are what will later feed multipart uploads (P1).
    this.recorder.start(1000);
  }

  private drawLoop = () => {
    if (this.stopped) return;
    const { ctx, canvas } = this;

    if (this.screenVideo) {
      ctx.drawImage(this.screenVideo, 0, 0, canvas.width, canvas.height);
    }

    const cam = this.cameraVideo;
    if (cam && this.bubble.visible && cam.videoWidth > 0) {
      const d = this.bubble.size * canvas.height;
      const cx = this.bubble.x * canvas.width;
      const cy = this.bubble.y * canvas.height;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Cover the circle with a center-cropped square of the camera frame.
      const side = Math.min(cam.videoWidth, cam.videoHeight);
      const sx = (cam.videoWidth - side) / 2;
      const sy = (cam.videoHeight - side) / 2;
      ctx.drawImage(cam, sx, sy, side, side, cx - d / 2, cy - d / 2, d, d);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(3, d * 0.02);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.stroke();
    }

    this.rafId = requestAnimationFrame(this.drawLoop);
  };

  /** Stops recording and returns the final blob. Streams are left for the caller to clean up. */
  async stop(): Promise<Blob> {
    this.stopped = true;
    cancelAnimationFrame(this.rafId);

    const recorder = this.recorder;
    const blob = await new Promise<Blob>((resolve) => {
      if (!recorder || recorder.state === "inactive") {
        resolve(new Blob(this.chunks, { type: this.mimeType }));
        return;
      }
      recorder.onstop = () =>
        resolve(new Blob(this.chunks, { type: recorder.mimeType }));
      recorder.stop();
    });

    this.audioCtx?.close();
    this.screenVideo?.pause();
    this.cameraVideo?.pause();
    this.screenVideo = this.cameraVideo = null;
    return blob;
  }
}

export function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}
