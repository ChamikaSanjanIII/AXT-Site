import React, { useState } from 'react';

export default function GalleryCard({ card, onAction }) {
  const [imgError, setImgError] = useState(false);

  const imageUrl = card.image || (card.images && card.images[0]) || null;
  const rawId = card.id || card.$id || card._id || '';

  const duration = card.duration || (() => {
    const sum = rawId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mins = 4 + (sum % 16);
    const secs = 10 + (sum % 50);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  })();

  // Real likes from database (if 0 or null, strictly show 0)
  const likesCount = (() => {
    const l = Number(card.likes) || 0;
    if (l >= 1000000) return `${(l / 1000000).toFixed(1)}M`;
    if (l >= 1000) return `${(l / 1000).toFixed(0)}K`;
    return l.toString();
  })();

  const timeAgo = (() => {
    const rawDate = card.createdAt || card.$createdAt || card.timestamp;
    if (!rawDate) return '1h';
    const diffMs = Date.now() - new Date(rawDate).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`;
    return `${Math.floor(diffDays / 365)}y`;
  })();

  // Real views from database (if 0 or null, strictly show 0)
  const viewsCount = (() => {
    const v = Number(card.views) || 0;
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
    return v.toString();
  })();

  return (
    <div onClick={onAction} className="tube-card">
      {/* 16:9 Thumbnail container */}
      <div className="tube-thumb-box">
        <img
          src={imgError || !imageUrl ? `https://picsum.photos/seed/${rawId || 'pink'}0/640/360` : imageUrl}
          onError={() => setImgError(true)}
          alt={card.title}
          loading="lazy"
          className="tube-thumb-img"
        />

        {/* Bottom-Right: Duration Tag (Only time tag preserved) */}
        <span className="tube-badge-duration">{duration}</span>

        {/* Subtle Dark Gradient Hover Overlay */}
        <div className="tube-play-overlay">
          <div className="tube-play-circle">
            <svg style={{ width: '18px', height: '18px', fill: 'currentColor', marginLeft: '2px' }} viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Meta info below image */}
      <div className="tube-card-info">
        <h4 className="tube-card-title" title={card.title}>
          {card.title || 'Untitled Video'}
        </h4>

        {/* Meta info below image (Matching Screenshot: 2.1M  5d  ♡ 8K) */}
        <div className="tube-card-meta">
          <span className="tube-card-meta-views">{viewsCount}</span>
          <span className="tube-card-meta-time">{timeAgo}</span>
          <span className="tube-card-meta-likes">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{likesCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
