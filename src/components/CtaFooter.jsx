import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import { LOGO, SITE } from '../data/site.js';

export function Cta() {
  return (
    <section className="section section--cta">
      <div className="container">
        <Reveal className="cta">
          <div className="cta__bg" aria-hidden="true"><i /><i /></div>
          <div>
            <p className="eyebrow eyebrow--light">Ready to get started?</p>
            <h2>Let's Build What's Next for Your Business.</h2>
            <p>Discuss your ideas, explore possibilities and take the next step with Zytexa.</p>
          </div>
          <a href="#contact" className="btn btn--white">Start a Conversation <Icon name="arrow" size={14} /></a>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src={LOGO} alt="Zytexa Technology LLP" width="140" height="74" />
          <p>We build digital solutions, powerful marketing strategies and intelligent automation to help your business grow.</p>
        </div>
        <nav aria-label="Our services">
          <h4>Our Services</h4>
          <ul>
            <li><a href="#services">Website Development</a></li><li><a href="#services">Mobile App Development</a></li>
            <li><a href="#services">Digital Marketing</a></li><li><a href="#services">E-Commerce Solutions</a></li>
            <li><a href="#services" className="strong">View All Services →</a></li>
          </ul>
        </nav>
        <nav aria-label="Quick links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li><li><a href="#services">Services</a></li><li><a href="#industries">Industries</a></li>
            <li><a href="#process">How We Work</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div>
          <h4>Contact Us</h4>
          <ul className="footer__contact">
            {SITE.phones.map((p) => <li key={p}><Icon name="phone" size={14} /><a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a></li>)}
            <li><Icon name="mail" size={14} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li className="addr"><Icon name="pin" size={14} /><span><b>Registered Office Address</b>{SITE.registeredAddress}</span></li>
            <li className="addr"><Icon name="pin" size={14} /><span><b>Office Address</b>{SITE.address}</span></li>
          </ul>
        </div>
        <div className="footer__legal">
          <p><a href="#contact">Privacy Policy</a><span aria-hidden="true">|</span><a href="#contact">Terms &amp; Conditions</a></p>
          <small>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
