import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.clients__list img')].map(i => [i.alt, i.clientWidth, i.clientHeight, i.naturalWidth, i.naturalHeight]))));
await b.close();
