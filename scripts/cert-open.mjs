import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
const card = (t) => p.locator('.reg__card').filter({ has: p.locator('h3', { hasText: new RegExp('^' + t.replace(/[/]/g, '\/') + '$') }) });
for (const t of ['LLP', 'MSME / Udyam Registration']) {
  const a = card(t).locator('a.reg__link'); const href = await a.getAttribute('href');
  const res = await ctx.request.get('http://localhost:5173' + href); const buf = await res.body();
  const [pop] = await Promise.all([ctx.waitForEvent('page'), a.click()]);
  await pop.waitForLoadState().catch(() => {});
  console.log(t, '|', href, '| target', await a.getAttribute('target'), await a.getAttribute('rel'), '| GET', res.status(), res.headers()['content-type'], buf.length, buf.slice(0, 5).toString(), '| tab url:', pop.url());
  await pop.close();
}
for (const t of ['Startup India', 'GST Registration']) { const l = card(t).locator('.reg__link'); console.log(t, ':', await l.evaluate(e => e.tagName), '|', await l.innerText(), '| pill:', await card(t).locator('.reg__status').allInnerTexts()); }
await b.close();
