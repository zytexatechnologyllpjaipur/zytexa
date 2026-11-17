import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await p.locator('.clients').scrollIntoViewIfNeeded();
await p.addStyleTag({ content: '.clients__track{transform:none!important}.clients__list li:nth-child(n+9){display:none}' });
await p.waitForTimeout(300); await p.locator('.clients').screenshot({ path: 'shots/clients-static.png' });
console.log(await p.evaluate(() => [...document.querySelectorAll('.clients__list')[0].querySelectorAll('img')].map(i => i.alt).join(' | ')));
await b.close();
