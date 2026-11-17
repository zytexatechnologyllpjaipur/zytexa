import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://localhost:5173'; const b = await chromium.launch(); const R = {};
const LEGAL = ['/privacy-policy', '/terms-and-conditions', '/refund-policy'];
for (const path of LEGAL) { const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const e = []; p.on('pageerror', x => e.push(x.message)); p.on('console', m => m.type() === 'error' && e.push(m.text()));
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  R['direct ' + path] = await p.evaluate(() => ({ h1: document.querySelector('h1')?.innerText, sections: document.querySelectorAll('.legal__sec').length, tbc: document.querySelectorAll('.legal__tbc').length, banner: !!document.querySelector('.legal__flag'), overflow: document.documentElement.scrollWidth > innerWidth, notFound: /couldn't find/.test(document.body.innerText) })); R['direct ' + path].errs = e.length; await p.close(); }
// footer click-through (both footer link groups) from the homepage and from a nested page
for (const start of ['/', '/services/website-development']) for (const label of ['Privacy Policy', 'Terms & Conditions', 'Refund Policy', 'Privacy', 'Terms']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); await p.goto(BASE + start, { waitUntil: 'networkidle' });
  await p.click(`footer a:text-is("${label}")`); await p.waitForTimeout(400); R[`click ${label} from ${start}`] = new URL(p.url()).pathname + ' | h1: ' + await p.evaluate(() => document.querySelector('h1')?.innerText); await p.close(); }
// old /terms redirects
let p = await b.newPage(); await p.goto(BASE + '/terms', { waitUntil: 'networkidle' }); R['redirect /terms'] = new URL(p.url()).pathname; await p.close();
// contact-form consent link opens the privacy page (not #contact)
p = await b.newPage({ viewport: { width: 1280, height: 800 } }); await p.goto(BASE + '/contact', { waitUntil: 'networkidle' });
R.consentLink = await p.$eval('label[for=agree] a', a => ({ href: a.getAttribute('href'), target: a.target }));
const [pop] = await Promise.all([p.context().waitForEvent('page'), p.click('label[for=agree] a')]); await pop.waitForLoadState(); R.consentOpens = new URL(pop.url()).pathname;
R.checkboxStillUnchecked = !(await p.locator('#agree').isChecked());
// form honesty: valid submit with no endpoint
await p.fill('#name', 'Test User'); await p.fill('#email', 'a@b.co'); await p.fill('#phone', '+91 98765 43210'); await p.selectOption('#service', { index: 1 }); await p.fill('#message', 'Testing the form status.'); await p.check('#agree');
let posts = 0; p.on('request', q => q.method() === 'POST' && posts++); await p.click('.cx__submit'); await p.waitForTimeout(500);
R.formStatus = (await p.locator('.form__status').innerText()).replace(/\s+/g, ' '); R.postRequests = posts;
await b.close(); console.log(JSON.stringify(R, null, 1));
