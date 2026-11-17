import re
p='src/pages/index.jsx'
s=open(p,encoding='utf-8').read()
a=s.index('export function ServiceDetail()')
b=s.index('/* ---------------- Industries')
svc='''export function ServiceDetail() {
  const { slug } = useParams();
  const s = serviceBySlug(slug);
  useTitle(s?.nav);
  if (!s) return <NotFound />;
  const c = SERVICE_CONTENT[s.slug] || { offer: s.includes.map((t) => [t, '']), why: [], faqs: [] };
  const tools = splitTools(s.tools);
  const related = SERVICE_PAGES.filter((x) => x.group === s.group && x.slug !== s.slug);
  return (
    <>
      <ImageHero eyebrow={s.group} title={s.title} intro={s.intro} image={`/heroes/${s.slug}.webp`}>
        <Link to="/contact" className="btn btn--primary">Get a Free Consultation <Icon name="arrow" size={16} /></Link>
        <Link to="/services" className="btn btn--glass">Explore Our Services</Link>
      </ImageHero>
      <Crumbs items={[['Home', '/'], ['Services', '/services'], [s.nav]]} />
      <PageSection eyebrow="What we do" title={s.tagline}>
        <ul className="grid grid--3 pgrid offer">
          {c.offer.map(([t, d], k) => <Reveal as="li" key={t} delay={k * 50} className="card pcard"><span className="ico"><Icon name="check" size={18} stroke={2.5} /></span><h3>{t}</h3>{d && <p>{d}</p>}</Reveal>)}
        </ul>
      </PageSection>
      {tools.length > 0 && (
        <PageSection eyebrow="Tools & platforms" title="Technologies and tools used in this service" tint>
          <ul className="tools tools--page" aria-label={`${s.nav} tools and platforms`}>{tools.map((t) => <Tool key={t} name={t} />)}</ul>
          <p className="note">The exact tools are chosen around your requirements. Logos are shown only to identify the tools and do not imply partnership, endorsement or certification.</p>
        </PageSection>
      )}
      {c.why.length > 0 && (
        <PageSection eyebrow="Why Zytexa" title={`Why choose Zytexa for ${s.nav.toLowerCase()}?`}>
          <ul className="grid grid--3 pgrid">
            {c.why.map((w, k) => <Reveal as="li" key={w} delay={k * 60} className="card incl__item"><Icon name="check" size={16} stroke={3} /><span>{w}</span></Reveal>)}
          </ul>
        </PageSection>
      )}
      <PageSection eyebrow="Benefits" title="What this can mean for your business" tint>
        <div className="grid grid--3 pgrid">
          {s.benefits.map(([t, d], k) => <Reveal as="article" key={t} delay={k * 70} className="card pcard"><h3>{t}</h3><p>{d}</p></Reveal>)}
        </div>
        <p className="note">Outcomes depend on your market, content and goals. We do not promise specific rankings, sales or results.</p>
      </PageSection>
      <PageSection eyebrow="How we work" title="Our process">
        <ol className="grid grid--3 psteps">
          {PROCESS.map(([t, d], k) => <Reveal as="li" key={t} delay={k * 60} className="card pstep"><span className="pstep__n">{String(k + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></Reveal>)}
        </ol>
      </PageSection>
      {c.faqs.length > 0 && <FaqSection items={c.faqs} />}
      {related.length > 0 && (
        <PageSection eyebrow="Related services" tint>
          <ul className="related">{related.map((r) => <li key={r.slug}><Link to={r.path} className="card related__item"><Icon name={r.icon} size={18} /><span>{r.nav}</span><Icon name="arrow" size={14} /></Link></li>)}</ul>
        </PageSection>
      )}
      <PageCta title={`Interested in ${s.nav}?`} />
    </>
  );
}

'''
s=s[:a]+svc+s[b:]
a=s.index('export function IndustryDetail()')
b=s.index('/* ---------------- How We Work')
ind='''export function IndustryDetail() {
  const { slug } = useParams();
  const i = industryBySlug(slug);
  useTitle(i?.nav);
  if (!i) return <NotFound />;
  const svcs = i.help.map(([slugs]) => serviceBySlug(slugs[0]));
  const tools = [...new Set(svcs.flatMap((sv) => splitTools(sv.tools)))].slice(0, 14);
  return (
    <>
      <ImageHero eyebrow="Industries" title={i.nav} intro={i.intro} image={`/heroes/industry-${i.slug}.webp`}>
        <Link to="/contact" className="btn btn--primary">Get a Free Consultation <Icon name="arrow" size={16} /></Link>
        <Link to="/industries" className="btn btn--glass">All industries</Link>
      </ImageHero>
      <Crumbs items={[['Home', '/'], ['Industries', '/industries'], [i.nav]]} />
      <PageSection eyebrow="Common challenges" title="What businesses in this sector often face">
        <ul className="grid grid--2 incl">{i.challenges.map((c, k) => <Reveal as="li" key={c} delay={k * 50} className="card incl__item"><Icon name="target" size={16} /><span>{c}</span></Reveal>)}</ul>
      </PageSection>
      <PageSection eyebrow="Relevant services" title="Services that may apply" tint>
        <div className="grid grid--4 pgrid">
          {i.help.map(([slugs, text], k) => {
            const sv = serviceBySlug(slugs[0]);
            return (
              <Reveal as="article" key={slugs[0]} delay={k * 60} className="card pcard">
                <span className="ico"><Icon name={sv.icon} size={20} /></span>
                <h3>{sv.nav}</h3><p>{text}</p>
                <Link to={sv.path} className="link-arrow">About this service <Icon name="arrow" size={14} /></Link>
              </Reveal>
            );
          })}
        </div>
        <p className="note">These are potential use cases, not results from past client projects.</p>
      </PageSection>
      {tools.length > 0 && (
        <PageSection eyebrow="Tools & platforms" title="Technologies that may be used">
          <ul className="tools tools--page" aria-label="Tools and platforms">{tools.map((t) => <Tool key={t} name={t} />)}</ul>
          <p className="note">Tools are selected per project. Logos identify the tools only and do not imply partnership or certification.</p>
        </PageSection>
      )}
      <PageSection eyebrow="Benefits" title="What a joined-up digital approach can offer" tint>
        <div className="grid grid--3 pgrid">
          {[['One team', 'Website, marketing and systems planned together instead of managed by separate vendors.'], ['Built around your sector', 'Solutions shaped by the challenges above, not a generic template.'], ['Support after launch', 'Maintenance, optimization and advice continue once the project is live.']].map(([t, d], k) => <Reveal as="article" key={t} delay={k * 70} className="card pcard"><h3>{t}</h3><p>{d}</p></Reveal>)}
        </div>
      </PageSection>
      <PageSection eyebrow="Other industries">
        <ul className="related">{INDUSTRY_PAGES.filter((x) => x.slug !== i.slug).map((x) => <li key={x.slug}><Link to={x.path} className="card related__item"><span>{x.nav}</span><Icon name="arrow" size={14} /></Link></li>)}</ul>
      </PageSection>
      <PageCta title={`Talk to us about ${i.nav.toLowerCase()}`} />
    </>
  );
}

'''
s=s[:a]+ind+s[b:]
s=s.replace("import { Crumbs, PageCta, PageHero,","import { Crumbs, ImageHero, PageCta, PageHero,")
s=s.replace("import { FAQS }","import { SERVICE_CONTENT } from '../data/serviceContent.js';\nimport { FAQS }")
open(p,'w',encoding='utf-8').write(s)
