import React, { useEffect } from 'react';

const DMCA_SECTIONS = [
  {
    num: "01",
    title: "AUTOMATED BOT AGGREGATION & IMMEDIATE TAKEDOWNS",
    content: [
      "In accordance with the Digital Millennium Copyright Act (17 U.S.C. § 512), AdultXTube respects the intellectual property rights of creators and producers.",
      "AdultXTube does NOT upload, store, or manually curate videos. All media metadata and stream links indexed on our platform are collected 100% automatically by computerized bots from free, publicly accessible third-party internet sources. AdultXTube assumes zero legal liability for links automatically captured by these spiders.",
      "If our automated bot has captured or indexed any copyrighted, unauthorized, or objectionable file, our policy is to IMMEDIATELY remove and permanently delist that item the moment a complaint or takedown request is received."
    ]
  },
  {
    num: "02",
    title: "INFORMATION REQUIRED FOR A VALID TAKEDOWN NOTICE",
    content: [
      "To ensure prompt removal, your written DMCA notification must include:",
      "1. A physical or electronic signature of the copyright owner or authorized representative.",
      "2. Specific identification of the copyrighted work claimed to have been infringed.",
      "3. The exact URL(s) on AdultXTube where the infringing material is located (generic homepage links cannot be processed).",
      "4. Your valid contact details including full legal name, physical address, phone number, and official email address.",
      "5. A statement of good-faith belief that use of the material is not authorized by the copyright owner, agent, or the law.",
      "6. A statement, made under penalty of perjury, that the information in the notice is accurate and that you are authorized to act on behalf of the owner."
    ]
  },
  {
    num: "03",
    title: "SUBMITTING NOTICES & DESIGNATED AGENT",
    content: [
      "Please transmit all formal DMCA takedown notices via email to our designated copyright desk: dmca@adultxtube.com.",
      "Inquiries accompanied by complete URLs are processed within 24 to 48 business hours. Knowingly submitting fraudulent or false claims may carry legal liability and damages under Section 512(f)."
    ]
  }
];

export default function DMCA({ onBack }) {
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
              DMCA Notice of <span>Copyright Infringement</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              Information for copyright owners. All links are crawled automatically by bots from free internet sources with zero operator liability; reported items are purged immediately.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}>
                <span style={{ color: '#888', marginRight: '6px' }}>Direct DMCA Desk:</span>
                <a href="mailto:dmca@adultxtube.com" style={{ color: '#d1fe17', fontWeight: 'bold', textDecoration: 'none' }}>
                  dmca@adultxtube.com
                </a>
              </div>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', color: '#bbb' }}>
                <strong style={{ color: '#fff' }}>Provide Exact URLs:</strong> Supplying the exact page URL ensures immediate verification and removal.
              </div>
            </div>
          </div>

          {/* DMCA Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {DMCA_SECTIONS.map((sec) => (
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
