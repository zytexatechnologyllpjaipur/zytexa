import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
const frames = await p.evaluate(async () => {
  const load = src => new Promise((res, rej) => { const v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = src; v.onloadeddata = () => res(v); v.onerror = () => rej(src); });
  const seek = (v, t) => new Promise(r => { v.onseeked = r; v.currentTime = t; });
  const a = await load('/videos/zytexa-hero.mp4'), w = await load('/videos/_cmp.webm');
  const info = { webmDuration: w.duration, webmSize: [w.videoWidth, w.videoHeight] };
  const out = [];
  for (const t of [2, 9, 16, 23]) {
    await seek(a, t); await seek(w, t);
    const mk = v => { const c = document.createElement('canvas'); c.width = 1280; c.height = 720; c.getContext('2d').drawImage(v, 0, 0, 1280, 720); return c; };
    const ca = mk(a), cw = mk(w); const da = ca.getContext('2d').getImageData(0, 0, 1280, 720).data, dw = cw.getContext('2d').getImageData(0, 0, 1280, 720).data;
    let se = 0; for (let i = 0; i < da.length; i += 4) for (let k = 0; k < 3; k++) { const d = da[i + k] - dw[i + k]; se += d * d; }
    const mse = se / (1280 * 720 * 3); out.push({ t, psnr: +(10 * Math.log10(255 * 255 / mse)).toFixed(1), a: ca.toDataURL('image/jpeg', .9), w: cw.toDataURL('image/jpeg', .9) });
  }
  return { info, out };
});
console.log(JSON.stringify(frames.info), frames.out.map(f => `t=${f.t}s PSNR=${f.psnr}dB`).join(' | '));
import('node:fs').then(fs => frames.out.forEach((f, i) => { fs.writeFileSync(`shots/cmp-a${i}.jpg`, Buffer.from(f.a.split(',')[1], 'base64')); fs.writeFileSync(`shots/cmp-w${i}.jpg`, Buffer.from(f.w.split(',')[1], 'base64')); }));
await b.close();
