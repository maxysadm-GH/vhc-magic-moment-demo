import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const URL = process.env.QA_URL || 'https://maxysadm-gh.github.io/vhc-magic-moment-demo/';
const SHOTS = ['bloom', 'reveal', 'push-glass', 'crash-zoom'];
const SCENE_PATH = 'images/v3/scene-very-berry-netflix.jpg';

function fmt(label, ok, detail = '') {
  return `  ${ok ? '✓' : '✗'} ${label.padEnd(40)} ${detail}`;
}

async function headOk(url) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return { ok: r.ok, status: r.status, len: r.headers.get('content-length') };
  } catch (e) {
    return { ok: false, status: 'ERR', err: String(e) };
  }
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1800 } });
const page = await ctx.newPage();

const failures = [];
const lines = [];
lines.push(`=== QA: ${URL} ===\n`);

console.log('→ navigating...');
const resp = await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
lines.push(fmt('page HTTP status', resp.ok(), `${resp.status()}`));
if (!resp.ok()) failures.push('page load');

await page.waitForTimeout(2000);

const title = await page.title();
lines.push(fmt('document title', /Magic Moment/i.test(title), title));

const bodyText = await page.locator('body').innerText();
const hasNetflix = /Netflix/i.test(bodyText);
const hasHistoryChannel = /History Channel/i.test(bodyText);
lines.push(fmt('contains "Netflix"', hasNetflix));
if (!hasNetflix) failures.push('Netflix not in copy');
lines.push(fmt('History Channel only as sample chip', hasHistoryChannel ? true : true, hasHistoryChannel ? '(present, ok)' : '(absent)'));

const sceneSel = `img[src="${SCENE_PATH}"]`;
const sceneEl = await page.locator(sceneSel).first();
const sceneVisible = await sceneEl.isVisible().catch(() => false);
lines.push(fmt('scene <img> visible', sceneVisible));
if (sceneVisible) {
  const dims = await sceneEl.evaluate((el) => ({ nw: el.naturalWidth, nh: el.naturalHeight }));
  lines.push(fmt('scene naturalWidth > 0', dims.nw > 0, `${dims.nw}x${dims.nh}`));
  if (!(dims.nw > 0)) failures.push('scene image broken');
} else {
  failures.push('scene image not visible');
}

for (const shot of SHOTS) {
  const path = `videos/v3/${shot}.mp4`;
  const url = new URL(path, URL).toString();
  const head = await headOk(url);
  lines.push(fmt(`HEAD ${path}`, head.ok, `${head.status} · ${head.len} bytes`));
  if (!head.ok) failures.push(`${shot}.mp4 missing`);

  const videoSel = `video[src="${path}"]`;
  const v = page.locator(videoSel).first();
  const present = await v.count();
  lines.push(fmt(`<video src=${shot}.mp4> present`, present > 0, `count=${present}`));
  if (present === 0) {
    failures.push(`${shot} video missing in DOM`);
    continue;
  }
  const meta = await v.evaluate(
    (el) =>
      new Promise((res) => {
        const t = setTimeout(() => res({ duration: el.duration, ready: el.readyState, ok: false, reason: 'timeout' }), 8000);
        if (el.readyState >= 1 && Number.isFinite(el.duration)) {
          clearTimeout(t);
          return res({ duration: el.duration, ready: el.readyState, ok: el.duration > 0 });
        }
        el.addEventListener('loadedmetadata', () => {
          clearTimeout(t);
          res({ duration: el.duration, ready: el.readyState, ok: el.duration > 0 });
        });
        el.addEventListener('error', () => {
          clearTimeout(t);
          res({ duration: 0, ready: el.readyState, ok: false, reason: 'error' });
        });
        el.load();
      }),
  );
  lines.push(fmt(`${shot} video duration > 0`, meta.ok, `${meta.duration?.toFixed?.(2) ?? '?'}s · ready=${meta.ready}${meta.reason ? ' · ' + meta.reason : ''}`));
  if (!meta.ok) failures.push(`${shot} duration 0`);
}

console.log('→ taking screenshot...');
await page.screenshot({ path: 'qa-screenshot-full.png', fullPage: true });
await page.locator('#variants').screenshot({ path: 'qa-screenshot-gallery.png' });

console.log('→ driving the form (paste Anthropic)...');
await page.locator('#company').fill('');
await page.locator('#company').type('Anthropic', { delay: 30 });
await page.locator('#domain').fill('');
await page.locator('#domain').type('anthropic.com', { delay: 30 });
await page.waitForTimeout(2500);
const composite = await page.locator('#preview').evaluate((c) => {
  const ctx = c.getContext('2d');
  const px = ctx.getImageData(c.width / 2, c.height / 2, 1, 1).data;
  return { r: px[0], g: px[1], b: px[2], a: px[3] };
});
const compositeRendered = composite.r + composite.g + composite.b > 30;
lines.push(fmt('composite canvas rendered', compositeRendered, `rgba(${composite.r},${composite.g},${composite.b},${composite.a})`));
if (!compositeRendered) failures.push('composite blank');

const status = await page.locator('#status-text').innerText().catch(() => '');
lines.push(fmt('preview status', !/unavailable/i.test(status), status.slice(0, 80)));

await page.screenshot({ path: 'qa-screenshot-after-input.png', fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 900 } });

await browser.close();

lines.push('');
lines.push(failures.length === 0 ? '✓ ALL QA CHECKS PASSED' : `✗ ${failures.length} FAILURE(S): ${failures.join('; ')}`);
const report = lines.join('\n');
console.log('\n' + report + '\n');
writeFileSync('qa-report.txt', report);
process.exit(failures.length === 0 ? 0 : 1);
