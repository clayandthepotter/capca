/**
 * End-to-end test for the Chrome extension against a running web app.
 *
 * Launches real Chrome with the unpacked extension, fake camera/mic, and an
 * auto-accepted screen picker; signs up a fresh account; injects the recorder
 * UI (same code path as the toolbar click); records; asserts every state
 * transition; stops; and verifies the upload produced a working share link.
 *
 * Prereqs: web app on http://localhost:3000 (with docker compose up).
 * Run: node tools/extension-e2e.mjs [--keep-open]
 */
import puppeteer from "puppeteer-core";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXT_PATH = path.join(ROOT, "apps", "extension");
// Chrome for Testing — branded Chrome 137+ ignores --load-extension.
// Install: pnpm dlx @puppeteer/browsers install chrome@stable --path .chrome-for-testing
const CHROME = path.join(
  ROOT,
  ".chrome-for-testing",
  "chrome",
  "win64-150.0.7871.49",
  "chrome-win64",
  "chrome.exe",
);
const APP = "http://localhost:3000";
const KEEP_OPEN = process.argv.includes("--keep-open");

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "  ✓" : "  ✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  userDataDir: mkdtempSync(path.join(tmpdir(), "capca-e2e-")),
  defaultViewport: null,
  args: [
    `--disable-extensions-except=${EXT_PATH}`,
    `--load-extension=${EXT_PATH}`,
    "--auto-select-desktop-capture-source=Entire screen",
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1360,900",
    "--window-position=40,40",
  ],
});

// Collect console output from every extension context (SW, offscreen) for diagnosis.
const extLogs = [];
browser.on("targetcreated", attachLogger);
for (const t of browser.targets()) await attachLogger(t);
async function attachLogger(target) {
  try {
    const url = target.url();
    if (!url.startsWith("chrome-extension://")) return;
    const label = url.includes("offscreen") ? "offscreen" : "sw/page";
    if (target.type() === "service_worker") {
      const w = await target.worker();
      w?.on("console", (m) => extLogs.push(`[sw] ${m.type()}: ${m.text()}`));
    } else {
      const p = await target.page?.();
      p?.on("console", (m) => extLogs.push(`[${label}] ${m.type()}: ${m.text()}`));
      p?.on("pageerror", (e) => extLogs.push(`[${label}] pageerror: ${e.message}`));
    }
  } catch {}
}

