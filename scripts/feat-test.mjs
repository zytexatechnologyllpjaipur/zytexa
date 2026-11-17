import { chromium } from 'playwright';
const b = await chromium.launch(); const R = {};
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
R.removed = { strength: await p.locator('#strength').count(), strengthText: await p.getByText('Our Strength').count(), heroList: await p.locator('.caps').count(), hubsec: await p.locator('.hubsec').count(), industriesHeadings: await p.getByRole('heading', { name: /industries we serve/i }).count() };
R.order = await p.evaluate(() => [...document.querySelectorAll('main > section')].map(s => s.id || s.className.split(' ').filter(c => !c.startsWith('section')).join('.') || '(' + (s.querySelector('h2')?.innerText || '').slice(0, 18) + ')').join(' > '));
R.logos = await p.evaluate(() => ({ svgLogos: document.querySelectorAll('.tool svg').length, textChips: document.querySelectorAll('.tool--text').length, noLabel: [...document.querySelectorAll('.tool svg')].filter(s => !s.getAttribute('aria-label')).length, sample: [...document.querySelectorAll('.tool svg')].slice(0, 4).map(s => s.getAttribute('aria-label')) }));
// process
await p.evaluate(() => document.querySelector('#process').scrollIntoView({ block: 'center' }));
const seq = [];
for (let k = 0; k < 8; k++) { seq.push(await p.evaluate(() => document.querySelector('.proc__node.is-active').getAttribute('aria-label') + ' | ' + document.querySelector('.proc__center h3').innerText + ' | hand ' + document.querySelector('.proc__hand').style.transform)); await p.mouse.move(5, 5); await p.waitForTimeout(3300); }
R.processSeq = seq;
// industries
await p.evaluate(() => document.querySelector('#industries').scrollIntoView({ block: 'center' }));
const st = () => p.evaluate(() => { const t = document.querySelector('.ind__track'); return { left: Math.round(t.scrollLeft), max: t.scrollWidth - t.clientWidth, cards: t.children.length, visible: Math.round(t.clientWidth / t.firstElementChild.getBoundingClientRect().width * 10) / 10, dots: document.querySelectorAll('.ind__ctrl .dots button').length, prevDis: document.querySelector('[aria-label="Previous industries"]').disabled, nextDis: document.querySelector('[aria-label="Next industries"]').disabled }; });
R.ind0 = await st();
for (let k = 0; k < 12 && !(await st()).nextDis; k++) { await p.click('[aria-label="Next industries"]'); await p.waitForTimeout(650); }
R.indEnd = await st();
await p.click('[aria-label="Previous industries"]'); await p.waitForTimeout(650); R.indBack = await st();
await p.locator('.ind__track').focus(); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(650); R.indKey = (await st()).left;
// reviews
await p.evaluate(() => document.querySelector('section.rv').scrollIntoView({ block: 'center' }));
const rv = () => p.evaluate(() => ({ visibleCards: [...document.querySelectorAll('.rv__card')].filter(c => getComputedStyle(c).display !== 'none').length, first: document.querySelector('.rv__card blockquote').innerText.slice(0, 28), dot: [...document.querySelectorAll('.rv .dots button')].findIndex(d => d.classList.contains('is-on')) }));
R.rv0 = await rv(); await p.click('[aria-label="Next reviews"]'); R.rvNext = await rv();
await p.mouse.move(5, 5); await p.waitForTimeout(7200); R.rvAuto = await rv();
for (let k = 0; k < 3; k++) await p.click('[aria-label="Next reviews"]'); R.rvLoop = await rv();
// addresses
R.addr = await p.evaluate(() => [...document.querySelectorAll('.footer__contact .addr')].map(l => l.innerText.replace(/\n/g, ' | ')));
R.addrContact = await p.evaluate(() => [...document.querySelectorAll('.cx__row')].map(l => l.innerText.replace(/\n/g, ' | ')).filter(t => /Office/i.test(t)));
R.mapsLinks = await p.evaluate(() => [...document.querySelectorAll('a[href*="google.com/maps"]')].length);
// anchors
R.anchors = await p.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.querySelector(h)));
R.errs = errs;
console.log(JSON.stringify(R, null, 1));
// reduced motion
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' }); const q = await ctx.newPage();
await q.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await q.evaluate(() => document.querySelector('#process').scrollIntoView({ block: 'center' })); const a1 = await q.locator('.proc__center h3').innerText(); await q.waitForTimeout(4500); const a2 = await q.locator('.proc__center h3').innerText();
await q.locator('.proc__node').nth(3).click();
console.log(JSON.stringify({ reducedProcess_autoAdvance: a1 !== a2, clickedStep: await q.locator('.proc__center h3').innerText(), ctaAnim: await q.evaluate(() => getComputedStyle(document.querySelector('.cta__bg'), '::before').animationName + ' / ' + getComputedStyle(document.querySelector('.cta__bg i')).animationName) }));
await b.close();
