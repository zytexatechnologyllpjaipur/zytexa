import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1280, 768]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('.aix').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(3500);
  await p.locator('.aix').screenshot({ path: `shots/ai-${w}.png` });
  await p.evaluate(() => document.querySelector('.cx').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1200);
  await p.locator('#contact').screenshot({ path: `shots/ct-${w}.png` });
  await p.close();
}
await b.close();
