import React, { useEffect } from 'react';

const TERMS_SECTIONS = [
  {
    num: "01",
    title: "ACCEPTANCE OF TERMS",
    content: [
      "By accessing, browsing, or using the AdultXTube website (collectively referred to as the 'Website', 'Platform', or 'Service'), you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions along with our Privacy Policy. If you do not agree to every provision contained herein, please discontinue using this website immediately.",
      "AdultXTube reserves the right to update, revise, or modify these Terms at any time without prior notice. Your continued use of the platform following the posting of modifications constitutes full acceptance of those revisions."
    ]
  },
  {
    num: "02",
    title: "AUTOMATED BOT INDEXING & ZERO LEGAL LIABILITY",
    content: [
      "Automated Crawler & Search Indexing: All video links, titles, and media previews presented on AdultXTube are gathered and indexed 100% automatically by automated web crawlers and robotic indexing algorithms ('bots') from publicly accessible locations across the open internet. We do NOT manually curate, select, produce, or upload any videos.",
      "Complete Disclaimer of Legal Liability: AdultXTube and its operators assume ABSOLUTELY NO LEGAL RESPONSIBILITY, LIABILITY, OR OBLIGATION for any content, videos, links, or materials indexed by our automated systems. We do not host any media files on our own servers.",
      "Instant Removal Upon Notice: Because our indexing systems operate robotically, unforeseen or objectionable third-party links may occasionally be captured by automated crawlers. We take complaints very seriously: the moment any valid report, takedown request, or complaint is received, our administration will IMMEDIATELY and permanently remove and blacklist that content without delay."
    ]
  },
  {
    num: "03",
    title: "STRICT AGE REQUIREMENT (18+ ADULTS ONLY)",
    content: [
      "You strictly affirm and represent that you are at least eighteen (18) years of age, or the legal age of majority in the country or jurisdiction where you reside or access this website from—whichever is higher.",
      "If you are under 18 years of age or under the applicable legal age of majority, you are strictly prohibited from viewing, accessing, or interacting with any portion of this site. We recommend parents and guardians utilize parental filtering software to restrict access by minors."
    ]
  },
  {
    num: "04",
    title: "ACCEPTABLE USE & PROHIBITED CONDUCT",
    content: [
      "Users agree not to use the platform for any illegal purpose. You may not attempt to compromise website security, bypass technical access restrictions, inject malicious code, or disrupt service operations.",
      "Posting, linking to, or transmitting content that is defamatory, abusive, harassing, hateful, or violates third-party intellectual property rights is strictly forbidden."
    ]
  },
  {
    num: "05",
    title: "ABSOLUTE ZERO TOLERANCE POLICY",
    content: [
      "AdultXTube enforces an uncompromising ZERO TOLERANCE policy against Child Sexual Abuse Material (CSAM), non-consensual sexual content, violence, torture, rape, or bestiality.",
      "Any detected or reported illegal material is deleted immediately upon notice, offending network identifiers are permanently banned, and all relevant details are reported to international law enforcement authorities."
    ]
  },
  {
    num: "06",
    title: "INTELLECTUAL PROPERTY & THIRD-PARTY MEDIA",
    content: [
      "The site interface, logos, graphics, brand design, and layout are proprietary assets protected by copyright and intellectual property legislation.",
      "All video files, previews, and performer assets displayed are the property of their respective creators, copyright holders, and legitimate producers. For takedown requests, please refer to our DMCA notice page."
    ]
  },
  {
    num: "07",
    title: "ABSOLUTE DISCLAIMER OF LIABILITY & WARRANTIES",
    content: [
      "THIS WEBSITE AND ALL AUTOMATED SEARCH ENTRIES ARE PROVIDED STRICTLY ON AN 'AS IS' AND 'AS AVAILABLE' BASIS. ADULTXTUBE, ITS OPERATORS, AGENTS, AND AFFILIATES EXPRESSLY DISCLAIM ALL REPRESENTATIONS, WARRANTIES, AND LEGAL RESPONSIBILITIES OF ANY KIND, WHETHER STATUTORY, EXPRESS, OR IMPLIED.",
      "UNDER NO CIRCUMSTANCES SHALL ADULTXTUBE OR ITS OPERATORS BE HELD LEGALLY LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES WHATSOEVER ARISING FROM CONTENT AUTOMATICALLY INDEXED BY THIRD-PARTY SOURCES OR EXTERNAL SITES. YOUR SOLE REMEDY FOR ANY OBJECTIONABLE CONTENT IS NOTIFYING US FOR PROMPT DELETION."
    ]
  },
  {
    num: "08",
    title: "INDEMNIFICATION & TERMINATION",
    content: [
      "You agree to indemnify, defend, and hold harmless AdultXTube and its operators against any claims, losses, liabilities, costs, or damages arising out of your violation of these Terms or misuse of the Service.",
      "We reserve the right to restrict, suspend, or terminate access for any user at our sole discretion without notice if fraudulent or non-compliant conduct is detected."
    ]
  }
];

export default function Terms({ onBack }) {
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
              Terms & <span>Conditions</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              The terms that govern access to AdultXTube. All media is indexed 100% automatically by robotic crawlers from free public sources. We accept no legal liability for external content and remove any reported links immediately.
            </p>

            <div className="dmca-warning-box">
              <strong>Adults-Only Platform (18+):</strong> 
              <span>By accessing the service you confirm that you satisfy the statutory age requirements (18+) in your jurisdiction.</span>
            </div>
          </div>

          {/* Terms Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {TERMS_SECTIONS.map((sec) => (
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

