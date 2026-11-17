import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await p.locator('.clients').scrollIntoViewIfNeeded();
await p.evaluate(() => { window.__s = []; const el = document.querySelector('.clients__track'); const f = () => { window.__s.push(new DOMMatrix(getComputedStyle(el).transform).m41); requestAnimationFrame(f); }; f(); });
for (let i = 0; i < 14; i++) { await p.locator('button[aria-label="Next clients"]').click(); await p.waitForTimeout(500); }
await p.locator('button[aria-label="Previous clients"]').click(); await p.waitForTimeout(800);
const r = await p.evaluate(() => { const s = window.__s; const sw = document.querySelector('.clients__list').offsetWidth; let wraps = 0, maxStep = 0; for (let i = 1; i < s.length; i++) { const d = s[i] - s[i - 1]; if (Math.abs(d) > sw / 2) wraps++; else maxStep = Math.max(maxStep, Math.abs(d)); } return { setWidth: sw, wraps, maxStepPx: maxStep.toFixed(1) }; });
console.log(JSON.stringify(r)); await b.close();
