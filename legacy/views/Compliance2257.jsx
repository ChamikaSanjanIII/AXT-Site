import React, { useEffect } from 'react';

const COMPLIANCE_SECTIONS = [
  {
    num: "01",
    title: "AUTOMATED BOT INDEXATION & ZERO LEGAL LIABILITY",
    content: [
      "AdultXTube is not a primary or secondary producer, creator, or host of any audiovisual content or depictions exhibited on this website.",
      "All video entries, links, and thumbnails across AdultXTube are automatically discovered and aggregated by computerized bots and search spiders querying the free open internet. We do not produce, review, edit, or upload any videos manually.",
      "Under no circumstances does AdultXTube or its operators assume any legal liability or responsibility for media collected automatically by our crawlers. If any inappropriate, infringing, or unwanted content is inadvertently indexed by our bots, we commit to removing and purging it IMMEDIATELY upon receiving notice or complaint.",
      "Because AdultXTube is strictly an automated search index and not a content creator, all records required under 18 U.S.C. § 2257 and 28 C.F.R. 75 are maintained by the original primary producers on the third-party source websites."
    ]
  },
  {
    num: "02",
    title: "MANDATORY AGE COMPLIANCE (18+ VERIFICATION)",
    content: [
      "All subjects, models, and performers appearing in visual depictions on this platform are required to be at least 18 years of age (or the legal age of majority in the jurisdiction where production took place) at the time of creation.",
      "Content submitters and affiliated distribution networks represent and warrant that full photographic proof of age and government-issued identification records are legally maintained in accordance with applicable statutory requirements."
    ]
  },
  {
    num: "03",
    title: "ZERO TOLERANCE FOR UNDERAGE & NON-CONSENSUAL CONTENT",
    content: [
      "AdultXTube maintains an absolute zero-tolerance standard against underage imagery (CSAM/CSAE) and non-consensual media. We proactively monitor content and promptly act on community reports.",
      "If any material is suspected of depicting minors or lacking proper age verification records, it is expunged from our index immediately, and associated details are reported to regulatory authorities."
    ]
  },
  {
    num: "04",
    title: "ASSISTANCE, CUSTODIAN REQUESTS & IMMEDIATE TAKEDOWNS",
    content: [
      "If you are a record custodian, performer, or authorized agent seeking clarification regarding a specific link, or if you wish to request immediate removal of a video, please contact our compliance desk directly at abuse@adultxtube.com.",
      "Please provide the exact URL(s) of the content in question so our team can process your request within 24 hours."
    ]
  }
];

export default function Compliance2257({ onBack }) {
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
              18 U.S.C. 2257 <span>Record-Keeping Statement</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              Information concerning federal record-keeping responsibilities. All entries are discovered automatically by bots from the open internet with zero operator liability; any complained content is deleted immediately.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}>
                <span style={{ color: '#888', marginRight: '6px' }}>Compliance & Abuse Desk:</span>
                <a href="mailto:abuse@adultxtube.com" style={{ color: '#d1fe17', fontWeight: 'bold', textDecoration: 'none' }}>
                  abuse@adultxtube.com
                </a>
              </div>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', color: '#bbb' }}>
                <strong style={{ color: '#fff' }}>Provide Exact URL:</strong> To report non-compliant content immediately, provide the specific video link or use the Report button beneath the player.
              </div>
            </div>
          </div>

          {/* 2257 Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {COMPLIANCE_SECTIONS.map((sec) => (
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

