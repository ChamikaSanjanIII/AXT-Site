import React, { useEffect } from 'react';

const GUIDELINES_SECTIONS = [
  {
    num: "01",
    title: "PURPOSE & PLATFORM NATURE",
    content: [
      "AdultXTube is built to provide an orderly, reliable, and user-friendly directory for consenting adults to search and explore mature content across the web.",
      "To ensure a safe environment for all visitors and respect the dignity of creators, these Community Guidelines define our baseline standards and acceptable boundaries for content indexed on our platform."
    ]
  },
  {
    num: "02",
    title: "ABSOLUTELY PROHIBITED CONTENT",
    content: [
      "Any media falling into the following categories is strictly prohibited from being indexed, linked, or surfaced on AdultXTube under any circumstances:",
      "• Underage Depictions (CSAM / CSAE): Zero tolerance for child sexual abuse material or any depiction involving persons under 18 years of age.",
      "• Non-Consensual Media: Non-consensual sexual content, voyeurism, revenge porn, hidden camera recordings, or recordings made without full mutual consent.",
      "• Violence & Coercion: Real sexual violence, rape, forced acts, torture, mutilation, or physical assault.",
      "• Bestiality & Animal Cruelty: Any sexual interaction involving animals.",
      "• Hate Speech & Harassment: Material that promotes hate, discrimination, or physical harm against protected groups or individuals."
    ]
  },
  {
    num: "03",
    title: "INDEXING STANDARDS & AGE VERIFICATION",
    content: [
      "AdultXTube only indexes links from adult websites, distributors, and studios that adhere to statutory compliance frameworks (such as 18 U.S.C. 2257).",
      "We strictly require that all performers appearing in indexed content were at least 18 years old at the time the content was recorded. Any submission or link that fails to satisfy verifiable age standards is blocked from the index."
    ]
  },
  {
    num: "04",
    title: "USER CONDUCT & SAFE BROWSING",
    content: [
      "Visitors must treat the service with integrity. The following user behaviors are prohibited:",
      "• Attempting to inject malware, spam, or malicious redirect scripts.",
      "• Deploying aggressive web crawlers, scrapers, or automated bots that overload platform infrastructure.",
      "• Abusing our reporting or takedown forms with bad-faith, fraudulent, or automated fake notices.",
      "• Bypassing our 18+ adult age gate through misrepresentation."
    ]
  },
  {
    num: "05",
    title: "ENFORCEMENT & COMPLIANCE",
    content: [
      "Our moderation team regularly reviews flagged links. If an indexed item is determined to violate these Community Guidelines, it will be immediately and permanently eliminated from our index.",
      "In situations involving serious legal violations (such as CSAM or severe physical violence), we fully cooperate with cybercrime units and national law enforcement authorities."
    ]
  }
];

export default function CommunityGuidelines({ onBack }) {
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
              Community <span>Guidelines</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              Our standards for acceptable content, zero-tolerance policies, and community integrity on AdultXTube.
            </p>

            <div className="dmca-warning-box">
              <strong>Zero Tolerance:</strong> 
              <span>We maintain strict standards against non-consensual and illegal material.</span>
            </div>
          </div>

          {/* Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {GUIDELINES_SECTIONS.map((sec) => (
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

