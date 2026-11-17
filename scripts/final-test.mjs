import { chromium } from 'playwright';
const b = await chromium.launch(); const R = {};
const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = [];
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
R.dupIds = await p.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(e => e.id); return ids.filter((x, i) => ids.indexOf(x) !== i); });
R.globes = await p.evaluate(() => [...document.querySelectorAll('.globe')].map(g => ({ center: g.querySelector('.globe__ai')?.innerText || (g.querySelector('.globe__logo') ? 'logo' : '?'), labels: g.querySelectorAll('.globe__label').length, scroll: !!g.querySelector('.globe__scroll'), aria: g.getAttribute('aria-label').slice(0, 52) })));
R.brokenRefs = await p.evaluate(() => { const bad = []; document.querySelectorAll('.globe svg [fill*="url(#"],.globe svg [filter*="url(#"],.globe svg [clip-path*="url(#"]').forEach(e => { for (const a of ['fill', 'filter', 'clip-path']) { const v = e.getAttribute(a); const m = v && v.match(/url\(#([^)]+)\)/); if (m && !document.getElementById(m[1])) bad.push(m[1]); } }); return bad.length; });
// services
R.services = await p.evaluate(() => [...document.querySelectorAll('.service')].map(c => { const t = c.querySelector('.tools'); const cr = c.getBoundingClientRect(); if (!t) return [c.querySelector('h3').innerText, 'no tools documented']; const tr = t.getBoundingClientRect(); return [c.querySelector('h3').innerText, `logos ${t.querySelectorAll('svg,img').length}, chips ${t.querySelectorAll('.tool--text').length}, gapToBottom ${Math.round(cr.bottom - tr.bottom)}px`]; }));
R.imgs = await p.evaluate(() => [...document.querySelectorAll('.tool img')].map(i => i.complete && i.naturalWidth > 0));
R.unlabelled = await p.evaluate(() => [...document.querySelectorAll('.tool svg,.tool img')].filter(e => !(e.getAttribute('aria-label') || e.getAttribute('alt'))).length);
// process
await p.evaluate(() => document.querySelector('#process').scrollIntoView({ block: 'center' })); await p.mouse.move(5, 5);
const seq = [];
for (let k = 0; k < 8; k++) { await p.waitForTimeout(k ? 2400 : 300); seq.push(await p.evaluate(() => { const a = document.querySelector('.step.is-active'); const f = document.querySelector('.timeline__fill'); const d = a.querySelector('.step__dot').getBoundingClientRect(); const fr = f.getBoundingClientRect(); return `${a.querySelector('h3').innerText} done=${document.querySelectorAll('.step.is-done').length} fillRight=${Math.round(fr.right)} dotX=${Math.round(d.left + d.width / 2)} fillOpacity=${getComputedStyle(f).opacity}`; })); }
R.process = seq;
R.noMovingCircle = { marker: await p.locator('.timeline__marker').count(), proc: await p.locator('.proc').count() };
R.sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); R.errs = errs;
const q = await (await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } })).newPage();
await q.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await q.evaluate(() => document.querySelector('#process').scrollIntoView({ block: 'center' })); await q.waitForTimeout(3000);
R.reduced = await q.evaluate(() => ({ active: document.querySelectorAll('.step.is-active').length, fill: getComputedStyle(document.querySelector('.timeline__fill')).display, running: document.querySelectorAll('.timeline.is-running').length }));
console.log(JSON.stringify(R, null, 1)); await b.close();
