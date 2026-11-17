import { chromium } from 'playwright';
import fs from 'node:fs';
const routes = ['/', ...[...fs.readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>https:\/\/zytexa\.com(\/[^<]*)<\/loc>/g)].map(m => m[1])].filter((v, i, a) => v !== '/' || i === 0);
const re = /sample|replace with|lorem|ipsum|placeholder|client name|your text|tbd|to be confirmed|coming soon|requires company confirmation|not connected|todo|xxx/gi;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); const out = {};
for (const r of new Set(routes)) { await p.goto('http://localhost:5173' + r, { waitUntil: 'networkidle' }); const t = await p.evaluate(() => document.body.innerText); const hits = [...new Set((t.match(re) || []).map(x => x.toLowerCase()))]; if (hits.length) out[r] = hits; }
console.log(Object.keys([...new Set(routes)]).length, 'routes scanned'); console.log(JSON.stringify(out, null, 1)); await b.close();
