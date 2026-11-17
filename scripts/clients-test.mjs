import { chromium } from 'playwright';
import fs from 'node:fs';
const files = fs.readdirSync('public/client').filter((f) => /\.(png|jpe?g|webp|svg|avif|gif)$/i.test(f));
const b = await chromium.launch();
for (const w of [1440, 1024, 768, 390, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const bad = []; p.on('response', r => { if (r.url().includes('/client/') && r.status() !== 200) bad.push(r.url()); });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.locator('.clients').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  const x = () => p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.clients__track')).transform).m41);
  const x0 = await x(); await p.waitForTimeout(1500); const x1 = await x();
  const info = await p.evaluate(() => ({ first: document.querySelectorAll('.clients__list')[0].children.length, total: document.querySelectorAll('.clients__list li').length, loaded: [...document.querySelectorAll('.clients__list')[0].querySelectorAll('img')].filter(i => i.complete && i.naturalWidth > 0).length, alts: [...document.querySelectorAll('.clients__list')[0].querySelectorAll('img')].filter(i => !i.alt).length, overflow: document.documentElement.scrollWidth > innerWidth }));
  await p.locator('button[aria-label="Next clients"]').click(); await p.waitForTimeout(150); const xn = await x();
  await p.waitForTimeout(900); const xn2 = await x();
  await p.locator('button[aria-label="Previous clients"]').click(); await p.waitForTimeout(1000); const xp = await x();
  await p.hover('.clients__view'); await p.waitForTimeout(1200); const h0 = await x(); await p.waitForTimeout(600); const h1 = await x();
  // wrap check: sample for ~4s of fast frames, look for any jump > 120px between consecutive samples
  await p.mouse.move(5, 5);
  const jumps = await p.evaluate(() => new Promise((res) => { let prev = null, max = 0, n = 0; const el = document.querySelector('.clients__track'); const f = () => { const m = new DOMMatrix(getComputedStyle(el).transform).m41; if (prev !== null) max = Math.max(max, Math.abs(m - prev)); prev = m; if (++n < 240) requestAnimationFrame(f); else res(max); }; f(); }));
  console.log(w, JSON.stringify(info), 'files:', files.length, 'drift/1.5s:', Math.round(x1 - x0), 'afterNextClick:', Math.round(xn2 - xn), 'prev:', Math.round(xp), 'hoverMoved:', Math.abs(h1 - h0).toFixed(1), 'maxFrameJump:', jumps.toFixed(1), 'bad:', bad, 'errs:', errs);
  await p.locator('.clients').screenshot({ path: `shots/clients-${w}.png` }); await p.close();
}
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await p.locator('.clients').scrollIntoViewIfNeeded();
const x = () => p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.clients__track')).transform).m41);
await p.waitForTimeout(800); const a = await x(); await p.waitForTimeout(1500); const c = await x();
await p.locator('button[aria-label="Next clients"]').click(); await p.waitForTimeout(1200); const d = await x();
console.log('reduced-motion: autoMoved', Math.abs(c - a) > 1, '| arrow still works', Math.abs(d - c) > 20);
await b.close();
