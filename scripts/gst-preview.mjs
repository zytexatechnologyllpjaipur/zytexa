import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 768, 390, 320]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } }); const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.addStyleTag({ content: '.header{position:static!important}.reveal{opacity:1!important;transform:none!important;transition:none!important}' });
  const info = await p.evaluate(() => { const cards = [...document.querySelectorAll('.reg__card')]; return { links: cards.map(c => { const l = c.querySelector('.reg__link'); const cr = c.getBoundingClientRect(), lr = l.getBoundingClientRect(); return [c.querySelector('h3').innerText, l.tagName, l.innerText.replace(/\s+/g, ' ').trim(), Math.round(cr.bottom - lr.bottom), l.target || '-']; }), overflow: document.documentElement.scrollWidth > innerWidth }; });
  console.log(w, JSON.stringify(info));
  await p.locator('.reg').scrollIntoViewIfNeeded(); await p.locator('.reg').screenshot({ path: `shots/gst-preview-${w}.png` });
  if (w === 1440) { const [pop] = await Promise.all([ctx.waitForEvent('page'), p.locator('.reg__card a.reg__link').click()]); await pop.waitForLoadState(); console.log('opened:', pop.url(), '|', await pop.locator('h1').innerText()); }
  await ctx.close();
}
await b.close();
