import { chromium } from 'playwright';
const BASE = 'http://localhost:5173'; const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const R = {};
for (const w of [1440, 768, 390, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && !/ERR_ABORTED|fonts\.g/.test(m.text()) && errs.push(m.text()));
  await p.goto(BASE + '/about', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => { const f = document.querySelector('footer'); const bg = getComputedStyle(f).backgroundColor; const r = f.getBoundingClientRect();
    return { bg, white: bg === 'rgb(255, 255, 255)', overflow: [document.documentElement.scrollWidth, innerWidth], footerOverflow: [...f.querySelectorAll('*')].some(e => e.getBoundingClientRect().right > innerWidth + 1), h4: [...f.querySelectorAll('h4')].map(h => h.innerText), year: f.querySelector('.footer__bar small').innerText, deadHash: [...f.querySelectorAll('a')].filter(a => !a.getAttribute('href') || a.getAttribute('href') === '#').length }; });
  console.log(w, JSON.stringify(r), 'errs', errs.length);
  await f_shot(p, w); await p.close();
}
async function f_shot(p, w) { const el = p.locator('footer'); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: `shots/footer-${w}.png` }); }
// content + hrefs
const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await p.goto(BASE + '/', { waitUntil: 'networkidle' });
R.text = (await p.$eval('footer', f => f.innerText)).replace(/\n+/g, ' | ');
R.links = await p.$$eval('footer a', a => a.map(x => `${x.innerText.trim().replace(/\n/g, ' ')} -> ${x.getAttribute('href')}${x.target ? ' [' + x.target + ' ' + x.rel + ']' : ''}`));
R.socialRendered = await p.locator('.footer__social').count();
// click through every internal footer link from the home page
const internal = await p.$$eval('footer a[href^="/"]', a => [...new Map(a.map(x => [x.getAttribute('href'), x.innerText.trim()])).entries()]);
const results = [];
for (const [href] of internal) { const q = await b.newPage({ viewport: { width: 1280, height: 900 } }); await q.goto(BASE + '/', { waitUntil: 'networkidle' }); await q.click(`footer a[href="${href}"]`); await q.waitForTimeout(500);
  const o = await q.evaluate(() => ({ path: location.pathname, h1: document.querySelector('h1')?.innerText.trim(), nf: /couldn't find that page/.test(document.body.innerText) })); results.push(`${href} => ${o.path} "${o.h1}"${o.nf ? ' NOT FOUND' : ''}${o.path === href ? '' : ' MISMATCH'}`); await q.close(); }
R.clickThrough = results;
// the logo links home
await p.goto(BASE + '/about', { waitUntil: 'networkidle' }); await p.click('footer .footer__brand a'); await p.waitForTimeout(400); R.logoHome = new URL(p.url()).pathname === '/';
// xml sitemap
const x = await p.evaluate(async () => { const t = await (await fetch('/sitemap.xml')).text(); const d = new DOMParser().parseFromString(t, 'application/xml'); return { parseError: !!d.querySelector('parsererror'), urls: d.querySelectorAll('url').length, first: d.querySelector('loc')?.textContent }; }); R.xml = x;
console.log(JSON.stringify(R, null, 1)); await b.close();
