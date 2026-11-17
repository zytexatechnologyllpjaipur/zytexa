// Renders every tool logo large with its tool name + library title/colour, for manual brand verification.
import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 40)); } });
await p.waitForTimeout(1200);
const rows = await p.evaluate(() => [...document.querySelectorAll('.service')].map(c => ({ card: c.querySelector('h3').innerText, tools: [...c.querySelectorAll('.tool')].map(t => { const m = t.querySelector('img,svg'); const path = m?.tagName === 'svg' ? m.querySelector('path')?.getAttribute('fill') : null; return { name: t.title, label: m?.getAttribute('alt') || m?.getAttribute('aria-label'), kind: m?.tagName, src: m?.getAttribute('src'), fill: path, html: m?.tagName === 'svg' ? m.outerHTML : null }; }) })));
const html = `<body style="font:12px Inter,sans-serif;margin:16px">` + rows.map(r => `<h3 style="margin:14px 0 6px">${r.card}</h3><div style="display:flex;flex-wrap:wrap;gap:10px">` + r.tools.map(t => `<div style="width:130px;border:1px solid #ccc;padding:6px;text-align:center"><div style="height:64px;display:grid;place-items:center">${t.html ? t.html.replace(/style="[^"]*"/, '').replace('<svg', '<svg width="56" height="56"') : `<img src="http://localhost:5173${t.src}" height="52" style="max-width:100px">`}</div><b>${t.name}</b><br><span style="color:#666">${t.label} ${t.fill || ''}</span></div>`).join('') + `</div>`).join('') + `</body>`;
await p.setContent(html); await p.waitForTimeout(800);
await p.setViewportSize({ width: 1500, height: 900 });
await p.screenshot({ path: 'shots/logo-sheet.png', fullPage: true });
console.log(JSON.stringify(rows.map(r => [r.card, r.tools.map(t => `${t.name}=>${t.label}`).join('; ')]), null, 1));
await b.close();
