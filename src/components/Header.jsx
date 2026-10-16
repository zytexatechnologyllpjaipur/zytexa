import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { LOGO, NAV } from '../data/site.js';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      let cur = ids[0]; let best = -Infinity;
      for (const id of ids) { const el = document.getElementById(id); if (!el) continue; const t = el.getBoundingClientRect().top; if (t <= 140 && t > best) { best = t; cur = id; } }
      setActive(cur);
    };
    const onKey = (e) => { if (e.key === 'Escape') { setDd(null); setOpen(false); } };
    const onClick = (e) => { if (!e.target.closest('.nav__item')) setDd(null); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, []);

  const go = () => { setOpen(false); setDd(null); };

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header__bar">
        <a href="#home" className="brand" aria-label="Zytexa Technology LLP — home">
          <img src={LOGO} alt="Zytexa Technology LLP" width="160" height="84" />
        </a>
        <button className="burger" aria-label="Toggle menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav id="nav" className={`nav ${open ? 'is-open' : ''}`} aria-label="Primary">
          <ul>
            {NAV.map((n) => (
              <li key={n.label} className="nav__item">
                {n.children ? (
                  <>
                    <button className={`nav__link ${active === n.href.slice(1) ? 'is-active' : ''}`} aria-expanded={dd === n.label} aria-haspopup="true"
                      onClick={() => setDd(dd === n.label ? null : n.label)}>
                      {n.label} <Icon name="chevron" size={14} />
                    </button>
                    <ul className={`dropdown ${dd === n.label ? 'is-open' : ''}`}>
                      <li><a href={n.href} onClick={go}>All {n.label}</a></li>
                      {n.children.map((c) => <li key={c}><a href={n.href} onClick={go}>{c}</a></li>)}
                    </ul>
                  </>
                ) : (
                  <a className={`nav__link ${active === n.href.slice(1) ? 'is-active' : ''}`} href={n.href} aria-current={active === n.href.slice(1) ? 'location' : undefined} onClick={go}>{n.label}</a>
                )}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--primary btn--sm nav__cta" onClick={go}>Get a Free Consultation <Icon name="arrow" size={13} /></a>
        </nav>
      </div>
    </header>
  );
}
