import { chromium } from 'playwright';
const b = await chromium.launch(); const jobs = [[1280, 800, '/services', 'svc'], [1280, 800, '/services/data-analytics-ai', 'det'], [1280, 800, '/industries/healthcare', 'ind'], [1280, 800, '/how-we-work', 'how'], [1280, 800, '/portfolio', 'port'], [390, 844, '/services/cybersecurity-maintenance', 'detm'], [390, 844, '/industries', 'indm']];
for (const [w, h, path, n] of jobs) { const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto('http://localhost:5173' + path, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.header{position:static!important}.reveal{opacity:1!important;transform:none!important;transition:none!important}' }); await p.waitForTimeout(400);
  await p.screenshot({ path: `shots/pg-${n}.png`, fullPage: true }); await p.close(); }
await b.close();
