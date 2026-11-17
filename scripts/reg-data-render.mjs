import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.addStyleTag({ content: '.header{position:static!important}.reveal{opacity:1!important;transform:none!important;transition:none!important}' });
const r = await p.evaluate(() => [...document.querySelectorAll('.reg__card')].map(c => ({ title: c.querySelector('h3').innerText, num: c.querySelector('.reg__num')?.innerText, auth: c.querySelector('.reg__auth')?.innerText.replace(/\n/g, ' / '), pills: [...c.querySelectorAll('.reg__status')].map(x => x.innerText), since: c.querySelector('.reg__since')?.innerText, emptyEls: [...c.querySelectorAll('p,span.reg__status')].filter(e => !e.innerText.trim() && !e.classList.contains('reg__rule')).length })));
console.log(JSON.stringify(r, null, 1));
const el = p.locator('.reg'); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: 'shots/reg-populated.png' });
await b.close();
