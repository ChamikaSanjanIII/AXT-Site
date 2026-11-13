import React, { useEffect } from 'react';

const MODERATION_SECTIONS = [
  {
    num: "01",
    title: "AUTOMATED BOT CRAWLING & RAPID REMOVAL DISPATCH",
    content: [
      "All video entries on AdultXTube are identified and aggregated solely via automated web spiders and bot crawlers searching the free public web. We do not produce, manually host, or inspect external media before bot ingestion.",
      "AdultXTube expressly disclaims all legal liability for media scraped automatically by bots. Because computerized crawlers can occasionally ingest undesirable or copyrighted links, our moderation framework is built around instantaneous removal: the moment a complaint or flag arrives, our team purges the entry and permanently blocks the link."
    ]
  },
  {
    num: "02",
    title: "PRE-INDEXING & INGESTION SCREENING",
    content: [
      "Before media entries are cataloged in our searchable database:",
      "• Source Verification: Links are accepted only from recognized publishers and hosting networks known to enforce performer age verifications.",
      "• Keyword & Blacklist Filtering: Ingestion algorithms automatically filter out prohibited terminology associated with underage or non-consensual themes.",
      "• Metadata Validation: Video titles, preview thumbnails, and tags are reviewed to prevent deceptive, misleading, or abusive labeling."
    ]
  },
  {
    num: "03",
    title: "POST-PUBLICATION MONITORING & COMMUNITY REPORTS",
    content: [
      "Because millions of new links emerge across the web, community assistance is a vital pillar of our moderation process:",
      "• User Reporting Queue: Every player page features a direct 'Report' button. Reports submitted by visitors are routed into an administrative queue evaluated 24/7.",
      "• Automated Quarantine: Items receiving multiple community flags are placed under temporary review or concealed from search results until a human moderator examines them.",
      "• Urgent Takedown Queue: Inquiries submitted via abuse@adultxtube.com or removal@adultxtube.com are prioritized for swift inspection."
    ]
  },
  {
    num: "04",
    title: "TAKEDOWN & PERMANENT BLACKLISTING ACTIONS",
    content: [
      "When content is confirmed to violate our standards, the following actions are executed immediately:",
      "1. Immediate Delisting: The link is permanently erased from the search directory, category grids, and player access.",
      "2. URL Blacklist: The target URL and originating source identifier are blacklisted to ensure the item cannot be re-indexed in the future.",
      "3. Law Enforcement Referral: Any content involving suspected minors or severe crimes is documented and forwarded to appropriate cyber protection agencies."
    ]
  },
  {
    num: "05",
    title: "CONTACT THE MODERATION TEAM",
    content: [
      "For questions regarding our moderation standards, or to report an issue requiring administrative attention, please reach our moderation officers directly at moderation@adultxtube.com."
    ]
  }
];

export default function Moderation({ onBack }) {
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
              Content <span>Moderation</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              How AdultXTube screens, monitors, and evaluates indexed content to preserve a secure and compliant platform for adult entertainment.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}>
                <span style={{ color: '#888', marginRight: '6px' }}>Moderation Inquiries:</span>
                <a href="mailto:moderation@adultxtube.com" style={{ color: '#d1fe17', fontWeight: 'bold', textDecoration: 'none' }}>
                  moderation@adultxtube.com
                </a>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {MODERATION_SECTIONS.map((sec) => (
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

