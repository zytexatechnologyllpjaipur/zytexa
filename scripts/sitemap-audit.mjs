import { chromium } from 'playwright'; import fs from 'node:fs';
const BASE = 'http://localhost:5173'; const b = await chromium.launch(); const p = await b.newPage();
const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const xmlPaths = [...xml.matchAll(/<loc>https:\/\/zytexa\.com([^<]*)<\/loc>/g)].map(m => m[1]);
await p.goto(BASE + '/sitemap', { waitUntil: 'networkidle' });
const htmlPaths = await p.$$eval('.smap a', a => a.map(x => x.getAttribute('href')));
const app = fs.readFileSync('src/App.jsx', 'utf8'); const routePatterns = [...app.matchAll(/<Route path="([^"]+)"/g)].map(m => m[1]).filter(r => r !== '*');
const dupRoutes = routePatterns.filter((r, i) => routePatterns.indexOf(r) !== i);
const pg = fs.readFileSync('src/data/pages.js', 'utf8');
const real = new Set(); for (const path of [...xmlPaths, ...htmlPaths]) { const q = await b.newPage(); await q.goto(BASE + path, { waitUntil: 'networkidle' }); const nf = await q.evaluate(() => /couldn't find that page/.test(document.body.innerText)); if (!nf) real.add(path); await q.close(); }
const parseOK = await p.evaluate(async () => { const d = new DOMParser().parseFromString(await (await fetch('/sitemap.xml')).text(), 'application/xml'); return { error: !!d.querySelector('parsererror'), root: d.documentElement.nodeName, ns: d.documentElement.namespaceURI }; });
const slugs = [...pg.matchAll(/S\(\d+, '([^']+)'/g)].map(m => '/services/' + m[1]).concat([...pg.matchAll(/I\('([^']+)'/g)].map(m => '/industries/' + m[1]));
const staticRoutes = routePatterns.filter(r => !r.includes(':') && !r.includes('*'));
const expected = new Set([...staticRoutes.filter(r => r !== '/terms'), ...slugs]);
const xs = new Set(xmlPaths), hs = new Set(htmlPaths.filter(h => h !== '/'));
console.log(JSON.stringify({ xmlValid: parseOK, xmlUrls: xmlPaths.length, xmlDuplicates: xmlPaths.filter((x, i) => xmlPaths.indexOf(x) !== i), xmlAllRealRoutes: xmlPaths.every(x => real.has(x)), xmlMissingFromExpected: [...expected].filter(r => !xs.has(r)), xmlExtra: [...xs].filter(r => !expected.has(r)), htmlLinks: htmlPaths.length, htmlAllRealRoutes: htmlPaths.every(x => real.has(x)), htmlMissing: [...expected].filter(r => r !== '/' && r !== '/sitemap' && !hs.has(r) && !r.startsWith('/x')), duplicateAppRoutes: dupRoutes, routePatterns: routePatterns.length, redirectsFile: fs.readFileSync('public/_redirects', 'utf8').split('\n').filter(l => !l.startsWith('#') && l.trim()) }, null, 1));
await b.close();
