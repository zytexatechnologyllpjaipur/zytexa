import { chromium } from 'playwright';
const w = +process.argv[2] || 390;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50)); } });
await p.waitForTimeout(2500);
await p.addStyleTag({ content: '.header{position:static !important} .reveal{opacity:1 !important;transform:none !important}' });
const sel = { hero: '#home', clients: '.clients', services: '#services', process: '#process', industries: '#industries', hub: '.hubsec', roof: 'section:has(.eco--orbit)', ai: 'section:has(.aix)' };
for (const [n, s] of Object.entries(sel)) { await p.locator(s).first().screenshot({ path: `shots/z-${n}-${w}.png` }); }
await b.close();
