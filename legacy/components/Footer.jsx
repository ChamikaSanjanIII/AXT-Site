import React from 'react';

export default function Footer({ onPageChange, onSortChange, onSearch }) {
  return (
    <footer className="tube-footer-v2">
      {/* Main Multi-Column Footer Grid */}
      <div className="tube-footer-columns">
        {/* Brand & Summary Column */}
        <div className="tube-footer-brand-col">
          <div 
            className="tube-logo tube-header-logo-text" 
            style={{ fontSize: '26px', marginBottom: '12px', cursor: 'pointer' }}
            onClick={() => {
              if (onPageChange) onPageChange('home');
              if (onSortChange) onSortChange('latest');
            }}
          >
            <span className="tube-logo-adult">AdulT</span><span className="tube-logo-x">X</span><span className="tube-logo-tube">Tube</span>
          </div>
          <p className="tube-footer-summary">
            AdultXTube is an automated search index where video links are crawled automatically by bots from free public web sources. We bear zero legal liability for indexed media and remove any reported links immediately upon notification.
          </p>
        </div>

        {/* Browse & Safety Row (Side-by-side on Mobile) */}
        <div className="tube-footer-row-mobile">
          {/* 1. BROWSE */}
          <div className="tube-footer-nav-col">
            <h4 className="tube-footer-col-title">BROWSE</h4>
            <ul className="tube-footer-list">
              <li>
                <button
                  onClick={() => {
                    if (onSortChange) onSortChange('latest');
                    onPageChange('home');
                  }}
                  className="tube-footer-btn"
                >
                  Videos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSortChange) onSortChange('random');
                    onPageChange('home');
                  }}
                  className="tube-footer-btn"
                >
                  Random
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onSearch) onSearch('Shorts');
                    onPageChange('home');
                  }}
                  className="tube-footer-btn"
                >
                  Shorts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('categories')}
                  className="tube-footer-btn"
                >
                  Categories
                </button>
              </li>
            </ul>
          </div>

          {/* 2. SAFETY */}
          <div className="tube-footer-nav-col">
            <h4 className="tube-footer-col-title">SAFETY</h4>
            <ul className="tube-footer-list">
              <li><button onClick={() => onPageChange('content-removal')} className="tube-footer-btn">Content Removal</button></li>
              <li><button onClick={() => onPageChange('parental-controls')} className="tube-footer-btn">Parental Controls</button></li>
              <li><button onClick={() => onPageChange('community-guidelines')} className="tube-footer-btn">Community Guidelines</button></li>
              <li><button onClick={() => onPageChange('moderation')} className="tube-footer-btn">Moderation</button></li>
            </ul>
          </div>
        </div>

        {/* 4. LEGAL */}
        <div className="tube-footer-nav-col">
          <h4 className="tube-footer-col-title">LEGAL</h4>
          <div className="tube-footer-legal-grid">
            <ul className="tube-footer-list">
              <li><button onClick={() => onPageChange('terms')} className="tube-footer-btn">Terms</button></li>
              <li><button onClick={() => onPageChange('dmca')} className="tube-footer-btn">DMCA</button></li>
              <li><button onClick={() => onPageChange('authorities')} className="tube-footer-btn">Official Requests</button></li>
            </ul>
            <ul className="tube-footer-list">
              <li><button onClick={() => onPageChange('privacy')} className="tube-footer-btn">Privacy Policy</button></li>
              <li><button onClick={() => onPageChange('2257')} className="tube-footer-btn">18 U.S.C. 2257</button></li>
              <li><button onClick={() => onPageChange('support')} className="tube-footer-btn">Support</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright and Badges */}
      <div className="tube-footer-bottom">
        <div className="tube-footer-copy">
          © 2026 AdultXTube
        </div>

        <div className="tube-footer-badges">
          <span className="tube-footer-18plus">
            18+ Adults only
          </span>

          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            className="tube-footer-telegram-btn"
          >
            <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.92 9.06c-.14.65-.53.81-1.07.51l-2.93-2.16-1.41 1.36c-.16.16-.29.29-.59.29l.21-2.98 5.43-4.91c.24-.21-.05-.33-.37-.12l-6.71 4.23-2.89-.9c-.63-.2-.64-.63.13-.93l11.29-4.35c.52-.19.98.13.83.9z" />
            </svg>
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
