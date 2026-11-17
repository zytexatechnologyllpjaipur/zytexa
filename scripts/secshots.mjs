import { chromium } from 'playwright';
import fs from 'node:fs';
const SEL = { '01-hero': '#home', '02-clients': '.clients', '03-strength': '#strength', '04-services': '#services', '05-process': '#process', '06-why': 'section:has(.eco--stack)', '07-industries': '#industries', '08-hub': '.hubsec', '09-roof': 'section:has(.eco--orbit)', '10-reviews': 'section.rv', '11-ai': 'section:has(.aix)', '12-faq': '#faq', '13-contact': '#contact', '14-cta': '.section--cta', '15-footer': 'footer' };
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1366, 768]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(3000);
  await p.addStyleTag({ content: '.header{position:static !important} .reveal{opacity:1 !important;transform:none !important;transition:none !important}' });
  fs.mkdirSync(`shots/sec-${w}`, { recursive: true });
  for (const [n, s] of Object.entries(SEL)) await p.locator(s).first().screenshot({ path: `shots/sec-${w}/${n}.png` });
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(500);
  await p.screenshot({ path: `shots/sec-${w}/00-first-viewport.png` });
  await p.screenshot({ path: `shots/full2-${w}.png`, fullPage: true });
  console.log(w, h, 'errs', errs.length);
  await p.close();
}
await b.close();
