import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 768, 390, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } }); const e = [];
  p.on('pageerror', x => e.push(x.message)); p.on('console', m => m.type() === 'error' && !/fonts\.g|ERR_ABORTED/.test(m.text()) && e.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.header{position:static!important}.reveal{opacity:1!important;transform:none!important;transition:none!important}' });
  const r = await p.evaluate(() => { const reg = document.querySelector('.reg'), prev = reg.previousElementSibling, next = reg.nextElementSibling;
    return { prev: prev.id || prev.className.split(' ')[0], nextIsReviews: next.classList.contains('rv'), count: document.querySelectorAll('.reg').length, cards: [...document.querySelectorAll('.reg__card h3')].map(h => h.innerText), numbers: document.querySelectorAll('.reg__num').length, since: document.querySelectorAll('.reg__since').length, pills: [...document.querySelectorAll('.reg__status')].map(x => x.innerText), authority: [...document.querySelectorAll('.reg__auth')].map(x => x.innerText.replace(/\n/g, ' / ')), overflow: [document.documentElement.scrollWidth, innerWidth], cols: getComputedStyle(document.querySelector('.reg__grid')).gridTemplateColumns.split(' ').length }; });
  console.log(w, JSON.stringify(r), 'errs', e.length);
  const el = p.locator('.reg'); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: `shots/reg-${w}.png` }); await p.close();
}
await b.close();
