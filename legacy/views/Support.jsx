import React, { useEffect, useState } from 'react';

const SUPPORT_CHANNELS = [
  {
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#d1fe17' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "General Inquiries & Help",
    email: "support@adultxtube.com",
    desc: "For general questions about searching, streaming, site usability, or feature suggestions."
  },
  {
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#d1fe17' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: "Content Delisting & Abuse",
    email: "abuse@adultxtube.com",
    desc: "To report inappropriate, broken, or infringing links automatically indexed by our bots."
  },
  {
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#d1fe17' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Copyright & DMCA",
    email: "dmca@adultxtube.com",
    desc: "For copyright holders submitting formal DMCA notices or intellectual property requests."
  },
  {
    icon: (
      <svg style={{ width: '22px', height: '22px', color: '#d1fe17' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Official Requests",
    email: "authorities@adultxtube.com",
    desc: "Dedicated channel for verified government, law enforcement, and judicial authorities."
  }
];

const FAQS_LIST = [
  {
    q: "How does AdultXTube find and add videos?",
    a: "AdultXTube operates as an automated search index. Computerized bots and web crawlers index publicly available links from free third-party hosts across the internet. We do not host user uploads or original media files."
  },
  {
    q: "How do I report a broken video link?",
    a: "Every video player page has a direct 'Report' button (flag/triangle icon) beneath the screen. Clicking it instantly notifies our moderation system to inspect and repair or delist the broken item."
  },
  {
    q: "How fast are content removal requests processed?",
    a: "Requests accompanied by complete URLs sent to abuse@adultxtube.com or removal@adultxtube.com are handled with top priority, typically within 12 to 24 hours."
  },
  {
    q: "Do you keep logs of my IP address or viewing history?",
    a: "No. AdultXTube operates a strict privacy-first architecture with zero IP logging and no requirement for user accounts or personal registrations."
  }
];

export default function Support({ onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [contactSubject, setContactSubject] = useState('general');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="dmca-page">
      <div className="dmca-bg-accent" />
      
      <div className="dmca-container custom-grid-padding">
        <div className="dmca-content-wrapper">
          
          {/* Header Section */}
          <div style={{ marginBottom: '40px' }}>
            <h1 className="dmca-title">
              Help & <span>Customer Support</span>
            </h1>
            <p className="dmca-description" style={{ marginTop: '14px', fontSize: '14px', lineHeight: '1.6' }}>
              Have questions, issues, or suggestions? Our support team is ready to assist you. Find direct email departments and common answers below.
            </p>
          </div>

          {/* Department Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {SUPPORT_CHANNELS.map((item, idx) => (
              <div 
                key={idx} 
                className="support-channel-card"
                style={{ 
                  borderRadius: '8px', 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <h3 className="support-card-header" style={{ fontSize: '15px', fontWeight: 'bold' }}>{item.title}</h3>
                </div>
                <p className="support-card-desc" style={{ fontSize: '12.5px', lineHeight: '1.5' }}>{item.desc}</p>
                <a 
                  href={`mailto:${item.email}`}
                  style={{ 
                    marginTop: 'auto', 
                    color: '#d1fe17', 
                    fontSize: '13px', 
                    fontWeight: 'bold', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {item.email} →
                </a>
              </div>
            ))}
          </div>

          {/* Quick Message Form */}
          <div className="support-form-box" style={{ borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
            <h2 className="support-form-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              Send Us a Message
            </h2>
            <p className="support-form-subtitle" style={{ fontSize: '13px', marginBottom: '20px' }}>
              Fill in your inquiry and our desk will respond via email as soon as possible.
            </p>

            {submitted ? (
              <div style={{ background: '#1c2818', border: '1px solid #2e5927', padding: '16px', borderRadius: '6px', color: '#73d13d', fontSize: '13px' }}>
                ✓ Thank you! Your message has been dispatched to our support administration queue.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <label className="support-label" style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>
                      Department
                    </label>
                    <select 
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="support-input"
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}
                    >
                      <option value="general">General Support (support@adultxtube.com)</option>
                      <option value="abuse">Broken Link / Content Removal (abuse@adultxtube.com)</option>
                      <option value="dmca">DMCA / Copyright (dmca@adultxtube.com)</option>
                      <option value="authorities">Official / Legal Requests (authorities@adultxtube.com)</option>
                    </select>
                  </div>
                  <div>
                    <label className="support-label" style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>
                      Your Email (Optional for reply)
                    </label>
                    <input 
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="support-input"
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="support-label" style={{ display: 'block', fontSize: '12px', marginBottom: '6px' }}>
                    Message / Video URL
                  </label>
                  <textarea 
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your issue or provide the exact video link..."
                    required
                    className="support-input"
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      borderRadius: '6px',
                      fontSize: '13px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <button 
                    type="submit"
                    className="tube-cat-viewmore-btn"
                    style={{ padding: '10px 24px', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                  >
                    Submit Request →
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* FAQ Accordion Section */}
          <div style={{ marginTop: '20px' }}>
            <h2 className="support-faq-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FAQS_LIST.map((faq, idx) => (
                <div key={idx} className="dmca-card" style={{ padding: '16px 0' }}>
                  <h3 className="support-faq-q" style={{ fontSize: '14.5px', fontWeight: 'bold', marginBottom: '6px' }}>
                    Q: {faq.q}
                  </h3>
                  <p className="dmca-card-text">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

