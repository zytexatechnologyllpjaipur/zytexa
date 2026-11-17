import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 40)); } });
  await p.waitForTimeout(1500);
  const rows = await p.evaluate(() => [...document.querySelectorAll('.service')].map((c) => {
    const items = [...c.querySelectorAll('.tool')].map((t) => {
      const m = t.querySelector('img,svg'); const chip = t.classList.contains('tool--text');
      const label = chip ? t.title : (m?.getAttribute('alt') || m?.getAttribute('aria-label') || '');
      const r = (m || t).getBoundingClientRect();
      return { name: t.title, kind: chip ? 'chip' : 'logo', label, h: Math.round(r.height), loaded: m?.tagName === 'IMG' ? (m.complete && m.naturalWidth > 0) : true };
    });
    const cr = c.getBoundingClientRect(); const tools = c.querySelector('.tools'); const tr = tools?.getBoundingClientRect();
    return { card: c.querySelector('h3').innerText, bottomGap: tr ? Math.round(cr.bottom - tr.bottom) : null, items };
  }));
  if (w === 1440) for (const r of rows) console.log(r.card, '| gap', r.bottomGap, '|', r.items.map(i => (i.kind === 'chip' ? `[${i.name}]` : i.label.replace(' logo', ''))).join(', ') || '(none)');
  const chips = rows.flatMap(r => r.items).filter(i => i.kind === 'chip'); if (chips.length) { console.log('FAIL: text chips remain:', chips.map(c => c.name).join(', ')); process.exitCode = 1; }
  const empty = rows.filter(r => !r.items.length).map(r => r.card); if (empty.length) { console.log('FAIL: cards without tools:', empty.join(', ')); process.exitCode = 1; }
  const bad = rows.flatMap(r => r.items).filter(i => i.kind === 'logo' && (!i.label || !i.loaded));
  const minH = Math.min(...rows.flatMap(r => r.items).filter(i => i.kind === 'logo').map(i => i.h));
  console.log(w, 'logos without label/not loaded:', bad.length, '| min logo height px:', minH, '| total logos', rows.flatMap(r => r.items).filter(i => i.kind === 'logo').length, 'chips', rows.flatMap(r => r.items).filter(i => i.kind === 'chip').length);
  await p.close();
}
await b.close();
