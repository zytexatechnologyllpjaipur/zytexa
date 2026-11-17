import { chromium } from 'playwright';
const BASE = 'http://localhost:5173'; const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const R = {};
// ---- desktop
let p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(BASE + '/', { waitUntil: 'networkidle' });
R.topLabels = await p.$$eval('.nav > ul > li', els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim().split(' ').slice(0, 3).join(' ')));
R.cta = await p.$eval('.nav__cta', a => a.innerText.trim() + ' -> ' + a.getAttribute('href'));
// Services mega menu on hover
await p.hover('.nav__item--mega .nav__link'); await p.waitForTimeout(350);
R.megaOpen = await p.$eval('#menu-services', e => getComputedStyle(e).visibility === 'visible');
R.megaGroups = await p.$$eval('#menu-services .mega__h', e => e.map(x => x.innerText));
R.megaItems = await p.$$eval('#menu-services .mega__col a', e => e.map(x => x.innerText));
R.megaFoot = await p.$$eval('#menu-services .mega__foot a', e => e.map(x => x.innerText.replace(/\s+/g, ' ') + ' -> ' + x.getAttribute('href')));
const box = await p.$eval('#menu-services', e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.bottom), innerWidth]; }); R.megaInViewport = box[0] >= 0 && box[1] <= box[3];
await p.screenshot({ path: 'shots/nav-mega.png', clip: { x: 0, y: 0, width: 1280, height: 520 } });
await p.keyboard.press('Escape'); await p.waitForTimeout(250); R.megaClosedByEsc = await p.$eval('#menu-services', e => getComputedStyle(e).visibility === 'hidden');
// move the mouse from link into menu without it closing
await p.hover('.nav__item--mega .nav__link'); await p.mouse.move(640, 130); await p.waitForTimeout(250); R.megaStaysWhenMovingIn = await p.$eval('#menu-services', e => getComputedStyle(e).visibility === 'visible');
await p.mouse.move(640, 700); await p.waitForTimeout(300);
// Industries + Company
await p.hover('#menu-industries', { force: true }).catch(() => {}); await p.hover('.nav__item:nth-child(3) .nav__link'); await p.waitForTimeout(300);
R.industries = await p.$$eval('#menu-industries a', e => e.map(x => x.innerText.replace(/\s+/g, ' ')));
await p.mouse.move(640, 700);
await p.click('.nav__item:nth-child(5) button.nav__link'); await p.waitForTimeout(300);
R.company = await p.$$eval('#menu-company a', e => e.map(x => x.innerText.replace(/\s+/g, ' ') + ' -> ' + x.getAttribute('href')));
await p.screenshot({ path: 'shots/nav-company.png', clip: { x: 0, y: 0, width: 1280, height: 400 } });
await p.keyboard.press('Escape'); await p.waitForTimeout(200);
// keyboard: tab to chevron, Enter opens, Escape closes
await p.focus('.nav__item--mega .nav__chev'); await p.keyboard.press('Enter'); await p.waitForTimeout(250); R.kbOpen = await p.$eval('#menu-services', e => getComputedStyle(e).visibility === 'visible'); await p.keyboard.press('Escape'); await p.waitForTimeout(200); R.kbClosed = await p.$eval('#menu-services', e => getComputedStyle(e).visibility === 'hidden');
// click navigation through the header + active state
const go = async (menuSel, linkText, expectPath) => { await p.hover(menuSel); await p.waitForTimeout(250); await p.click(`.menu.is-open a:has-text("${linkText}")`); await p.waitForTimeout(500); return new URL(p.url()).pathname === expectPath; };
R.nav = {};
R.nav.service = await go('.nav__item--mega .nav__link', 'Digital Marketing', '/services/digital-marketing');
R.activeOnService = await p.$eval('.nav__item--mega .nav__link', e => e.classList.contains('active') || e.classList.contains('is-active'));
R.nav.industry = await go('.nav__item:nth-child(3) .nav__link', 'Hospitality & Travel', '/industries/hospitality-travel');
await p.click('.nav__item:nth-child(4) a'); await p.waitForTimeout(400); R.nav.how = new URL(p.url()).pathname === '/how-we-work';
await p.click('.nav__item:nth-child(5) button.nav__link'); await p.waitForTimeout(250); await p.click('#menu-company a:has-text("About Us")'); await p.waitForTimeout(400); R.nav.about = new URL(p.url()).pathname === '/about';
await p.click('.nav__item:nth-child(6) a'); await p.waitForTimeout(400); R.nav.contact = new URL(p.url()).pathname === '/contact';
await p.click('.nav__cta'); await p.waitForTimeout(400); R.nav.cta = new URL(p.url()).pathname === '/contact';
await p.click('.brand'); await p.waitForTimeout(400); R.nav.logoHome = new URL(p.url()).pathname === '/';
R.pageErrors = errs.length;
await p.close();
// ---- mobile
p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await p.goto(BASE + '/about', { waitUntil: 'networkidle' });
await p.tap('.burger'); await p.waitForTimeout(300); R.mobileMenuOpen = await p.$eval('.nav', e => e.classList.contains('is-open'));
await p.tap('.nav__item--mega .nav__chev'); await p.waitForTimeout(300); R.mobileServicesAccordion = await p.$eval('#menu-services', e => getComputedStyle(e).display === 'block');
await p.screenshot({ path: 'shots/nav-mobile.png' });
await p.tap('#menu-services a:has-text("Mobile App Development")'); await p.waitForTimeout(600);
R.mobileNavigated = new URL(p.url()).pathname === '/services/mobile-app-development'; R.mobileMenuClosedAfterSelect = await p.$eval('.nav', e => !e.classList.contains('is-open'));
await p.tap('.burger'); await p.waitForTimeout(250); await p.keyboard.press('Escape'); await p.waitForTimeout(200); R.mobileEscClosed = await p.$eval('.nav', e => !e.classList.contains('is-open'));
R.mobileOverflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
await b.close(); console.log(JSON.stringify(R, null, 1));
