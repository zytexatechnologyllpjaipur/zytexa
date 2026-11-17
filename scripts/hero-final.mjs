import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
for (const [w, h] of [[1440, 900], [390, 800], [320, 700]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); const e = [];
  p.on('pageerror', x => e.push(x.message)); p.on('console', m => m.type() === 'error' && !/ERR_ABORTED/.test(m.text()) && e.push(m.text()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.waitForFunction(() => { const v = document.querySelector('.hero__video'); return v && v.currentTime > 0.3; }, null, { timeout: 30000 }).catch(() => {});
  const r = await p.evaluate(() => { const hero = document.querySelector('.hero'), hr = hero.getBoundingClientRect(), btns = [...hero.querySelectorAll('.hero__cta .btn')].map(x => x.getBoundingClientRect()), v = hero.querySelector('.hero__video');
    const visible = [...hero.querySelectorAll('*')].filter(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && !e.matches('.sr-only,video,source') && !e.closest('video'); }).map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]);
    return { globeInHero: hero.querySelectorAll('.globe,svg,.globe__stage').length, visibleEls: visible, links: [...hero.querySelectorAll('a')].map(a => a.innerText.trim() + '->' + a.getAttribute('href')), video: v && { playing: !v.paused, covers: Math.abs(v.getBoundingClientRect().height - hr.height) < 2 }, heroH: Math.round(hr.height), btnCentre: Math.abs(((btns[0].left + btns[btns.length - 1].right) / 2) - innerWidth / 2) < 3, gapBelow: Math.round(hr.bottom - Math.max(...btns.map(x => x.bottom))), stacked: btns[0].top < btns[1].top - 5, overflow: [document.documentElement.scrollWidth, innerWidth], h1: document.querySelectorAll('h1').length, aiGlobe: { cards: document.querySelectorAll('#ai .globe__label').length, centre: document.querySelector('#ai .globe__ai')?.innerText } }; });
  console.log(w, JSON.stringify(r), 'errs', e.length);
  await p.screenshot({ path: `shots/hf-${w}.png` });
  if (w === 1440) for (const href of ['#services', '#contact']) { await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(400); await p.click(`.hero__cta a[href="${href}"]`); await p.waitForTimeout(1300); console.log('anchor', href, Math.abs((await p.locator(href).boundingBox()).y) < 160); }
  await p.close();
}
const q = await (await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })).newPage(); await q.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await q.waitForTimeout(600);
console.log('reduced:', JSON.stringify(await q.evaluate(() => ({ video: !!document.querySelector('.hero__video'), poster: !!document.querySelector('.hero__poster') }))));
await b.close();
