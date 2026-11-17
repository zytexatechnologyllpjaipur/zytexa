import { chromium } from 'playwright';
const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + .05) / (y + .05)).toFixed(2); };
const blend = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const bg = [10, 28, 70]; // approx. darkest-lightest card/page gradient midpoint
const white = [255, 255, 255];
console.log('contrast on dark card (WCAG AA body = 4.5, large/UI = 3):', JSON.stringify({ heading: ratio(white, bg), authority62: ratio(blend(white, .62, bg), bg), description66: ratio(blend(white, .66, [7, 20, 51]), [7, 20, 51]), regNumLabel50: ratio(blend(white, .5, bg), bg), since72: ratio(blend(white, .72, bg), bg), cyanPill: ratio([79, 227, 245], bg), amberPill: ratio([253, 230, 138], bg), gradientHeadingBlue: ratio([30, 107, 214], [7, 20, 51]) }));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
const r = await p.evaluate(() => { const s = document.querySelector('.reg'); const heads = [...document.querySelectorAll('h1,h2,h3')]; const idx = heads.indexOf(s.querySelector('h2')); return { sectionLabel: s.getAttribute('aria-labelledby'), labelTarget: document.getElementById(s.getAttribute('aria-labelledby'))?.innerText.replace(/\n/g, ' '), headingOrder: heads.slice(idx, idx + 5).map(h => h.tagName), listSemantics: s.querySelector('.reg__grid').tagName + ' > ' + [...s.querySelectorAll('.reg__grid > *')].map(e => e.tagName).join(','), iconsHidden: [...s.querySelectorAll('.reg__ico, .reg__rule, .reg__pill i, .reg__status i')].every(e => e.getAttribute('aria-hidden') === 'true'), svgFocusable: [...s.querySelectorAll('svg')].filter(x => x.getAttribute('focusable') !== 'false').length, focusableInside: s.querySelectorAll('a,button,input,select,textarea,[tabindex]').length, pillText: [...s.querySelectorAll('.reg__status')].map(x => x.innerText) }; });
console.log(JSON.stringify(r));
// keyboard: tab across the page, make sure focus never gets trapped in or lost at the section
await p.evaluate(() => scrollTo(0, 0)); let inReg = 0, steps = 0, seen = new Set();
for (let i = 0; i < 80; i++) { await p.keyboard.press('Tab'); steps++; const t = await p.evaluate(() => { const a = document.activeElement; return a ? (a.closest('.reg') ? 'REG' : a.tagName + ':' + (a.innerText || a.getAttribute('aria-label') || '').slice(0, 20)) : 'none'; }); if (t === 'REG') inReg++; seen.add(t); }
console.log('tab steps', steps, '| focus landed inside .reg:', inReg, '(no interactive content expected)', '| distinct stops', seen.size);
// reduced motion
const q = await (await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })).newPage(); await q.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
console.log('reduced motion:', JSON.stringify(await q.evaluate(() => ({ iconAnim: [...document.querySelectorAll('.reg__ico')].map(e => getComputedStyle(e).animationName), cardTransition: getComputedStyle(document.querySelector('.reg__card')).transitionDuration }))));
await b.close();
