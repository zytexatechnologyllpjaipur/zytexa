// Dev-only: re-encode the hero video to a smaller VP9 WebM using Chromium's MediaRecorder (no extra dependencies).
import { chromium } from 'playwright'; import fs from 'node:fs';
const [, , outPath = 'shots/hero-small.webm', kbps = '1400', width = '1280'] = process.argv;
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await b.newPage();
await p.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
const res = await p.evaluate(async ({ kbps, width }) => {
  const v = document.createElement('video'); v.src = '/videos/zytexa-hero.mp4'; v.muted = true; v.playsInline = true; v.preload = 'auto';
  await new Promise((r, j) => { v.onloadeddata = r; v.onerror = () => j('load'); });
  const W = +width, H = Math.round(W * v.videoHeight / v.videoWidth / 2) * 2;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8'].find(m => MediaRecorder.isTypeSupported(m));
  const rec = new MediaRecorder(c.captureStream(30), { mimeType: mime, videoBitsPerSecond: +kbps * 1000 });
  const chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => rec.onstop = r);
  let frames = 0; const draw = () => { g.drawImage(v, 0, 0, W, H); frames++; if (!v.ended) (v.requestVideoFrameCallback ? v.requestVideoFrameCallback(draw) : requestAnimationFrame(draw)); };
  rec.start(500); await v.play(); draw();
  await new Promise(r => v.onended = r); await new Promise(r => setTimeout(r, 300)); rec.stop(); await done;
  const blob = new Blob(chunks, { type: mime }); const buf = new Uint8Array(await blob.arrayBuffer());
  let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return { mime, W, H, frames, dur: v.duration, b64: btoa(s) };
}, { kbps, width });
fs.writeFileSync(outPath, Buffer.from(res.b64, 'base64'));
console.log(JSON.stringify({ ...res, b64: undefined, bytes: fs.statSync(outPath).size }));
await b.close();
