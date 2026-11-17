p='src/data/testimonials.js'
open(p,'w',encoding='utf-8').write("""// Add ONLY genuine, approved client reviews here: { quote, name, role, place }.
// While this list is empty the Client Reviews section shows an honest "reviews coming soon" card instead of any sample text.
export const TESTIMONIALS = [];
""")
p='src/components/Testimonials.jsx'
s=open(p,encoding='utf-8').read()
s=s.replace("""        <span className="rv__who">— {!t.placeholder && <>{t.name}, </>}{t.role}</span>
        <small>{t.place}</small>
        {t.placeholder && <em className="badge">Sample review</em>}""","""        <span className="rv__who">— {t.name}, {t.role}</span>
        <small>{t.place}</small>""")
s=s.replace("import Reveal from './Reveal.jsx';","import { Link } from 'react-router-dom';\nimport Reveal from './Reveal.jsx';")
s=s.replace("  const pair = n > 1","  const pair = n === 0 ? [] : n > 1")
s=s.replace("""        <Reveal className="reviews" onMouseEnter""","""        {n === 0 ? (
          <Reveal className="reviews">
            <div className="rv__empty">
              <span className="rv__avatar" aria-hidden="true"><Icon name="team" size={22} stroke={1.5} /></span>
              <h3>Client reviews are coming soon</h3>
              <p>We are gathering feedback from our clients to share here. In the meantime, tell us about your project and we will be happy to talk it through.</p>
              <Link to="/contact" className="btn btn--primary btn--sm">Start a conversation <Icon name="arrow" size={14} /></Link>
            </div>
          </Reveal>
        ) : (
        <Reveal className="reviews" onMouseEnter""")
s=s.replace("""        </Reveal>
      </div>
    </section>
  );
}""","""        </Reveal>
        )}
      </div>
    </section>
  );
}""")
open(p,'w',encoding='utf-8').write(s)

p='src/pages/index.jsx'
s=open(p,encoding='utf-8').read()
s=s.replace("""        <p className="note">Content placeholder: genuine projects, clients and results will be added here by the Zytexa team.</p>\n""","")
open(p,'w',encoding='utf-8').write(s)

p='src/data/registrations.js'
s=open(p,encoding='utf-8').read()
s=s.replace("confirmed: true, documentUrl: '', linkLabel: 'View Registration' },\n  { key: 'llp'","confirmed: true, soonText: 'Details to be added', documentUrl: '', linkLabel: 'View Registration' },\n  { key: 'llp'",1)
s=s.replace("primary: true, documentUrl:","primary: true, soonText: 'Official copy not published online', documentUrl:")
s=s.replace("confirmed: true, documentUrl: '', linkLabel: 'View Registration' }\n","confirmed: true, soonText: 'Official copy not published online', documentUrl: '', linkLabel: 'View Registration' }\n") if False else s
s=s.replace("since: '30 Jun 2026', confirmed: true, documentUrl:","since: '30 Jun 2026', confirmed: true, soonText: 'Official copy not published online', documentUrl:")
open(p,'w',encoding='utf-8').write(s)
