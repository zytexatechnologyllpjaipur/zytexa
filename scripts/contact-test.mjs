import { chromium } from 'playwright';
const b = await chromium.launch();
const R = {};
async function open(url, w = 1280) { const p = await b.newPage({ viewport: { width: w, height: 900 } }); p.errs = []; p.on('pageerror', e => p.errs.push(e.message)); p.on('console', m => m.type() === 'error' && p.errs.push(m.text())); await p.goto(url, { waitUntil: 'networkidle' }); return p; }
const fill = async (p) => { await p.locator('#name').click(); await p.keyboard.type('Test User'); await p.keyboard.press('Tab'); await p.keyboard.type('test@example.com'); await p.keyboard.press('Tab'); await p.keyboard.type('+91 98765 43210'); await p.fill('#message', 'Need a website and CRM setup for my shop.'); await p.selectOption('#service', { index: 1 }); };

// ---- A: no endpoint (port 5173)
let p = await open('http://localhost:5173/');
await p.click('.nav__cta'); await p.waitForTimeout(1200);
R.navCtaScrollsToContact = Math.abs((await p.locator('#contact').boundingBox()).y) < 140;
await p.locator('#name').click(); await p.keyboard.type('Priya Sharma');
R.typingKeepsFocus = (await p.locator('#name').inputValue()) === 'Priya Sharma' && await p.evaluate(() => document.activeElement.id === 'name');
R.focusRing = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle !== 'none');
await p.locator('#name').fill('');
await p.click('.cx__submit'); R.emptyErrors = await p.locator('.cx__form .has-err').count(); R.firstError = await p.locator('#name-e').innerText();
await p.fill('#email', 'bad'); await p.click('.cx__submit'); R.emailError = await p.locator('#email-e').innerText();
await fill(p); await p.fill('#email', 'test@example.com');
await p.click('.cx__submit'); R.consentError = await p.locator('#agree-e').innerText();
await p.check('#agree'); R.checkboxChecked = await p.locator('#agree').isChecked();
await p.click('.cx__submit'); R.noEndpointStatus = (await p.locator('.form__status').innerText()).replace(/\s+/g, ' ');
R.noSuccessClaim = !/thank you|has been sent/i.test(R.noEndpointStatus);
R.fieldsRetainedAfterNotSent = (await p.locator('#name').inputValue()) !== '';
R.budgetIsTextInput = await p.locator('#budget').evaluate(e => e.tagName);
R.links = await p.evaluate(() => [...document.querySelectorAll('.cx__info a')].map(a => a.getAttribute('href')));
R.hoursRowHidden = (await p.locator('.cx__info').innerText()).includes('BUSINESS HOURS') === false;
R.panelText = (await p.locator('.cx__info').innerText()).replace(/\n+/g, ' | ');
R.errsA = p.errs; await p.close();

// ---- B: endpoint configured (port 5174) with mocked responses
p = await open('http://localhost:5174/');
let body = null; let mode = 'ok';
await p.route('http://localhost:9999/**', async r => { body = r.request().postDataJSON(); await new Promise(x => setTimeout(x, 700)); await r.fulfill({ status: mode === 'ok' ? 200 : 500, headers: { 'access-control-allow-origin': '*', 'content-type': 'application/json' }, body: '{}' }); });
await p.route('http://localhost:9999/**', r => r.fallback());
await p.evaluate(() => document.querySelector('#contact').scrollIntoView());
await fill(p); await p.check('#agree');
mode = 'fail'; await p.click('.cx__submit'); await p.waitForTimeout(250);
R.loadingDisabled = await p.locator('.cx__submit').isDisabled(); R.loadingText = await p.locator('.form__status').innerText();
await p.waitForTimeout(1000); R.failStatus = await p.locator('.form__status').innerText(); R.failKeepsData = (await p.locator('#name').inputValue()) !== '';
mode = 'ok'; await p.click('.cx__submit'); await p.waitForTimeout(1500);
R.okStatus = await p.locator('.form__status').innerText(); R.formClearedAfterOk = (await p.locator('#name').inputValue()) === '';
R.payloadKeys = body && Object.keys(body); R.errsB = p.errs; await p.close();

// ---- C: layout at widths
for (const w of [1440, 1024, 768, 390, 360]) {
  p = await open('http://localhost:5173/', w);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 40)); } });
  const el = p.locator('#contact'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
  const m = await p.evaluate(() => { const g = document.querySelector('.cx__grid'), i = document.querySelector('.cx__info').getBoundingClientRect(), f = document.querySelector('.cx__form').getBoundingClientRect(); return { sideBySide: Math.abs(i.top - f.top) < 4, wInfo: Math.round(i.width), wForm: Math.round(f.width), sw: document.documentElement.scrollWidth, W: innerWidth }; });
  R['layout' + w] = m; await el.screenshot({ path: `shots/c-${w}.png` }); await p.close();
}
console.log(JSON.stringify(R, null, 1)); await b.close();
