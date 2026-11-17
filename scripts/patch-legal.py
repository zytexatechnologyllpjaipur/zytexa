p='src/data/pages.js'
s=open(p,encoding='utf-8').read()
a=s.index('export const LEGAL')
new='''export const LEGAL = {
  'privacy-policy': { title: 'Privacy Policy', sections: [
    ['Who we are', 'This site is operated by Zytexa Technology LLP, Jaipur, Rajasthan. You can contact us using the details on the Contact page.'],
    ['Information you give us', 'When you send an enquiry through the contact form, you may provide your name, email, phone number, company, the service you are interested in and a project description.'],
    ['Data controller / responsible person', 'Which legal entity and which named contact is responsible for personal data collected through this site.', true],
    ['How information may be used', 'Enquiry details are used to understand and respond to your request. Any other purpose must be stated here.', true],
    ['Where enquiries are stored and who can access them', 'The mail or form service that receives enquiries, and who inside the company can see them.', true],
    ['Retention and deletion', 'How long enquiry information is kept and how it is deleted.', true],
    ['Third parties and processors', 'Any email, hosting, CRM, messaging or other providers that handle your information.', true],
    ['Cookies and analytics', 'Whether this site uses cookies or analytics tools, and for what purpose. Nothing is stated here until the company confirms it.', true],
    ['Your rights and how to exercise them', 'How you can ask to see, correct or delete your information, and the response time.', true],
    ['Security', 'The measures used to protect information. No claims are made until confirmed.', true],
    ['Changes to this policy', 'How and when this policy may be updated.', true],
  ] },
  'terms': { title: 'Terms & Conditions', sections: [
    ['About these terms', 'These terms describe the basis on which this website is provided by Zytexa Technology LLP.'],
    ['Use of the website', 'The content on this website is provided for general information about Zytexa and its services.'],
    ['Services and proposals', 'Scope, deliverables, timelines and pricing for any project are agreed separately in a written proposal or agreement.', true],
    ['Payment terms', 'Advance, milestone and final payment terms, taxes and late payment.', true],
    ['Cancellation and refunds', 'See the Refund Policy for the company approved position.', true],
    ['Intellectual property and ownership', 'Ownership and licensing of designs, code, content and third-party materials on a project.', true],
    ['Client responsibilities', 'Content, approvals and access the client needs to provide.', true],
    ['Third-party tools and services', 'Responsibility for third-party platforms, licences and subscriptions used in a project.', true],
    ['Limitation of liability', 'Limits on the company\'s liability.', true],
    ['Governing law and dispute resolution', 'Which law applies and where or how disputes are resolved.', true],
    ['Changes to these terms', 'How and when these terms may be updated.', true],
  ] },
  'refund-policy': { title: 'Refund Policy', sections: [
    ['Overview', 'Zytexa provides project-based and ongoing services. Refund and cancellation terms depend on the nature of the work.'],
    ['Eligibility and refund periods', 'Which payments, if any, are refundable and within what period.', true],
    ['Work already started or delivered', 'How completed work, third-party costs and non-refundable items are treated.', true],
    ['Cancellation of a project or subscription', 'Notice periods and what happens to payments and work completed.', true],
    ['How to request a refund', 'The process for raising a request and expected processing time.', true],
    ['Payment method and timing of refunds', 'How refunds are returned and how long they take.', true],
  ] },
};

// Decisions the company must make before the legal pages can be finalised (shown at the foot of each draft).
export const LEGAL_DECISIONS = [
  'Who is the data controller and the named contact for privacy requests?',
  'Where are enquiries stored, who can access them, and how long are they kept?',
  'Does the site use cookies or analytics? Which providers, and for what purpose?',
  'Which third parties (email, hosting, CRM, payment, messaging) handle customer data?',
  'Payment terms, cancellation rules and refund eligibility for each service type.',
  'Ownership of delivered designs and code, and limits of liability.',
  'Governing law, jurisdiction and dispute-resolution method.',
];
'''
open(p,'w',encoding='utf-8').write(s[:a]+new)

p='src/pages/index.jsx'
s=open(p,encoding='utf-8').read()
s=s.replace("To be confirmed by Zytexa.","Requires company confirmation.")
s=s.replace("Sections marked &ldquo;To be confirmed&rdquo; must be completed or approved by Zytexa Technology LLP (ideally with legal advice) before this page is treated as final.","Sections marked &ldquo;Requires company confirmation&rdquo; must be completed and approved by Zytexa Technology LLP, ideally with a qualified legal adviser, before this page is treated as final. Nothing here is a final legal statement.")
s=s.replace("""          <p className="legal__contact">""","""          <Reveal as="section" className="legal__sec"><h2>Decisions needed before this page is final</h2><ul className="legal__list">{LEGAL_DECISIONS.map((d) => <li key={d}>{d}</li>)}</ul></Reveal>
          <p className="legal__contact">""")
s=s.replace("LEGAL, PROCESS","LEGAL, LEGAL_DECISIONS, PROCESS")
open(p,'w',encoding='utf-8').write(s)
