import React, { useEffect } from 'react';

const PARENTAL_SECTIONS = [
  {
    num: "01",
    title: "OUR COMMITMENT TO PROTECTING MINORS",
    content: [
      "AdultXTube is strictly an adults-only platform intended exclusively for consenting individuals who are eighteen (18) years of age or older (or the legal age of majority in their jurisdiction).",
      "We strictly prohibit minors from accessing any media indexed on our site. While we require an upfront age confirmation before entering the platform, we strongly encourage parents, guardians, and educational institutions to implement active technological filters to block adult websites across devices."
    ]
  },
  {
    num: "02",
    title: "FREE NETWORK-LEVEL PARENTAL CONTROLS (ROUTER & DNS)",
    content: [
      "The most effective way to block AdultXTube and all mature content across every device on your home network (smartphones, tablets, PCs, smart TVs, and gaming consoles) is through family-friendly DNS filtering:",
      "• Cloudflare 1.1.1.1 for Families: Configure primary DNS to 1.1.1.3 and secondary DNS to 1.0.0.3 to automatically block adult and malicious domains network-wide.",
      "• OpenDNS FamilyShield: Set your router's DNS addresses to 208.67.222.123 and 208.67.220.123 to pre-block adult entertainment websites automatically.",
      "• Modern Wi-Fi Routers: Major router apps (Asus, Netgear, TP-Link, Google Nest, Eero) include built-in 'Parental Controls' toggles that restrict adult categories with a single click."
    ]
  },
  {
    num: "03",
    title: "DEVICE-SPECIFIC RESTRICTIONS & OPERATING SYSTEMS",
    content: [
      "• Apple iOS (iPhone & iPad): Open Settings > Screen Time > Content & Privacy Restrictions > Content Restrictions > Web Content, choose 'Limit Adult Websites', and add our domain under 'Never Allow'.",
      "• Google Android & Chrome: Use Google Family Link to manage supervised accounts, enforce Google SafeSearch, and block explicit URLs in Chrome.",
      "• Microsoft Windows: Set up family member accounts managed through Microsoft Family Safety to restrict web browsing and block adult material across Edge and Windows apps.",
      "• macOS: Navigate to System Settings > Screen Time > Content & Privacy > Web Content and enforce adult website restrictions."
    ]
  },
  {
    num: "04",
    title: "COMMERCIAL FILTERING & MONITORING SOFTWARE",
    content: [
      "Parents seeking comprehensive reporting, scheduled internet access, and real-time alerts can utilize reputable third-party parental control software solutions, such as:",
      "• Net Nanny (netnanny.com) - Advanced real-time content analysis and URL filtering.",
      "• Qustodio (qustodio.com) - Multi-platform screen time management and adult content blocking.",
      "• Bark (bark.us) - Comprehensive family safety monitoring across social media, apps, and browsers.",
      "• CyberPatrol / Norton Family - Enterprise-grade family web safety and website blocking."
    ]
  },
  {
    num: "05",
    title: "REPORTING UNDERAGE ACCESS",
    content: [
      "If you suspect a minor has accessed or submitted any inquiry to our website, please notify our safety desk immediately at abuse@adultxtube.com so we can take immediate protective action."
    ]
  }
];

export default function ParentalControls({ onBack }) {
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
              Parental <span>Controls</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              Guidance and tools for parents and guardians to restrict, block, and prevent access to adult content on home networks and personal devices.
            </p>

            <div className="dmca-warning-box">
              <strong>Strict Adults-Only (18+):</strong> 
              <span>We actively support and encourage the implementation of filtering technology to keep children safe online.</span>
            </div>
          </div>

          {/* Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {PARENTAL_SECTIONS.map((sec) => (
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

