import React, { useState, useEffect } from 'react';
import { getPornstarProfile } from '../lib/appwrite';
import GalleryCard from '../components/GalleryCard';
import Sidebar from '../components/Sidebar';

export default function PornstarProfilePage({
  pornstarSlug,
  onSelectVideo,
  onPageChange,
  onSelectCategory,
  onLoadingChange
}) {
  const [data, setData] = useState(null);
  const [activeTag, setActiveTag] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProfile(1, activeTag);
  }, [pornstarSlug, activeTag]);

  const fetchProfile = async (page = 1, tag = 'ALL') => {
    setIsLoading(true);
    if (onLoadingChange) onLoadingChange(true);
    try {
      const res = await getPornstarProfile(pornstarSlug, {
        page,
        limit: 24,
        tag: tag === 'ALL' ? '' : tag
      });
      setData(res);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  const pornstar = data?.pornstar;
  const videos = data?.videos || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1 };

  const tags = pornstar?.tags && pornstar.tags.length > 0
    ? pornstar.tags
    : ['Big Tits', 'Teen Girl', 'Big Ass', 'Creampie', 'Mom', 'POV', 'Young Girl', 'Russian', 'MILF', 'Blowjob', '18 Year Old', 'Hardcore', 'Longer Full', 'Compilation'];

  const socials = pornstar?.socialLinks || {};

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
        currentSection="pornstar-profile"
      />

      <main className="tube-main-content">
        {/* --- PORNSTAR HEADER PROFILE HERO (Exact Beeg Match) --- */}
        <section className="beeg-profile-hero">
          {/* Subtle Ambient Back-Glow */}
          <div className="beeg-profile-glow" />

          {/* Profile Header Main Info (PC & Mobile Adaptive) */}
          <div className="beeg-profile-top-row">
            {/* Round Avatar */}
            <div className="beeg-profile-avatar-wrap">
              {pornstar?.avatar ? (
                <img
                  src={pornstar.avatar}
                  alt={pornstar?.name || 'Model'}
                  className="beeg-profile-avatar-img"
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#1f2937',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '44px',
                  fontWeight: 700
                }}>
                  {pornstar?.name ? pornstar.name.charAt(0).toUpperCase() : 'M'}
                </div>
              )}
            </div>

            {/* Name, Followers, Video Count & Action Buttons */}
            <div className="beeg-profile-details">
              <h1 className="beeg-profile-name">
                {pornstar?.name || 'Comatozze'}
              </h1>

              <div className="beeg-profile-meta">
                <span className="beeg-meta-stat">
                  <strong>{pornstar?.followers || '380K'}</strong> Followers
                </span>
                <span className="beeg-meta-dot">•</span>
                <span className="beeg-meta-stat">
                  <strong>{pornstar?.videoCount !== undefined ? pornstar.videoCount : 257}</strong> Videos
                </span>
              </div>
            </div>
          </div>

          {/* Description / Bio */}
          {pornstar?.description && (
            <p className="beeg-profile-desc">
              {pornstar.description}
            </p>
          )}

          {/* Social Links Row (Exact pill and icon styling matching screenshot) */}
          <div className="beeg-social-row">
            {/* Primary Platform Button: FANSLY or ONLYFANS */}
            {(socials.fansly || socials.onlyfans) && (
              <a
                href={socials.fansly || socials.onlyfans}
                target="_blank"
                rel="noopener noreferrer"
                className="beeg-social-primary-btn"
              >
                <span className="beeg-social-primary-badge">
                  {socials.fansly ? (
                    /* Fansly Heart + Lock Icon */
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#fff" stroke="#1d9bf0"/>
                      <circle cx="12" cy="11" r="2" fill="#1d9bf0" stroke="none" />
                    </svg>
                  ) : (
                    /* OnlyFans Official Padlock / Fan Icon */
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18c0 .55-.45 1-1 1s-1-.45-1-1v-1.07c-2.83-.48-5-2.94-5-5.93 0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.99-2.17 5.45-5 5.93zM12 7c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                    </svg>
                  )}
                </span>
                <span className="beeg-social-primary-text">
                  {socials.fansly ? 'FANSLY.COM' : 'ONLYFANS.COM'} › {pornstar?.name?.toUpperCase() || 'COMATOZZE'}
                </span>
              </a>
            )}

            {/* X / Twitter */}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="beeg-social-circle-btn beeg-social-x"
                title="X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}

            {/* TikTok */}
            {socials.tiktok && (
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="beeg-social-circle-btn beeg-social-tiktok"
                title="TikTok"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-4.52z" />
                </svg>
              </a>
            )}

            {/* Instagram */}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="beeg-social-circle-btn beeg-social-insta"
                title="Instagram"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}

            {/* Instagram 2 */}
            {socials.instagram2 && (
              <a
                href={socials.instagram2}
                target="_blank"
                rel="noopener noreferrer"
                className="beeg-social-circle-btn beeg-social-insta"
                title="Instagram Backup"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}

            {/* Telegram */}
            {socials.telegram && (
              <a
                href={socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="beeg-social-circle-btn beeg-social-tg"
                title="Telegram"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </a>
            )}
          </div>

          {/* Tags Pills Row */}
          <div className="beeg-profile-tagbar">
            {tags.map(tag => {
              const isTagActive = activeTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(isTagActive ? 'ALL' : tag)}
                  className={`beeg-tag-pill ${isTagActive ? 'active' : ''}`}
                >
                  {tag.toLowerCase() === 'russian' && (
                    <span style={{ marginRight: '5px' }}>🇷🇺</span>
                  )}
                  {tag}
                </button>
              );
            })}
          </div>
        </section>

        {/* --- VIDEOS LIST SECTION --- */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666', fontSize: '13px' }}>
            Loading videos...
          </div>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#777', fontSize: '13px' }}>
            No videos found for this model.
          </div>
        ) : (
          <div>
            <div className="tube-video-grid tube-grid-comfort">
              {videos.map(card => (
                <GalleryCard
                  key={card.$id || card.id || card._id}
                  card={card}
                  onAction={() => onSelectVideo(card)}
                />
              ))}
            </div>

            {/* Pagination if more than 1 page */}
            {pagination.totalPages > 1 && (
              <div className="tube-pagination">
                <button
                  onClick={() => fetchProfile(currentPage - 1, activeTag)}
                  disabled={currentPage === 1}
                  className="tube-page-arrow"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => fetchProfile(p, activeTag)}
                    className={`tube-page-btn ${p === currentPage ? 'active' : ''}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => fetchProfile(currentPage + 1, activeTag)}
                  disabled={currentPage === pagination.totalPages}
                  className="tube-page-arrow"
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
