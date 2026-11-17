import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 1280, 1024, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.header{position:static !important} .reveal{opacity:1 !important;transform:none !important}' });
  await p.waitForTimeout(1500);
  const m = await p.evaluate(() => { const W = innerWidth; const clipped = [...document.querySelectorAll('.eco__chip,.globe__label,.aix__chip,.industry,.btn,.cx__info,.cx__form,.faq__item')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > W + 1 || r.left < -1) && !e.closest('.ind__track'); }).length; return { sw: document.documentElement.scrollWidth, W, h: document.documentElement.scrollHeight, clipped }; });
  console.log(w, JSON.stringify(m), 'errs', errs.length);
  await p.screenshot({ path: `shots/vp-${w}.png`, fullPage: true }); await p.close();
}
await b.close();
