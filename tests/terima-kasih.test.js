/* Uji halaman terima-kasih.html. Jalankan: node tests/terima-kasih.test.js
   Butuh Playwright + Chromium (sudah terpasang di lingkungan cloud). SHOT_DIR=folder untuk menyimpan screenshot. */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8800 + Math.floor(Math.random() * 100);
const BASE = `http://127.0.0.1:${PORT}/terima-kasih.html`;
const CFG = {
  aktif: true,
  url: 'https://hktracker.mjgs.my.id',
  judul: 'Terima Kasih',
  pesan: 'HK Tracker sudah pindah ke aplikasi baru. Terima kasih sudah menjadi bagian dari pengembangan aplikasi ini!',
  dari: 'Aldifi',
  alihkan_detik: 0,
};

let failed = 0;
function check(name, cond, info) {
  if (cond) console.log('  ok   ' + name);
  else { failed++; console.log('  FAIL ' + name + (info !== undefined ? ' → ' + JSON.stringify(info) : '')); }
}

async function open(browser, opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 390, height: 844 },
    deviceScaleFactor: opts.dpr || 1,
    reducedMotion: opts.reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const cfg = Object.assign({}, CFG, opts.cfg || {});
  if (opts.dropDari) delete cfg.dari;
  await page.route('**/pindah.json*', (r) => r.fulfill({ json: cfg }));
  if (opts.noFonts) await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto(BASE);
  return { ctx, page };
}

async function normalChecks(page, label) {
  check(`${label}: svg#scene ada`, (await page.locator('svg#scene').count()) === 1);
  await page.waitForTimeout(3500);
  check(`${label}: tombol terlihat ≤3,5 dtk`, await page.locator('#go').isVisible());
  check(`${label}: href tombol`, (await page.getAttribute('#go', 'href')) === CFG.url);
  check(`${label}: nama Aldifi`, (await page.textContent('#dari')).trim() === 'Aldifi');
  check(`${label}: pesan pindah`, (await page.textContent('#pesan')).includes('sudah pindah ke aplikasi baru'));
  const txt = await page.evaluate(() => document.body.innerText);
  check(`${label}: tanpa —/Salam hangat/Housekeeping`, !/—|Salam hangat|Housekeeping/.test(txt), txt);
}

(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 800));
  const browser = await chromium.launch();
  try {
    console.log('normal');
    let { ctx, page } = await open(browser, { dpr: process.env.SHOT_DIR ? 2 : 1 });
    await normalChecks(page, 'normal');
    if (process.env.SHOT_DIR) {
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(process.env.SHOT_DIR, 'terima-kasih.png') });
    }
    await page.setViewportSize({ width: 360, height: 740 });
    await page.waitForTimeout(200);
    const ov = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    check('normal: tanpa scroll horizontal di 360px', ov[0] <= ov[1], ov);
    await ctx.close();

    console.log('reduced');
    ({ ctx, page } = await open(browser, { reduced: true }));
    await page.waitForTimeout(300);
    check('reduced: tombol langsung terlihat', await page.locator('#go').isVisible());
    const ops = await page.evaluate(() => ['#judul', '#pesan', '#dari', '#go', '#scene'].map((s) => {
      const e = document.querySelector(s); return e ? getComputedStyle(e).opacity : 'missing'; }));
    check('reduced: semua opacity 1', ops.every((o) => o === '1'), ops);
    await ctx.close();

    console.log('noDari');
    ({ ctx, page } = await open(browser, { dropDari: true }));
    await page.waitForTimeout(1000);
    check('noDari: tanda tangan tersembunyi', !(await page.locator('#sign').isVisible()));
    await ctx.close();

    console.log('noUrl');
    ({ ctx, page } = await open(browser, { cfg: { url: '' } }));
    await page.waitForTimeout(3500);
    check('noUrl: tombol tersembunyi', !(await page.locator('#actions').isVisible()));
    await ctx.close();

    console.log('noFonts');
    ({ ctx, page } = await open(browser, { noFonts: true }));
    await normalChecks(page, 'noFonts');
    await ctx.close();

    console.log('landscape');
    ({ ctx, page } = await open(browser, { viewport: { width: 844, height: 390 } }));
    await page.waitForTimeout(3500);
    await page.locator('#go').scrollIntoViewIfNeeded();
    check('landscape: tombol bisa dijangkau', await page.locator('#go').isVisible());
    const box = await page.locator('#go').boundingBox();
    check('landscape: tombol di dalam layar', !!box && box.y >= 0 && box.y + box.height <= 390, box);
    await ctx.close();
  } finally {
    await browser.close();
    srv.kill();
  }
  console.log(failed ? `\n${failed} gagal` : '\nsemua lolos');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
