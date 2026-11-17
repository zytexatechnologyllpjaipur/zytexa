import { chromium } from 'playwright';
const tag = process.argv[2] || 'default';
const b = await chromium.launch();
for (const w of tag === 'default' ? [1440, 390, 320] : [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.addStyleTag({ content: '.header{position:static!important}.reveal{opacity:1!important;transform:none!important;transition:none!important}' });
  const r = await p.evaluate(() => {
    const head = document.querySelector('.reg__head'), hb = head.getBoundingClientRect(), W = innerWidth;
    const centre = el => { const r = el.getBoundingClientRect(); return Math.abs((r.left + r.width / 2) - W / 2) <= 1.5; };
    const cards = [...document.querySelectorAll('.reg__card')].map(c => { const l = c.querySelector('.reg__link'), cr = c.getBoundingClientRect(), lr = l.getBoundingClientRect(); return { title: c.querySelector('h3').innerText, tag: l.tagName, text: l.innerText.replace(/\s+/g, ' ').trim(), href: l.getAttribute('href'), target: l.target || null, rel: l.rel || null, insideCard: lr.left >= cr.left && lr.right <= cr.right && lr.bottom <= cr.bottom }; });
    return { align: getComputedStyle(head).textAlign, pillCentred: centre(head.querySelector('.reg__pill')), h2Centred: centre(head.querySelector('h2')), descCentred: centre(head.querySelector('p')), cards, overflow: [document.documentElement.scrollWidth, innerWidth] };
  });
  console.log(tag, w, JSON.stringify(r));
  const el = p.locator('.reg'); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: `shots/reg-${tag}-${w}.png` }); await p.close();
}
await b.close();
