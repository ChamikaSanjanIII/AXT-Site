import React, { useEffect } from 'react';

const PRIVACY_SECTIONS = [
  {
    num: "01",
    title: "NO IP ADDRESS COLLECTION & DATA MINIMIZATION",
    content: [
      "No IP Logging: AdultXTube operates with a strict privacy-first architecture. We do NOT collect, log, track, or store users' IP addresses when you browse, search, or stream content on our platform.",
      "Anonymous Telemetry: We do not require accounts or personal registrations to view content. Any operational telemetry collected is strictly anonymous and non-identifiable, used solely to monitor total server bandwidth and optimize page load speeds."
    ]
  },
  {
    num: "02",
    title: "HOW INFORMATION IS USED",
    content: [
      "To Deliver & Maintain the Service: Ensuring video discovery links and playback features operate smoothly on desktop and mobile devices.",
      "Security & Threat Protection: Neutralizing automated malicious scrapers, DDoS attacks, and unauthorized bots.",
      "Safety & Legal Compliance: Reviewing abuse reports, broken links, and DMCA takedown requests submitted by copyright holders and visitors."
    ]
  },
  {
    num: "03",
    title: "COOKIES & LOCAL BROWSER STORAGE",
    content: [
      "We use lightweight local storage and necessary cookies strictly for core site functionality, such as remembering your 18+ adult age confirmation, theme preference, or volume settings.",
      "We do not sell personal browsing histories. Third-party video hosts or advertisers embedded via external links may maintain their own independent cookie policies."
    ]
  },
  {
    num: "04",
    title: "THIRD-PARTY SERVICES & EXTERNAL LINKS",
    content: [
      "AdultXTube is a discovery platform linking to public third-party media found across the open internet. Once you click on an external link or leave our domain, your interaction is governed entirely by that third-party provider's privacy practices.",
      "We encourage users to review the privacy terms of any external destination they visit."
    ]
  },
  {
    num: "05",
    title: "DATA SECURITY & RETENTION",
    content: [
      "We implement industry-standard encryption, SSL/TLS transport protection, and rigorous safeguards across our systems.",
      "Because we do not collect personal IP addresses, browsing histories, or user accounts, there are no personal identifiable profiles stored or retained on our systems."
    ]
  },
  {
    num: "06",
    title: "MINORS & CHILD PRIVACY (STRICT ZERO ACCESS)",
    content: [
      "AdultXTube is strictly an adult entertainment service exclusively intended for individuals 18 years of age or older. We never knowingly collect or process information from minors.",
      "If we become aware that a minor has submitted any data or accessed the platform, all associated records are permanently erased without delay."
    ]
  },
  {
    num: "07",
    title: "CONTACT DETAILS & INQUIRIES",
    content: [
      "For privacy or data inquiries, broken link notifications, or urgent content takedowns, please reach our administrative team at: privacy@adultxtube.com or abuse@adultxtube.com."
    ]
  }
];

export default function Privacy({ onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="dmca-page">
      <div className="dmca-bg-accent" />
      
      <div className="dmca-container custom-grid-padding">
        <div className="dmca-content-wrapper">
          
          {/* Header Section */}
          <div style={{ marginBottom: '40px' }}>
            <h1 className="dmca-title">
              Privacy <span>Policy</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              This policy explains how AdultXTube safeguards your privacy. We do not collect IP addresses or require user registrations.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', color: '#bbb' }}>
                <strong style={{ color: '#ff4d4f' }}>Content Reporting:</strong> If your request concerns a specific video or link, reporting the exact URL helps us review and delist the material immediately.
              </div>
            </div>
          </div>

          {/* Privacy Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {PRIVACY_SECTIONS.map((sec) => (
              <div key={sec.num} className="dmca-card">
                <h3 className="dmca-card-title">
                  <span style={{ color: '#d1fe17', marginRight: '8px' }}>{sec.num}</span> 
                  {sec.title}
                </h3>
                {sec.content.map((p, idx) => (
                  <p key={idx} className="dmca-card-text" style={{ marginTop: idx > 0 ? '10px' : '6px' }}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

