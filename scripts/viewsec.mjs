import { chromium } from 'playwright';
const [w, h] = (process.argv[2] || '1440x900').split('x').map(Number);
const SEL = { hero: '#home', ai: '#ai', services: '#services', process: '#process', why: '#about', industries: '#industries', roof: 'section:has(.eco--orbit)', reviews: 'section.rv', contact: '#contact', cta: '.section--cta', footer: 'footer' };
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: h } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50)); } });
await p.waitForTimeout(2500);
await p.addStyleTag({ content: '.header{position:static !important} .reveal{opacity:1 !important;transform:none !important;transition:none !important}' });
for (const [n, s] of Object.entries(SEL)) { const bb = await p.evaluate((q) => { const r = document.querySelector(q).getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: innerWidth, height: r.height }; }, s); await p.screenshot({ path: `shots/v-${w}-${n}.png`, fullPage: true, clip: bb, animations: 'disabled' }); }
await b.close();
