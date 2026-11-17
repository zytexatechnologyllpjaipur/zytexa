import { chromium } from 'playwright';
const W = +process.argv[2] || 1448;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
await p.waitForTimeout(2500);
await p.addStyleTag({ content: '.header{position:static !important} .reveal{opacity:1 !important;transform:none !important}' });
await p.screenshot({ path: `shots/full-${W}.png`, fullPage: true });
const rects = await p.evaluate(() => {
  const q = (n, s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [n, Math.round(r.top + scrollY), Math.round(r.height)]; };
  return [q('header', 'header'), q('hero', '#home'), q('clients', '.clients'), q('strength', '#strength'), q('services', '#services'), q('process', '#process'),
    q('why', 'section:has(.eco--stack)'), q('industries', '#industries'), q('hub', '.hubsec'), q('roof', 'section:has(.eco--orbit)'), q('reviews', 'section.rv'),
    q('ai', 'section:has(.aix)'), q('faq', '#faq'), q('contact', '#contact'), q('cta', '.section--cta'), q('footer', 'footer'), ['total', 0, document.documentElement.scrollHeight]].filter(Boolean);
});
import('node:fs').then(fs => fs.writeFileSync('shots/rects.json', JSON.stringify(rects))); console.log(JSON.stringify(rects), 'errs', errs.length);
await b.close();
