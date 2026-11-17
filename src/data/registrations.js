// Legal registrations & certifications shown in the homepage "Registrations" section.
// IMPORTANT: every detail below is deliberately EMPTY. Nothing is displayed for a field until a VERIFIED value is entered
// (number / status / since). Do not copy values from the design reference - they were sample data, not Zytexa's.
// `documentUrl`: the genuine certificate/document or official verification page for the card (https://...). While it is empty the card
// shows a non-clickable "certificate not published" label; once set, `linkLabel` becomes a link that opens in a new tab.
// (A card with `confirmed: false`, e.g. Startup India, never shows a link.) Never point several cards at one generic page.
// `confirmed: false` marks a card whose existence is not yet evidenced; it shows a visible "To be confirmed" pill.
export const REGISTRATIONS = [
  // Startup India: no recognition certificate has been supplied, so the card shows only "Coming Soon" (no number, date or link).
  // Once an authentic DPIIT recognition certificate exists: set number, since, documentUrl and confirmed:true.
  { key: 'startup', title: 'Startup India', authority: ['Startup India Initiative', 'Government of India'], numberLabel: 'Recognition No.', number: '', status: '', since: '', confirmed: false, pendingLabel: 'Coming Soon', soonText: 'Not yet available', documentUrl: '', linkLabel: 'View Certificate' },
  { key: 'llp', title: 'LLP', authority: ['Ministry of Corporate Affairs', 'Government of India'], numberLabel: 'LLPIN', number: 'ACM-1085', status: '', since: '19 Feb 2025', confirmed: true, primary: true, documentUrl: '/certificate/zytexa-llp-certificate-of-incorporation.pdf', linkLabel: 'View Certificate' },
  { key: 'gst', title: 'GST Registration', authority: ['Goods & Services Tax', 'Government of India'], numberLabel: 'Reg. No.', number: '', status: '', since: '', confirmed: true, soonText: 'Certificate unavailable', documentUrl: '', linkLabel: 'View Certificate' },
  { key: 'msme', title: 'MSME / Udyam Registration', authority: ['Ministry of MSME', 'Government of India'], numberLabel: 'Udyam No.', number: 'UDYAM-RJ-17-0655070', status: '', since: '30 Jun 2026', confirmed: true, documentUrl: '/certificate/zytexa-udyam-registration-certificate.pdf', linkLabel: 'View Certificate' }
];

// Document notes (checked against the files supplied):
// - msme: public/certificate/zytexa-udyam-registration-certificate.pdf is an unmodified copy of the Udyam certificate (documents-private/).
//   It prints the company's Gmail address and mobile number; publishing it was approved by the company owner.
// - llp: public/certificate/zytexa-llp-certificate-of-incorporation.pdf is an unmodified copy of the FiLLiP Form 16 Certificate of Incorporation
//   (LLPIN ACM-1085). It prints the LLP's full PAN and TAN (the trailing * is only a footnote marker, not a mask); publishing it was approved by the company owner.
// - gst: the only GST certificate supplied (documents-private/) belongs to MURLIT ENTERPRISES, NOT Zytexa Technology LLP. It is not published and
//   must never be linked here. Supply Zytexa's own GST certificate, then enter its number and documentUrl.