try {
  // Grab the extension service worker right after launch (it runs its install
  // event now); the debugger attach from our logger keeps it from idling out.
  const swTarget = await browser.waitForTarget(
    (t) => t.type() === "service_worker" && t.url().startsWith("chrome-extension://"),
    { timeout: 15000 },
  );
  const sw = await swTarget.worker();

  // ---- 1. Sign up so the upload path (not download fallback) is exercised
  const page = await browser.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") extLogs.push(`[app] error: ${m.text()}`);
  });
  await page.goto(`${APP}/signup`, { waitUntil: "networkidle2" });
  const email = `e2e-${Date.now()}@example.com`;
  await page.type('input[placeholder="Name"]', "E2E Bot");
  await page.type('input[type="email"]', email);
  await page.type('input[type="password"]', "password1234");
  await page.click('button[type="submit"]');
  // Next.js routes client-side — wait on the URL, not a navigation event.
  const reachedDashboard = await page
    .waitForFunction(() => location.pathname.startsWith("/dashboard"), {
      timeout: 20000,
    })
    .then(() => true)
    .catch(() => false);
  check("signup + session", reachedDashboard, page.url());

  // ---- 2. Go to a page and inject the recorder UI (same code path as the
  // toolbar click: background's insertCSS + executeScript).
  await page.goto(`${APP}/`, { waitUntil: "networkidle2" });
  await page.bringToFront();
  await sw.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ["content.css"] });
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
  });
  await page.waitForSelector("#__vc_root .vc-bar", { timeout: 5000 });
  check("recorder UI injected", true);

  const bubbleVisible = await page
    .waitForFunction(
      () => {
        const f = document.querySelector("#__vc_root .vc-bubble-frame");
        return f && f.getBoundingClientRect().width > 0;
      },
      { timeout: 5000 },
    )
    .then(() => true)
    .catch(() => false);
  check("camera bubble visible", bubbleVisible);

  // ---- 3. Start recording
  await page.click('#__vc_root [data-action="record"]');

  // Countdown appears, then the button flips to Stop (danger) with a timer.
  const wentRed = await page
    .waitForFunction(
      () =>
        document
          .querySelector('#__vc_root [data-action="record"]')
          ?.classList.contains("vc-btn-danger"),
      { timeout: 20000 },
    )
    .then(() => true)
    .catch(() => false);
  check("record button switched to red Stop", wentRed);
  if (!wentRed) throw new Error("recording never started — see extension logs");

  await sleep(3500);
  const timerText = await page.$eval("#__vc_root .vc-timer", (el) => el.textContent);
  check("timer is counting", /^0:0[2-9]/.test(timerText), `timer=${timerText}`);

  // ---- 4. Pause / resume
  await page.click('#__vc_root [data-action="pause"]');
  await sleep(300);
  const pausedIcon = await page.$eval(
    '#__vc_root [data-action="pause"]',
    (el) => el.innerHTML.includes("M8 5.5"), // play icon path
  );
  check("pause reflects paused state", pausedIcon);
  const tPaused = await page.$eval("#__vc_root .vc-timer", (el) => el.textContent);
  await sleep(1500);
  const tStillPaused = await page.$eval("#__vc_root .vc-timer", (el) => el.textContent);
  check("timer frozen while paused", tPaused === tStillPaused, `${tPaused} vs ${tStillPaused}`);
  await page.click('#__vc_root [data-action="pause"]');
  await sleep(1500);

  // ---- 5. Camera toggle
  const camBtn = await page.$('#__vc_root [data-action="camera"]');
  if (camBtn) {
    await camBtn.click();
    await sleep(300);
    const hidden = await page.$eval(
      "#__vc_root .vc-bubble",
      (el) => getComputedStyle(el).display === "none",
    );
    check("camera toggle hides bubble", hidden);
    await camBtn.click();
  } else {
    check("camera toggle present", false, "no [data-action=camera] button");
  }

  // ---- 6. Stop -> upload -> share tab opens
  const newTabPromise = browser
    .waitForTarget((t) => t.url().includes("/s/"), { timeout: 30000 })
    .catch(() => null);
  await page.click('#__vc_root [data-action="record"]');
  const shareTarget = await newTabPromise;
  check("share link opened after stop", !!shareTarget, shareTarget?.url() ?? "no /s/ tab");

  if (shareTarget) {
    const sharePage = await shareTarget.page();
    await sharePage.waitForSelector("video", { timeout: 10000 });
    // Wait for metadata so we know the stored file is a playable video.
    const videoOk = await sharePage
      .waitForFunction(
        () => {
          const v = document.querySelector("video");
          return v && v.readyState >= 1 && v.duration > 0;
        },
        { timeout: 15000 },
      )
      .then(() => true)
      .catch(() => false);
    check("share page video is playable", videoOk);
  }

  // ---- 7. Recording listed on dashboard
  await page.goto(`${APP}/dashboard`, { waitUntil: "networkidle2" });
  const listed = await page.$$eval("li", (els) =>
    els.some((e) => e.textContent.includes("Recording")),
  );
  check("recording listed in dashboard", listed);
} catch (err) {
  check("run completed", false, err.message);
} finally {
  console.log("\n--- extension logs ---");
  for (const l of extLogs.slice(-40)) console.log(l);
  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n${failed.length === 0 ? "ALL CHECKS PASSED" : `${failed.length}/${results.length} CHECKS FAILED`}`,
  );
  if (!KEEP_OPEN) await browser.close();
  process.exit(failed.length === 0 ? 0 : 1);
}
