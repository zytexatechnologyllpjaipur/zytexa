import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const e = [];
  p.on('pageerror', x => e.push(x.message)); p.on('console', m => m.type() === 'error' && e.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
  const info = await p.evaluate(() => [...document.querySelectorAll('.industry')].map(c => ({ title: c.querySelector('h3').innerText, desc: c.querySelector('p').innerText, img: c.querySelector('img')?.getAttribute('src'), alt: c.querySelector('img')?.getAttribute('alt'), svgLeft: c.querySelectorAll('svg').length })));
  if (w === 1440) console.log(JSON.stringify(info, null, 0));
  // reach every card with the carousel controls
  await p.evaluate(() => document.querySelector('#industries').scrollIntoView({ block: 'center' }));
  const seen = new Set();
  const imgs = await p.evaluate(async () => { const t = document.querySelector('.ind__track'); for (let x = 0; x <= t.scrollWidth; x += 200) { t.scrollTo({ left: x, behavior: 'instant' }); await new Promise(r => setTimeout(r, 120)); } t.scrollTo({ left: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 600)); return [...document.querySelectorAll('.industry img')].map(i => [i.getAttribute('src'), i.complete && i.naturalWidth > 0, i.naturalWidth]); });
  console.log(w, 'images loaded:', imgs.filter(i => i[1]).length + '/' + imgs.length, imgs.filter(i => !i[1]).map(i => i[0]));
  for (let k = 0; k < 14; k++) {
    const vis = await p.evaluate(() => { const t = document.querySelector('.ind__track'), tr = t.getBoundingClientRect(); return [...t.children].filter(c => { const r = c.getBoundingClientRect(); return r.left >= tr.left - 2 && r.right <= tr.right + 2; }).map(c => c.querySelector('h3').innerText); });
    vis.forEach(v => seen.add(v));
    if (await p.locator('[aria-label="Next industries"]').isDisabled()) break;
    await p.click('[aria-label="Next industries"]'); await p.waitForTimeout(550);
  }
  console.log(w, 'reachable cards:', seen.size, '| overflow', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]), '| errs', e.length);
  await p.close();
}
await b.close();
