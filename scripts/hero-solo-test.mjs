import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
for (const [w, h] of [[1440, 900], [390, 800], [320, 700]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const e = [];
  p.on('pageerror', x => e.push(x.message)); p.on('console', m => m.type() === 'error' && e.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.waitForFunction(() => { const v = document.querySelector('.hero__video'); return v && v.currentTime > 0.3; }, null, { timeout: 30000 }).catch(() => {});
  const r = await p.evaluate(() => { const hero = document.querySelector('.hero'), g = document.querySelector('.hero .globe'), hr = hero.getBoundingClientRect(), gr = g.getBoundingClientRect(), v = document.querySelector('.hero__video'), cta = [...document.querySelectorAll('.hero__cta .btn')];
    return { texts: { h1: hero.querySelectorAll('h1').length, eyebrow: hero.querySelectorAll('.eyebrow,.lead').length, labels: hero.querySelectorAll('.globe__label').length, logo: hero.querySelectorAll('.globe__logo,.globe__ai').length, scroll: hero.querySelectorAll('.globe__scroll').length, links: [...hero.querySelectorAll('a,button')].map(x => x.innerText.trim() + '->' + x.getAttribute('href')) },
      video: v && { playing: !v.paused, covers: Math.abs(v.getBoundingClientRect().height - hr.height) < 2 }, heroH: Math.round(hr.height), globe: { w: Math.round(gr.width), h: Math.round(gr.height), centered: Math.abs(gr.left + gr.width / 2 - innerWidth / 2) < 3 }, ctaBelowGlobe: cta[0].getBoundingClientRect().top >= gr.bottom - 2,
      ctaCentered: cta.every(x => Math.abs(x.getBoundingClientRect().left + x.getBoundingClientRect().width / 2 - innerWidth / 2) < 3) || Math.abs(((cta[0].getBoundingClientRect().left + cta[cta.length - 1].getBoundingClientRect().right) / 2) - innerWidth / 2) < 3, overflow: [document.documentElement.scrollWidth, innerWidth], broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).length }; });
  console.log(w, JSON.stringify(r), 'errs', e.filter(x => !/ERR_ABORTED/.test(x)).length);
  await p.screenshot({ path: `shots/heros-${w}.png` });
  if (w === 1440) { for (const href of ['#services', '#contact']) { await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(400); await p.click(`.hero__cta a[href="${href}"]`); await p.waitForTimeout(1300); console.log('anchor', href, Math.abs((await p.locator(href).boundingBox()).y) < 160); } }
  await p.close();
}
const q = await (await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })).newPage(); await q.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await q.waitForTimeout(600);
console.log('reduced:', JSON.stringify(await q.evaluate(() => ({ video: !!document.querySelector('.hero__video'), poster: !!document.querySelector('.hero__poster') }))));
await b.close();
