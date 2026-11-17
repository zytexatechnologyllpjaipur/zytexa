import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://localhost:5173';
const SERV = 'website-development mobile-app-development ui-ux-web-design e-commerce-solutions digital-marketing google-my-business branding-creative photography-videography crm-erp-solutions data-analytics-ai business-automation cybersecurity-maintenance business-growth-strategy it-consultancy-support'.split(' ');
const IND = 'retail-ecommerce healthcare education real-estate manufacturing-exports hospitality-travel'.split(' ');
const ROUTES = ['/', '/services', ...SERV.map(s => '/services/' + s), '/industries', ...IND.map(s => '/industries/' + s), '/how-we-work', '/about', '/portfolio', '/careers', '/blog', '/contact', '/faq', '/privacy-policy', '/terms-and-conditions', '/refund-policy', '/sitemap'];
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const bad = []; const links = new Set(); let n = 0;
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
for (const path of ROUTES) {
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && !/ERR_ABORTED/.test(m.text()) && errs.push(m.text())); p.on('requestfailed', r => !/ERR_ABORTED/.test(r.failure().errorText) && errs.push('REQFAIL ' + r.url()));
  await p.goto(BASE + path, { waitUntil: 'networkidle' });   // direct load = refresh on a nested route
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 25)); } });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ h1: [...document.querySelectorAll('h1')].map(h => h.innerText.trim()).join(' | '), h1n: document.querySelectorAll('h1').length, notFound: /couldn't find that page/.test(document.body.innerText), title: document.title, ov: document.documentElement.scrollWidth > innerWidth, deadHash: [...document.querySelectorAll('a')].filter(a => a.getAttribute('href') === '#' || !a.getAttribute('href')).length, imgs: [...document.images].filter(i => !i.complete || !i.naturalWidth).length, hrefs: [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href').split('#')[0]), empty: document.querySelector('main').innerText.trim().length < 80 }));
  r.hrefs.forEach(h => links.add(h));
  const problems = [errs.length && 'errs:' + errs[0], r.notFound && 'NOT FOUND', r.h1n !== 1 && 'h1x' + r.h1n, r.ov && 'overflow', r.deadHash && 'deadHash:' + r.deadHash, r.imgs && 'brokenImg:' + r.imgs, r.empty && 'empty'].filter(Boolean);
  n++; if (problems.length) bad.push([path, problems]); else if (path.startsWith('/services/') || path.startsWith('/industries/') || !path.includes('/')) {}
  if (['/', '/services/website-development', '/industries/healthcare', '/blog'].includes(path)) console.log(path, '| h1:', r.h1, '| title:', r.title);
  await p.close();
}
console.log('routes loaded:', n, '| with problems:', JSON.stringify(bad));
const known = new Set(ROUTES); const unknown = [...links].filter(h => !known.has(h));
console.log('distinct internal link targets found:', links.size, '| not in route list:', JSON.stringify(unknown));
await b.close();
