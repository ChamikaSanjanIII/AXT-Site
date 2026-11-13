import React, { useState, useEffect } from 'react';
import { getCountryStats } from '../lib/appwrite';
import Sidebar from '../components/Sidebar';

export default function CountriesPage({ 
  onSelectCountry, 
  activeCountry, 
  onSelectCategory, 
  onPageChange, 
  onLoadingChange 
}) {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (onLoadingChange) onLoadingChange(true);

    getCountryStats().then(data => {
      if (data && data.length > 0) {
        setCountries(data);
      }
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }).catch(() => {
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    });
  }, []);

  return (
    <div className="tube-body-container">
      {/* Left Sidebar */}
      <Sidebar
        activeCategory=""
        onSelectCategory={onSelectCategory}
        activeCountry={activeCountry}
        onSelectCountry={onSelectCountry}
        activeSort="latest"
        onSelectSort={() => onPageChange('home')}
        onNavigateSection={onPageChange}
        currentSection="countries"
      />

      {/* Main Countries Area */}
      <main className="tube-main-content">
        <div style={{ margin: '8px 0 16px 0' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>Countries</h1>
          <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0 0' }}>Browse adult videos organized by country and region</p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#777' }}>
            Loading countries...
          </div>
        ) : countries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#777', fontSize: '13px' }}>
            No countries found.
          </div>
        ) : (
          <div className="tube-countries-grid">
            {countries.map((c) => {
              const isSelected = activeCountry === c.code;
              return (
                <div
                  key={c.code}
                  onClick={() => onSelectCountry(c.code)}
                  className="tube-cat-pill-card tube-country-pill-card"
                  style={{
                    background: isSelected ? 'var(--primary-red)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid var(--primary-red)' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}>
                    {c.flag || '🏳️'}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div 
                      style={{ 
                        fontSize: '13px', 
                        fontWeight: '700', 
                        color: isSelected ? '#000000' : '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.2'
                      }}
                    >
                      {c.name}
                    </div>
                    <div 
                      style={{ 
                        fontSize: '11px', 
                        color: isSelected ? 'rgba(0, 0, 0, 0.7)' : '#888888',
                        marginTop: '1px',
                        fontWeight: '600',
                        lineHeight: '1.2'
                      }}
                    >
                      {c.count !== undefined ? (c.count >= 1000 ? `${(c.count / 1000).toFixed(1)}K videos` : `${c.count} videos`) : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

