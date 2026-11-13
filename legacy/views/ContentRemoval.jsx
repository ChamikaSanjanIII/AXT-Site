import React, { useEffect } from 'react';

const REMOVAL_SECTIONS = [
  {
    num: "01",
    title: "AUTOMATED BOT INDEXING & ZERO LEGAL LIABILITY",
    content: [
      "AdultXTube operates strictly as an automated search index. The media links displayed on this site are NOT uploaded or manually selected by humans; they are crawled and aggregated automatically by web bots from freely accessible locations across the open internet.",
      "AdultXTube and its administrators assume zero legal liability or responsibility for media collected automatically by our indexing bots. However, because automated bots can sometimes index unwanted, copyright-protected, or non-compliant content, we enforce a strict instant-removal policy: any complained or flagged link is removed and expunged immediately without delay."
    ]
  },
  {
    num: "02",
    title: "VALID REASONS FOR IMMEDIATE CONTENT REMOVAL",
    content: [
      "We process removal requests with highest priority under the following categories:",
      "• Copyright Infringement: Authorized owners or copyright holders requesting takedown of their proprietary content.",
      "• Non-Consensual Content / Privacy Violations: Any individual depicted without their express knowledge, permission, or consent.",
      "• Performer Direct Requests: Models or content creators wishing to delist their videos or images from our search index.",
      "• Suspected Underage / Illegal Media: Any content suspected of violating child protection laws (investigated and deleted immediately with zero tolerance).",
      "• Defamatory or Harassing Material: Items that violate individual safety or contain harmful personal information."
    ]
  },
  {
    num: "03",
    title: "HOW TO SUBMIT AN EXPEDITED REMOVAL REQUEST",
    content: [
      "To ensure your request is fulfilled in the fastest possible timeframe (usually within 12 to 24 hours), please email our dedicated removal desk with the following details:",
      "1. Exact URL(s): Provide the full link(s) on AdultXTube where the content appears (e.g., https://.../?player=video-id).",
      "2. Reason for Request: Specify whether the request is based on copyright, performer privacy, non-consensual depiction, or illegal content.",
      "3. Identity or Representation: Confirm your relationship to the depicted individual or copyright owner.",
      "4. Official Direct Email: Send your request directly to removal@adultxtube.com or abuse@adultxtube.com with the subject line 'Expedited Removal Request'."
    ]
  },
  {
    num: "04",
    title: "IN-PLAYER QUICK REPORT BUTTON",
    content: [
      "For everyday visitors, each video player includes a dedicated 'Report' button (flag/triangle icon) positioned beneath the player screen. Selecting this button allows you to notify our moderation team instantly regarding broken links, miscategorized tags, or non-compliant media without leaving the page."
    ]
  },
  {
    num: "05",
    title: "REMOVING CONTENT FROM SOURCE SERVERS",
    content: [
      "Please note: Removing or delisting a video from AdultXTube eliminates access through our search directory, but because AdultXTube does not host the original files, the file may still exist on the third-party originating web server. For complete internet-wide elimination, you should also contact the host where the media file is natively hosted."
    ]
  }
];

export default function ContentRemoval({ onBack }) {
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
              Content <span>Removal Policy</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              All media links are gathered automatically by bots from the free internet. We bear no legal liability for crawled content and immediately remove any link upon receiving a complaint.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}>
                <span style={{ color: '#888', marginRight: '6px' }}>Direct Removal Desk:</span>
                <a href="mailto:removal@adultxtube.com" style={{ color: '#d1fe17', fontWeight: 'bold', textDecoration: 'none' }}>
                  removal@adultxtube.com
                </a>
              </div>
              <div style={{ background: '#181818', border: '1px solid #2a2a2a', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', color: '#bbb' }}>
                <strong style={{ color: '#fff' }}>Include Exact URLs:</strong> Supplying the exact URL ensures prompt delisting within 12–24 hours.
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {REMOVAL_SECTIONS.map((sec) => (
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

