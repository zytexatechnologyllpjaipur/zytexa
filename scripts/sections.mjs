import { chromium } from 'playwright';
const w = +process.argv[2] || 1440;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50)); } });
await p.waitForTimeout(3000);
const sel = { hero: '#home', why: 'section:has(.eco--stack)', industries: '#industries', roof: 'section:has(.eco--orbit)', ai: 'section:has(.aiv)', faq: '#faq', contact: '#contact' };
for (const [n, s] of Object.entries(sel)) { const el = p.locator(s).first(); await el.scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy({top:0,behavior:'instant'})); await el.screenshot({ path: `shots/s-${n}-${w}.png` }); const bb = await el.boundingBox(); console.log(n, Math.round(bb.height)); }
await b.close();
