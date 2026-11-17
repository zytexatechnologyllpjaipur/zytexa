import { chromium } from 'playwright';
const VPS = [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844], [320, 568]];
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
for (const [w, h] of VPS) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const e = [];
  p.on('pageerror', x => e.push(x.message)); p.on('console', m => m.type() === 'error' && !/ERR_ABORTED/.test(m.text()) && e.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.waitForFunction(() => { const v = document.querySelector('.hero__video'); return v && v.currentTime > 0.3; }, null, { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => { const hdr = document.querySelector('header').getBoundingClientRect(), hero = document.querySelector('.hero').getBoundingClientRect(), strap = document.querySelector('.clients').getBoundingClientRect(), v = document.querySelector('.hero__video'), vr = v.getBoundingClientRect(), btns = [...document.querySelectorAll('.hero__cta .btn')].map(x => x.getBoundingClientRect());
    return { navH: Math.round(hdr.height), heroH: Math.round(hero.height), heroTop: Math.round(hero.top), heroBottom: Math.round(hero.bottom), fillsViewport: Math.abs(hero.bottom - innerHeight) <= 1, strapTop: Math.round(strap.top), strapBelowFold: strap.top >= innerHeight - 1, strapDirectlyAfter: Math.abs(strap.top - hero.bottom) <= 1,
      video: { playing: !v.paused, fit: getComputedStyle(v).objectFit, fills: Math.abs(vr.width - hero.width) < 2 && Math.abs(vr.height - hero.height) < 2, natural: [v.videoWidth, v.videoHeight] },
      btnsInView: btns.every(x => x.top >= hdr.bottom && x.bottom <= innerHeight && x.left >= 0 && x.right <= innerWidth), btnCentre: Math.abs(((btns[0].left + btns[btns.length - 1].right) / 2) - innerWidth / 2) < 3, stacked: btns[0].top < btns[1].top - 5, gapBelow: Math.round(hero.bottom - Math.max(...btns.map(x => x.bottom))), links: document.querySelectorAll('.hero a').length, h1: document.querySelectorAll('h1').length, overflow: [document.documentElement.scrollWidth, innerWidth] }; });
  console.log(`${w}x${h}`, JSON.stringify(r), 'errs', e.length);
  await p.screenshot({ path: `shots/hfs-${w}x${h}.png` });
  await p.evaluate(() => scrollTo({ top: innerHeight * 0.55, behavior: 'instant' })); await p.waitForTimeout(500);
  await p.screenshot({ path: `shots/hfs-${w}x${h}-scrolled.png` });
  if (w === 1440 || w === 320) for (const href of ['#services', '#contact']) { await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(400); await p.click(`.hero__cta a[href="${href}"]`); await p.waitForTimeout(1400); console.log('  anchor', href, 'at', w, Math.abs((await p.locator(href).boundingBox()).y) < 170); }
  await p.close();
}
await b.close();
