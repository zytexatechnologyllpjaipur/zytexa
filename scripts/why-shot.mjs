import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [320, 390, 1024, 1280, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.header{position:static!important}.reveal{opacity:1!important;transform:none!important;transition:none!important}' });
  const el = p.locator('#about'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await el.screenshot({ path: `shots/whyq-${w}.png` });
  if (w <= 390) { await p.evaluate(() => { document.querySelector('.why-table-wrap').scrollLeft = 9999; }); await p.waitForTimeout(200); await el.screenshot({ path: `shots/whyq-${w}-end.png` }); }
  await p.close();
}
await b.close();
