import { chromium } from 'playwright';
const b = await chromium.launch();
const out = {};
for (const [w, h] of [[1440, 900], [1366, 768]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.reveal{opacity:1 !important;transform:none !important}' });
  out[`${w}x${h}`] = await p.evaluate(() => {
    const q = (n, s) => { const e = document.querySelector(s); return e ? [n, Math.round(e.getBoundingClientRect().height)] : [n, null]; };
    return Object.fromEntries([q('header', 'header'), q('hero', '#home'), q('clients', '.clients'), q('strength', '#strength'), q('services', '#services'), q('process', '#process'), q('why', 'section:has(.eco--stack)'), q('industries', '#industries'), q('hub', '.hubsec'), q('roof', 'section:has(.eco--orbit)'), q('reviews', 'section.rv'), q('ai', 'section:has(.aix)'), q('faq', '#faq'), q('contact', '#contact'), q('cta', '.section--cta'), q('footer', 'footer'), ['total', document.documentElement.scrollHeight]]);
  });
  await p.close();
}
console.log(JSON.stringify(out, null, 1)); await b.close();
