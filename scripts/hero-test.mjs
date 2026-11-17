import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const R = {};
for (const w of [1440, 390, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: w === 1440 ? 900 : 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('requestfailed', r => errs.push('REQFAIL ' + r.url()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.waitForFunction(() => { const v = document.querySelector('.hero__video'); return v && v.readyState >= 3 && v.currentTime > 0.3; }, null, { timeout: 30000 }).catch(() => {});
  const r = await p.evaluate(() => {
    const v = document.querySelector('.hero__video'), h = document.querySelector('.hero').getBoundingClientRect(), c = document.querySelector('.hero__cta').getBoundingClientRect(), bs = [...document.querySelectorAll('.hero__cta .btn')].map(x => x.getBoundingClientRect());
    const vr = v?.getBoundingClientRect();
    return { video: v ? { playing: !v.paused, t: +v.currentTime.toFixed(2), size: [v.videoWidth, v.videoHeight], muted: v.muted, loop: v.loop, fit: getComputedStyle(v).objectFit, covers: Math.abs(vr.width - h.width) < 2 && Math.abs(vr.height - h.height) < 2 } : null,
      buttons: [...document.querySelectorAll('.hero__cta .btn')].map(x => x.innerText.trim() + ' -> ' + x.getAttribute('href')), count: document.querySelectorAll('.hero .btn').length,
      ctaCentered: Math.abs((c.left + c.width / 2) - h.width / 2) < 2, buttonsCentre: Math.abs(((bs[0].left + bs[bs.length - 1].right) / 2) - innerWidth / 2) < 3 || bs.length && bs.every(x => Math.abs(x.left + x.width / 2 - innerWidth / 2) < 3), ctaBottomGap: Math.round(h.bottom - c.bottom), stacked: bs[0].top < bs[1].top - 5,
      heroH: Math.round(h.height), overflow: [document.documentElement.scrollWidth, innerWidth], navCta: !!document.querySelector('.nav__cta') };
  });
  await p.screenshot({ path: `shots/hero-${w}.png` });
  r.errs = errs.length; R[w] = r;
  if (w === 1440) {
    await p.click('.hero__cta a[href="#services"]'); await p.waitForTimeout(1200); r.servicesAnchor = Math.abs((await p.locator('#services').boundingBox()).y) < 160;
    await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(500);
    await p.click('.hero__cta a[href="#contact"]'); await p.waitForTimeout(1500); r.contactAnchor = Math.abs((await p.locator('#contact').boundingBox()).y) < 160;
  }
  await p.close();
}
console.log(JSON.stringify(R, null, 1));
const q = await (await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })).newPage();
await q.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await q.waitForTimeout(800);
console.log('reduced:', JSON.stringify(await q.evaluate(() => ({ video: !!document.querySelector('.hero__video'), poster: !!document.querySelector('.hero__poster'), posterBg: getComputedStyle(document.querySelector('.hero__poster')).backgroundImage.slice(0, 40) }))));
await q.screenshot({ path: 'shots/hero-reduced.png' });
// video failure fallback
const f = await b.newPage({ viewport: { width: 1280, height: 800 } }); await f.route('**/zytexa-hero.mp4', r => r.abort()); await f.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await f.waitForTimeout(800);
console.log('video-blocked fallback:', JSON.stringify(await f.evaluate(() => ({ video: !!document.querySelector('.hero__video'), poster: !!document.querySelector('.hero__poster') }))));
await b.close();
