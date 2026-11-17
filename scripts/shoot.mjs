import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:5173/';
const widths = [360, 390, 430, 768, 1024, 1280, 1440, 1920];
const b = await chromium.launch();
const errors = [];
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  p.on('console', (m) => m.type() === 'error' && errors.push(`${w}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${w}: ${e.message}`));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo({top:y,behavior:'instant'}); await new Promise(r => setTimeout(r, 60)); } window.scrollTo({top:0,behavior:'instant'}); });
  await p.waitForTimeout(800);
  const over = await p.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const bad = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > W + 1 || r.left < -1) && !e.closest('.clients__list'); }).slice(0, 5).map(e => e.className?.baseVal ?? e.className);
    return { sw: document.documentElement.scrollWidth, W, bad, h: document.documentElement.scrollHeight };
  });
  console.log(w, JSON.stringify(over));
  await p.screenshot({ path: `shots/full-${w}.png`, fullPage: true });
  await p.close();
}
console.log('errors:', errors.length ? errors : 'none');
await b.close();
