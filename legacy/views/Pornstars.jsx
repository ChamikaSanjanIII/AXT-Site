import React, { useState, useEffect } from 'react';
import { getPornstars } from '../lib/appwrite';
import Sidebar from '../components/Sidebar';

export default function PornstarsPage({ onSelectPornstar, onPageChange, onSelectCategory, onLoadingChange }) {
  const [pornstars, setPornstars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (onLoadingChange) onLoadingChange(true);
    getPornstars().then(data => {
      setPornstars(data || []);
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
        activeCountry="ALL"
        onSelectCountry={(c) => onPageChange('home')}
        activeSort="latest"
        onSelectSort={() => onPageChange('home')}
        onNavigateSection={onPageChange}
        currentSection="pornstars"
      />

      {/* Main Pornstars Area */}
      <main className="tube-main-content">
        <div className="tube-content-header" style={{ marginTop: '10px' }}>
          <div className="tube-content-heading">
            <span>Pornstars ({pornstars.length})</span>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#777' }}>
            Loading pornstars...
          </div>
        ) : pornstars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#666' }}>
            No pornstars found yet.
          </div>
        ) : (
          <div className="tube-pornstars-grid">
            {pornstars.map((star, idx) => {
              const starImg = star.avatar || `https://picsum.photos/seed/star${idx}/400/400`;
              return (
                <div
                  key={star.slug || star.name}
                  onClick={() => onSelectPornstar(star.slug || star.name)}
                  className="tube-pornstar-card"
                >
                  <div className="tube-pornstar-card-avatar-wrap">
                    {star.avatar ? (
                      <img
                        src={star.avatar}
                        alt={star.name}
                        className="tube-pornstar-card-avatar"
                        loading="lazy"
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#1f2937',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        fontWeight: 700
                      }}>
                        {star.name ? star.name.charAt(0).toUpperCase() : 'M'}
                      </div>
                    )}
                    {star.verified && (
                      <span className="tube-pornstar-card-badge" title="Verified">✓</span>
                    )}
                  </div>
                  <div className="tube-pornstar-card-info">
                    <h3 className="tube-pornstar-card-name truncate">{star.name}</h3>
                    <div className="tube-pornstar-card-stats">
                      <span>{star.followers || '10K'} followers</span>
                      <span>•</span>
                      <span>{star.videoCount !== undefined ? star.videoCount : 0} videos</span>
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

