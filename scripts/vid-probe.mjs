import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 520 } });
await p.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await p.evaluate(() => { document.body.innerHTML = '<video id=v src="/videos/zytexa-hero.mp4" muted playsinline preload=auto style="width:900px;display:block"></video>'; });
await p.waitForFunction(() => document.getElementById('v').readyState >= 2, null, { timeout: 40000 });
const info = await p.evaluate(() => { const v = document.getElementById('v'); return { w: v.videoWidth, h: v.videoHeight, dur: Math.round(v.duration * 10) / 10 }; });
console.log(JSON.stringify(info));
for (const f of [0.05, 0.4, 0.75]) { await p.evaluate(async (t) => { const v = document.getElementById('v'); v.currentTime = t; await new Promise(r => v.addEventListener('seeked', r, { once: true })); }, info.dur * f); await p.screenshot({ path: `shots/vf-${Math.round(f * 100)}.png` }); }
await b.close();
