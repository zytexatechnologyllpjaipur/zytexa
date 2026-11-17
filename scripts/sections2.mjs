import { chromium } from 'playwright';
const w = +process.argv[2] || 390;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50)); } });
await p.waitForTimeout(2500);
const sel = { hero: '#home', process: '#process', reviews: 'section.rv', why: 'section:has(.eco--stack)', roof: 'section:has(.eco--orbit)', ai: 'section:has(.aix)' };
for (const [n, s] of Object.entries(sel)) { const e = p.locator(s).first(); await e.scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy({ top: -90, behavior: 'instant' })); await e.screenshot({ path: `shots/m-${n}-${w}.png` }); }
await b.close();
