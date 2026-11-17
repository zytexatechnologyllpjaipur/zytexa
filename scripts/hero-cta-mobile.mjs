import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
for (const w of [390, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 }, hasTouch: true, isMobile: true }); const e = [];
  p.on('pageerror', x => e.push(x.message));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  for (const [label, href, sel, headSel] of [['Get a Free Consultation', '#contact', '#contact', '#contact h2'], ['Explore Our Services', '#services', '#services', '#services h2']]) {
    await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(400);
    const btn = p.locator(`.hero__cta a[href="${href}"]`); await btn.scrollIntoViewIfNeeded();
    const bb = await btn.boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await p.waitForTimeout(1800);
    const r = await p.evaluate(({ sel, headSel }) => { const hdr = document.querySelector('header').getBoundingClientRect(); const s = document.querySelector(sel).getBoundingClientRect(); const h = document.querySelector(headSel).getBoundingClientRect(); return { hash: location.hash, headerBottom: Math.round(hdr.bottom), sectionTop: Math.round(s.top), headingTop: Math.round(h.top), headingVisible: h.top >= hdr.bottom - 1 && h.bottom <= innerHeight, sectionInView: s.top < innerHeight && s.bottom > hdr.bottom }; }, { sel, headSel });
    console.log(w, label, JSON.stringify(r), 'ok:', r.hash === href && r.headingVisible && r.sectionInView);
    await p.screenshot({ path: `shots/cta-${w}-${href.slice(1)}.png` });
  }
  console.log(w, 'pageerrors', e.length, '| overflow', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]));
  await p.close();
}
await b.close();
