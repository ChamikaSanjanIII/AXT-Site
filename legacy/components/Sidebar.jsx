import React, { useState, useEffect } from 'react';
import { getCategoryStats, getCountryStats } from '../lib/appwrite';

export default function Sidebar({ 
  activeCategory, 
  onSelectCategory, 
  activeCountry = 'ALL',
  onSelectCountry,
  activeSort, 
  onSelectSort, 
  onNavigateSection,
  currentSection,
  isMobile = false, 
  onCloseMobile 
}) {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCategoryStats().then(data => {
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories([
          { name: 'General', count: 1200 },
          { name: 'Asian', count: 380 },
          { name: 'Blowjob', count: 420 },
          { name: 'Brunette', count: 310 },
          { name: 'Big Tits', count: 520 },
          { name: 'Hardcore', count: 280 },
          { name: 'Amateur', count: 410 },
          { name: 'Cumshot', count: 190 },
          { name: 'Blonde', count: 340 },
          { name: 'Anal', count: 250 },
          { name: 'Teen', count: 120 },
          { name: 'Homemade', count: 180 },
          { name: 'POV', count: 220 },
          { name: 'MILF', count: 175 },
          { name: 'Lesbian', count: 150 },
          { name: 'HD Video', count: 90 },
          { name: 'Hotlink', count: 65 },
          { name: 'Action', count: 45 }
        ]);
      }
    });

    getCountryStats().then(data => {
      if (data && data.length > 0) {
        setCountries(data);
      } else {
        setCountries([
          { code: 'ALL', name: 'All Countries', flag: '🌐', count: 1200 },
          { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', count: 180 },
          { code: 'IN', name: 'India', flag: '🇮🇳', count: 350 },
          { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', count: 90 },
          { code: 'PK', name: 'Pakistan', flag: '🇵🇰', count: 110 },
          { code: 'NP', name: 'Nepal', flag: '🇳🇵', count: 45 },
          { code: 'CN', name: 'China', flag: '🇨🇳', count: 85 },
          { code: 'JP', name: 'Japan', flag: '🇯🇵', count: 140 },
          { code: 'KR', name: 'Korea', flag: '🇰🇷', count: 95 },
          { code: 'TW', name: 'Taiwan', flag: '🇹🇼', count: 40 },
          { code: 'TH', name: 'Thailand', flag: '🇹🇭', count: 65 },
          { code: 'VN', name: 'Vietnam', flag: '🇻🇳', count: 50 },
          { code: 'PH', name: 'Philippines', flag: '🇵🇭', count: 80 }
        ]);
      }
    });
  }, []);

  const handleItemClick = (fn, param) => {
    if (fn) fn(param);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const BROWSE_LINKS = [
    { id: 'latest', label: 'Latest videos' },
    { id: 'popular', label: 'Most popular' },
    { id: 'top_rated', label: 'Top rated' }
  ];

  return (
    <aside className={isMobile ? "tube-sidebar-mobile-content" : "tube-sidebar"}>
      {isMobile ? (
        <div className="tube-sidebar-mobile-header">
          <div className="tube-logo tube-header-logo-text" style={{ fontSize: '24px' }}>
            <span className="tube-logo-adult">AdulT</span><span className="tube-logo-x">X</span><span className="tube-logo-tube">Tube</span>
          </div>
          <button onClick={onCloseMobile} className="tube-sidebar-mobile-close">
            ✕
          </button>
        </div>
      ) : (
        <div className="tube-sidebar-pc-header">
          <span className="tube-sidebar-title" style={{ margin: 0 }}>Browse</span>
        </div>
      )}

      {/* Browse Group */}
      <div>
        {isMobile && <div className="tube-sidebar-title">Browse</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {BROWSE_LINKS.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(onSelectSort, item.id)}
              className={`tube-sidebar-btn ${activeSort === item.id && !activeCategory && currentSection === 'home' ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
          {onNavigateSection && (
            <button
              onClick={() => handleItemClick(onNavigateSection, 'pornstars')}
              className={`tube-sidebar-btn ${currentSection === 'pornstars' || currentSection === 'pornstar-profile' ? 'active' : ''}`}
            >
              Pornstars
            </button>
          )}
        </div>
      </div>

      {/* Real Dynamic Categories with Live Count (Top 10 + View More) */}
      <div style={{ marginTop: '16px' }}>
        <div className="tube-sidebar-title" style={{ margin: '0 0 10px 0' }}>Categories</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {categories.slice(0, 10).map(cat => (
            <button
              key={cat.name}
              onClick={() => handleItemClick(onSelectCategory, cat.name)}
              className={`tube-sidebar-btn ${activeCategory === cat.name ? 'active' : ''}`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="tube-sidebar-count">
                {cat.count >= 1000 ? `${(cat.count / 1000).toFixed(1)}K` : cat.count}
              </span>
            </button>
          ))}

          {/* 11th Item: View More Categories button */}
          {onNavigateSection && (
            <button
              type="button"
              onClick={() => handleItemClick(onNavigateSection, 'categories')}
              className={`tube-sidebar-btn ${currentSection === 'categories' ? 'active' : ''}`}
              style={{
                color: 'var(--primary-red)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                paddingBottom: '8px'
              }}
            >
              <span>View more categories</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Countries Section with Flag & Live Count (Top 10 + View More) */}
      {countries.length > 0 && onSelectCountry && (
        <div style={{ marginTop: '16px' }}>
          <div className="tube-sidebar-title" style={{ margin: '0 0 10px 0' }}>Countries</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {countries.slice(0, 10).map(c => {
              const isSelected = activeCountry === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => handleItemClick(onSelectCountry, c.code)}
                  className={`tube-sidebar-btn ${isSelected ? 'active' : ''}`}
                  title={c.name}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '14px', lineHeight: 1 }}>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </span>
                  {c.count !== undefined && (
                    <span className="tube-sidebar-count">
                      {c.count >= 1000 ? `${(c.count / 1000).toFixed(1)}K` : c.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* 11th Item: View More Countries button */}
            {onNavigateSection && (
              <button
                type="button"
                onClick={() => handleItemClick(onNavigateSection, 'countries')}
                className={`tube-sidebar-btn ${currentSection === 'countries' ? 'active' : ''}`}
                style={{
                  color: 'var(--primary-red)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  paddingBottom: '8px'
                }}
              >
                <span>View more countries</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
