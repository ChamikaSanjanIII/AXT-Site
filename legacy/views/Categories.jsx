import React, { useState, useEffect } from 'react';
import { getCategoryStats } from '../lib/appwrite';
import Sidebar from '../components/Sidebar';

export default function CategoriesPage({ onSelectCategory, onSelectCountry, activeCountry, onPageChange, onLoadingChange }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Curated category thumbnails matching public category images
  const CATEGORY_IMAGES = {
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
    'Lesbian': '/catagary/lesbian.jpg',
    'Erotica': 'https://picsum.photos/seed/erotica1/640/360',
    'Hentai': 'https://picsum.photos/seed/hentai1/640/360',
    'Behind the Scenes': 'https://picsum.photos/seed/bts1/640/360',
    'General': 'https://picsum.photos/seed/general1/640/360'
  };

  useEffect(() => {
    setIsLoading(true);
    if (onLoadingChange) onLoadingChange(true);
    getCategoryStats().then(data => {
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        setCategories([
          { name: 'Amateur', count: 420 },
          { name: 'Anal', count: 250 },
          { name: 'Asian', count: 380 },
          { name: 'Behind the Scenes', count: 180 },
          { name: 'Big Dick', count: 230 },
          { name: 'Big Tits', count: 520 },
          { name: 'Blonde', count: 340 },
          { name: 'Blowjob', count: 420 },
          { name: 'Brunette', count: 310 },
          { name: 'Compilation', count: 290 },
          { name: 'Cumshot', count: 190 },
          { name: 'Erotica', count: 140 },
          { name: 'Hardcore', count: 280 },
          { name: 'HD Video', count: 450 },
          { name: 'Hentai', count: 320 },
          { name: 'Homemade', count: 410 },
          { name: 'Hotlink', count: 160 },
          { name: 'Lesbian', count: 310 },
          { name: 'Pornstar', count: 390 },
          { name: 'POV', count: 350 },
          { name: 'Teen', count: 120 }
        ]);
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
        onSelectSort={(sort) => {
          onPageChange('home');
        }}
        onNavigateSection={onPageChange}
        currentSection="categories"
      />

      {/* Main Categories Area */}
      <main className="tube-main-content">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#777' }}>
            Loading categories...
          </div>
        ) : (
          /* Exact 6-Column Pill Rounded Categories Grid matching uploaded image */
          <div className="tube-categories-grid">
            {categories.map((cat, idx) => {
              const bgImg = CATEGORY_IMAGES[cat.name] || `https://picsum.photos/seed/cat${idx}/640/360`;
              return (
                <div
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className="tube-cat-pill-card"
                >
                  <img
                    src={bgImg}
                    alt={cat.name}
                    className="tube-cat-pill-img"
                    loading="lazy"
                  />
                  <div className="tube-cat-pill-overlay">
                    <span className="tube-cat-pill-title">{cat.name}</span>
                    {cat.count > 0 && (
                      <span className="tube-cat-pill-count">
                        {cat.count >= 1000 ? `${(cat.count / 1000).toFixed(1)}K` : cat.count}
                      </span>
                    )}
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

