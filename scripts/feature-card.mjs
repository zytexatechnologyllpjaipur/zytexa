import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const e = [];
  p.on('pageerror', x => e.push(x.message)); p.on('console', m => m.type() === 'error' && e.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.header{position:static!important}.reveal{opacity:1!important;transform:none!important;transition:none!important}' });
  const m = await p.evaluate(() => { const c = document.querySelector('.service--feature'), r = c.getBoundingClientRect(), n = c.nextElementSibling.getBoundingClientRect(), o = document.querySelectorAll('.service--feature').length; const prev = c.previousElementSibling.getBoundingClientRect(); return { featureCards: o, h: Math.round(r.height), sameRowHeightAsNeighbour: Math.round(r.height) === Math.round(n.height) || Math.round(r.height) === Math.round(prev.height), sw: [document.documentElement.scrollWidth, innerWidth], title: c.querySelector('h3').innerText }; });
  const bb = await p.evaluate(() => { const r = document.querySelector('.service--feature').getBoundingClientRect(); return { x: Math.max(0, r.left - 20), y: r.top + scrollY - 20, width: Math.min(innerWidth, r.width + 40), height: r.height + 40 }; });
  await p.screenshot({ path: `shots/feat-${w}.png`, fullPage: true, clip: bb });
  console.log(w, JSON.stringify(m), 'errs', e.length); await p.close();
}
await b.close();
