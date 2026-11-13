import React, { useEffect } from 'react';

const AUTHORITIES_SECTIONS = [
  {
    num: "01",
    title: "LAW ENFORCEMENT & GOVERNMENT AGENCY COOPERATION",
    content: [
      "AdultXTube is committed to assisting legitimate international law enforcement agencies, government regulators, judicial authorities, and child protection organizations in combating illegal online content.",
      "While AdultXTube functions solely as an automated search index and does NOT host user uploads or master video files on proprietary servers, we take all official legal inquiries and criminal notices with highest priority."
    ]
  },
  {
    num: "02",
    title: "SERVICE ARCHITECTURE & INFORMATION AVAILABILITY",
    content: [
      "To help authorities understand the technical scope of data available through our platform:",
      "• No User Profiles / No Registration: AdultXTube does not require or maintain user accounts, user profiles, uploaded media files, or personal billing records.",
      "• No IP Address Logging: In accordance with our privacy-first architecture, AdultXTube does NOT log, store, or track user IP addresses during search or video browsing sessions.",
      "• Automated Web Index: All video links, titles, and previews displayed on our service are crawled automatically by computerized bots from free, publicly accessible third-party hosting networks. Media files reside on external third-party servers beyond our control."
    ]
  },
  {
    num: "03",
    title: "HOW OFFICIAL AUTHORITIES MAY SUBMIT FORMAL REQUESTS",
    content: [
      "Law enforcement officers, judicial bodies, and competent government authorities seeking emergency delisting, court order enforcement, or formal inquiries should submit notices via official channels:",
      "1. Official Email Requirement: Requests must originate from an official government or law enforcement agency domain (e.g., .gov, .police.uk, fbi.gov, or interpol.int). We cannot accept authority inquiries sent from public webmail services (Gmail, Yahoo, Outlook, etc.).",
      "2. Specific Identification: Include the exact URLs on AdultXTube associated with the material under investigation.",
      "3. Legal Basis: Reference the statutory authority, case number, or court order compelling action or request for information.",
      "4. Contact Information: Provide the investigating officer's full name, badge/identification number, phone number, and official agency address."
    ]
  },
  {
    num: "04",
    title: "EMERGENCY TAKEDOWN PROTOCOL (CSAM & IMMINENT HARM)",
    content: [
      "In situations involving suspected Child Sexual Abuse Material (CSAM/CSAE), child exploitation, human trafficking, or threats of imminent physical harm, we enforce immediate emergency protocols:",
      "• Instant Purge: Any reported link is purged from our search directory and permanently blacklisted immediately upon receipt.",
      "• Proactive Reporting: We proactively report confirmed instances of child exploitation to relevant clearinghouses such as the National Center for Missing & Exploited Children (NCMEC) and appropriate international cyber protection units."
    ]
  },
  {
    num: "05",
    title: "OFFICIAL CONTACT CHANNELS",
    content: [
      "All formal authority inquiries, judicial notices, and subpoenas should be transmitted directly to our designated compliance desk:",
      "Email: authorities@adultxtube.com (cc: abuse@adultxtube.com)",
      "Subject Line: Official Request - [Agency Name] - [Case Reference]",
      "Inquiries meeting these criteria are routed to our legal compliance officers for prioritized processing 24/7."
    ]
  }
];

export default function Authorities({ onBack }) {
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
              Official Requests & <span>Authorities Guide</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              Operational guidelines and protocols for law enforcement agencies, judicial bodies, and government regulators submitting official notices or inquiries to AdultXTube.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}>
                <span style={{ color: '#888', marginRight: '6px' }}>Direct Authorities Desk:</span>
                <a href="mailto:authorities@adultxtube.com" style={{ color: '#d1fe17', fontWeight: 'bold', textDecoration: 'none' }}>
                  authorities@adultxtube.com
                </a>
              </div>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', color: '#bbb' }}>
                <strong style={{ color: '#fff' }}>Official Domains Only:</strong> Requests must originate from verified government (.gov, .police) email addresses.
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {AUTHORITIES_SECTIONS.map((sec) => (
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

