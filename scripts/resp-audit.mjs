// Responsive audit: page overflow, elements poking outside the viewport, tiny tap targets, broken images, console errors.
import { chromium } from 'playwright';
const WIDTHS = [1440, 1280, 1024, 768, 390, 320];
const b = await chromium.launch(); const out = [];
for (const w of WIDTHS) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('requestfailed', r => errs.push('REQFAIL ' + r.url()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 40)); } scrollTo({ top: 0, behavior: 'instant' }); });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const W = innerWidth; const sec = e => e.closest('section,header,footer')?.id || e.closest('section,header,footer')?.className.split(' ')[0] || '?';
    const scrollers = '.why-table-wrap,.ind__track,.clients__list,.nav,.rv__row';
    const out = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); if (!r.width || getComputedStyle(e).position === 'fixed') return false; if (e.closest(scrollers) && !e.matches(scrollers)) return false; if (e.closest('svg') && !e.matches('svg')) return false; if (e.closest('.globe,.eco,.cta__bg,.core,.hero')) return r.right > W + 2 && !e.closest('.globe__art,.globe__svg'); return r.right > W + 1 || r.left < -1; }).slice(0, 6).map(e => `${sec(e)}:${e.tagName.toLowerCase()}.${(e.className?.baseVal ?? e.className).toString().split(' ')[0]} L${Math.round(e.getBoundingClientRect().left)} R${Math.round(e.getBoundingClientRect().right)}`);
    const small = [...document.querySelectorAll('a,button,input,select,textarea')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width && cs.visibility !== 'hidden' && (r.height < 28 || r.width < 28) && !e.closest('.dots') && !e.classList.contains('sr-only') && e.type !== 'checkbox'; }).slice(0, 5).map(e => `${sec(e)}:${e.tagName.toLowerCase()}[${(e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 18)}] ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`);
    const textClip = [...document.querySelectorAll('h1,h2,h3,p,li,a,button,label')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible' && !e.closest(scrollers)).slice(0, 4).map(e => `${sec(e)}:${e.tagName.toLowerCase()} "${e.innerText.slice(0, 24)}"`);
    return { sw: document.documentElement.scrollWidth, W, out, small, textClip, brokenImgs: [...document.images].filter(i => i.loading !== 'lazy' && (!i.complete || !i.naturalWidth)).length };
  });
  out.push([w, r, errs.length, errs.slice(0, 2)]);
  console.log(w, 'overflow', r.sw > r.W ? `YES ${r.sw}` : 'no', '| out:', JSON.stringify(r.out), '| small:', JSON.stringify(r.small), '| clip:', JSON.stringify(r.textClip), '| broken', r.brokenImgs, '| errs', errs.length, errs.slice(0, 2));
  await p.screenshot({ path: `shots/r-${w}.png`, fullPage: true }); await p.close();
}
await b.close();
