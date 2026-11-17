import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [1366, 768], [1024, 768], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => [...document.querySelectorAll('.globe')].map((g) => {
    const art = g.querySelector('.globe__art').getBoundingClientRect();
    const cEl = g.querySelector('.globe__logo, .globe__ai'); const c = cEl ? cEl.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    const sph = { x: art.left + art.width * 337 / 740, y: art.top + art.height * 245 / 470 };
    const lab = g.querySelector('.globe__label'); const card = lab ? lab.getBoundingClientRect() : { width: 0, height: 0 };
    return { center: g.querySelector('.globe__ai') ? 'AI' : (cEl ? 'logo' : 'none'), art: [Math.round(art.width), Math.round(art.height)], offsetFromSphere: [Math.round(c.left + c.width / 2 - sph.x), Math.round(c.top + c.height / 2 - sph.y)], contentW: Math.round(c.width), sphereDiam: Math.round(art.width * 224 / 740), card: [Math.round(card.width), Math.round(card.height)], labels: g.querySelectorAll('.globe__label').length, scroll: !!g.querySelector('.globe__scroll'), orbitDots: g.querySelectorAll('animateMotion').length };
  }));
  console.log(w, JSON.stringify(r));
  await p.close();
}
await b.close();
