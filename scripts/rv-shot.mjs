import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 390]) { const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
  await p.locator('section.rv').scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  await p.locator('section.rv').screenshot({ path: `shots/rv-${w}.png` });
  console.log(w, 'errs', errs, 'overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'badText', await p.evaluate(() => /sample review|replace with|lorem|client name/i.test(document.body.innerText)));
  await p.close(); }
await b.close();
