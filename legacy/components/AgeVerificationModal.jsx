import React, { useState } from 'react';

export default function AgeVerificationModal({ onConfirm, onNavigateLegal }) {
  const [remember30Days, setRemember30Days] = useState(true);

  const handleEnter = () => {
    try {
      const expiryDays = remember30Days ? 30 : 1;
      const expiryTime = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
      localStorage.setItem('pinkhorse_age_verified', JSON.stringify({ verified: true, expiresAt: expiryTime }));
    } catch (e) {
      // fallback
    }
    onConfirm();
  };

  const handleLeave = () => {
    window.location.href = 'https://www.google.com';
  };

  const handleLinkClick = (e, section) => {
    e.preventDefault();
    if (onNavigateLegal) {
      onNavigateLegal(section);
    }
  };

  return (
    <div className="age-modal-backdrop">
      <div className="age-modal-card">
        
        {/* Header Badge & Title */}
        <div className="age-modal-header">
          <div className="age-badge-pill">
            <span className="age-badge-red">18+</span>
            <span className="age-badge-text">ADULTS ONLY</span>
          </div>
          <h1 className="age-modal-title">Age verification</h1>
          <p className="age-modal-subtitle">
            This website contains adult content. You must be 18 or older, or meet the legal age required in your jurisdiction, to continue.
          </p>
        </div>

        {/* Info Grid (Age Confirmation & Functional Cookies) */}
        <div className="age-modal-grid">
          <div className="age-info-box">
            <div className="age-info-icon" style={{ color: '#ef4444' }}>
              <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <h3 className="age-info-title">Age confirmation</h3>
              <p className="age-info-desc">
                By entering, you confirm that you meet the legal age requirements to access adult content on this website.
              </p>
            </div>
          </div>

          <div className="age-info-box">
            <div className="age-info-icon" style={{ color: '#9ca3af' }}>
              <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a10 10 0 0 0 0 20"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className="age-info-title">Functional cookies</h3>
              <p className="age-info-desc">
                Used to remember your preferences and age confirmation while keeping essential site features working correctly.
              </p>
            </div>
          </div>
        </div>

        {/* Parental Controls Row */}
        <div 
          className="age-parental-box"
          onClick={(e) => handleLinkClick(e, 'parental-controls')}
          role="button"
          tabIndex={0}
          title="Go to Parental Controls"
        >
          <div className="age-parental-left">
            <span className="age-parental-icon" style={{ display: 'flex', color: '#9ca3af' }}>
              <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <div>
              <h3 className="age-info-title">Parental controls</h3>
              <p className="age-info-desc">Learn how to restrict access to adult content on this device.</p>
            </div>
          </div>
          <span className="age-parental-arrow" style={{ display: 'flex', color: '#777' }}>
            <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        {/* Bottom Actions Row: Remember Switch & Enter Button */}
        <div className="age-modal-actions-row">
          <div className="age-remember-wrap">
            <div className="age-remember-text">
              <span className="age-remember-title">Remember for 30 days</span>
              <span className="age-remember-subtitle">Otherwise, we'll ask you again after 24 hours.</span>
            </div>
            <label className="age-switch">
              <input
                type="checkbox"
                checked={remember30Days}
                onChange={(e) => setRemember30Days(e.target.checked)}
              />
              <span className="age-slider"></span>
            </label>
          </div>

          <div className="age-buttons-wrap">
            <button onClick={handleEnter} className="age-btn-enter">
              ENTER ADULTXTUBE
            </button>
            <button onClick={handleLeave} className="age-btn-leave">
              Leave this website
            </button>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="age-modal-footer-note">
          By continuing, you acknowledge our{' '}
          <a href="?page=terms" onClick={(e) => handleLinkClick(e, 'terms')}>
            Terms
          </a>{' '}
          and{' '}
          <a href="?page=privacy" onClick={(e) => handleLinkClick(e, 'privacy')}>
            Privacy Policy
          </a>
          .
        </div>

      </div>
    </div>
  );
}

