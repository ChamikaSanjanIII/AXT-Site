import React, { useState, useEffect, useMemo } from 'react';
import { getCategoryStats } from '../lib/appwrite';
import Sidebar from '../components/Sidebar';
import rawCategoriesData from '../categories_data.json';

export default function CategoriesPage({ onSelectCategory, onSelectCountry, activeCountry, onPageChange, onLoadingChange }) {
  const [dbCategoryCounts, setDbCategoryCounts] = useState({});
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all' or section id
  const [isLoading, setIsLoading] = useState(false);

  // Local static images mapping
  const LOCAL_IMAGES = {
    'Blowjob': '/catagary/Blowjob.jpg',
    'Brunette': '/catagary/Brunette.jpg',
    'Big Tits': '/catagary/Big%20Tits.jpg',
    'Hardcore': '/catagary/Hardcore.jpg',
    'Hotlink': '/catagary/Hotlink.jpg',
    'HD Video': '/catagary/hdvids.jpg',
    'Amateur': '/catagary/Amateur.jpg',
    'Cumshot': '/catagary/Cumshot.jpg',
    'Pornstar': '/catagary/Pornstar.jpg',
    'Blonde': '/catagary/Blonde.jpg',
    'Anal': '/catagary/Anal.jpg',
    'Asian': '/catagary/asian.jpg',
    'Big Dick': '/catagary/Big%20dick.jpg',
    'Teen': '/catagary/Teen.jpg',
    'Homemade': '/catagary/Homemade.jpg',
    'POV': '/catagary/POV.jpg',
    'Compilation': '/catagary/Compilation.jpg',
    'Lesbian': '/catagary/lesbian.jpg'
  };

  useEffect(() => {
    setIsLoading(true);
    if (onLoadingChange) onLoadingChange(true);

    getCategoryStats().then(data => {
      if (Array.isArray(data)) {
        const counts = {};
        data.forEach(item => {
          if (item && item.name) {
            counts[item.name.toLowerCase().trim()] = item.count;
          }
        });
        setDbCategoryCounts(counts);
      }
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    });
  }, []);

  const sections = rawCategoriesData.sections || [];

  // Filter sections based on active sub-tab
  const displayedSections = useMemo(() => {
    if (activeSubTab !== 'all') {
      return sections.filter(s => s.id === activeSubTab);
    }
    return sections;
  }, [sections, activeSubTab]);

  const scrollToSection = (id) => {
    setActiveSubTab('all');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

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
        currentSection="categories"
      />

      {/* Main Categories Area */}
      <main className="tube-main-content">
        
        {/* Section Navigation Quick Pills (Exact Home Tag Pills Size & Style) */}
        <div className="tube-tag-bar tube-tag-bar-home" style={{ marginBottom: '20px' }}>
          <button 
            type="button" 
            onClick={() => setActiveSubTab('all')}
            className={`tube-tag-pill ${activeSubTab === 'all' ? 'active' : ''}`}
          >
            All Sections
          </button>
          {sections.map(sec => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className={`tube-tag-pill ${activeSubTab === sec.id ? 'active' : ''}`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* Display Grouped Sections (xHamster Look & Feel) */}
        {displayedSections.map(sec => (
            <section key={sec.id} id={sec.id} style={{ marginBottom: '36px', scrollMarginTop: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{sec.title}</span>
                  <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--primary-red)' }}>
                    ({sec.items.length})
                  </span>
                </h2>
              </div>

              {/* 6-Column Card Grid */}
              <div className="tube-categories-grid">
                {sec.items.map((cat, idx) => {
                  const nameKey = cat.name.toLowerCase().trim();
                  const liveCount = dbCategoryCounts[nameKey] !== undefined ? dbCategoryCounts[nameKey] : null;
                  const bgImg = LOCAL_IMAGES[cat.name] || cat.image || `https://picsum.photos/seed/${cat.slug || idx}/640/360`;

                  return (
                    <div
                      key={cat.name}
                      onClick={() => onSelectCategory(cat.name)}
                      className="tube-cat-pill-card"
                      title={cat.name}
                    >
                      <img
                        src={bgImg}
                        alt={cat.name}
                        className="tube-cat-pill-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://picsum.photos/seed/${cat.slug || idx}/640/360`;
                        }}
                      />
                      <div className="tube-cat-pill-overlay">
                        <span className="tube-cat-pill-title">{cat.name}</span>
                        {liveCount !== null && liveCount > 0 && (
                          <span className="tube-cat-pill-count">
                            {liveCount >= 1000 ? `${(liveCount / 1000).toFixed(1)}K` : liveCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        }
      </main>
    </div>
  );
}
