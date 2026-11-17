import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [u,w,n] of [['/services/digital-marketing',1440,'a'],['/services/digital-marketing',390,'b'],['/industries/healthcare',1440,'c']]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:5173'+u, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
  await p.screenshot({ path: `shots/svc-${n}.png`, fullPage: true }); await p.close();
}
await b.close();
