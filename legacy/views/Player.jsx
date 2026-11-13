import React, { useState, useEffect } from 'react';
import { reactToVideo, getVideosPage } from '../lib/appwrite';
import Sidebar from '../components/Sidebar';
import GalleryCard from '../components/GalleryCard';

function VideoPlayerFrame({ url, item, idx, extractSrc }) {
  const [isLoading, setIsLoading] = useState(true);
  const cleanUrl = extractSrc(url);

  const isDirectVideo = (u) => {
    if (!u) return false;
    const lower = u.toLowerCase();
    return (
      lower.includes('.mp4') ||
      lower.includes('.webm') ||
      lower.includes('.ogg') ||
      lower.includes('.m3u8') ||
      lower.includes('.mov')
    );
  };

  return (
    <div className="tube-player-box">
      {isLoading && (
        <div className="tube-player-loading-placeholder">
          <img src={item.image} alt="" className="tube-player-poster" />
          <div className="tube-player-spinner-wrap">
            <div className="tube-player-spinner"></div>
          </div>
        </div>
      )}

      {isDirectVideo(cleanUrl) ? (
        <video
          src={cleanUrl}
          controls
          autoPlay
          playsInline
          poster={item.image}
          className="tube-player-media"
          onLoadedData={() => setIsLoading(false)}
        >
          Your browser does not support HTML5 video.
        </video>
      ) : (
        <iframe
          src={cleanUrl}
          className="tube-player-media"
          allow="autoplay; fullscreen; picture-in-picture"
          title={`${item.title} - Server ${idx + 1}`}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
}

export default function Player({ item, allVideos = [], onSelectVideo, onReport, onClose, onNavigateSection }) {
  const currentId = item.$id || item.id || item._id;

  const formattedDate = (() => {
    const rawDate = item.createdAt || item.$createdAt || item.timestamp;
    if (!rawDate) return 'Just now';
    
    // Check if valid date
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return 'Just now';

    const diffMs = Date.now() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  })();

  const [likes, setLikes] = useState(() => Number(item.likes) || 0);
  const [dislikes, setDislikes] = useState(() => Number(item.dislikes) || 0);
  const [userVote, setUserVote] = useState(() => {
    try {
      return localStorage.getItem(`vote_${currentId}`) || null;
    } catch (e) {
      return null;
    }
  });

  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    { name: 'Alex M.', time: '2 hours ago', text: 'Amazing quality! Thanks for sharing.' },
    { name: 'DarkRider', time: '1 day ago', text: 'One of the best scenes ever.' }
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLikes(Number(item.likes) || 0);
    setDislikes(Number(item.dislikes) || 0);
  }, [item]);

  const handleVote = async (type) => {
    if (userVote === type) return;
    const oldVote = userVote;
    setUserVote(type);

    if (type === 'like') {
      setLikes(prev => prev + 1);
      if (oldVote === 'dislike') setDislikes(prev => Math.max(0, prev - 1));
    } else {
      setDislikes(prev => prev + 1);
      if (oldVote === 'like') setLikes(prev => Math.max(0, prev - 1));
    }

    try {
      localStorage.setItem(`vote_${currentId}`, type);
    } catch (e) {}

    await reactToVideo(currentId, type);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList(prev => [
      { name: commentName.trim() || 'Anonymous', time: 'Just now', text: commentText.trim() },
      ...prev
    ]);
    setCommentText('');
  };

  const extractSrc = (url) => {
    if (!url) return '';
    let src = url;
    if (url.toLowerCase().includes('<iframe')) {
      const match = url.match(/src="([^"]+)"/i);
      src = match ? match[1] : url;
    }
    if (src) {
      if (!src.includes('autoplay=')) src += src.includes('?') ? '&autoplay=1' : '?autoplay=1';
      if (!src.includes('muted=')) src += src.includes('?') ? '&muted=1' : '?muted=1';
    }
    return src;
  };

  let embedUrls = [];
  try {
    embedUrls = item.embedUrl ? (item.embedUrl.startsWith('[') ? JSON.parse(item.embedUrl) : [item.embedUrl]) : [];
  } catch (e) {
    embedUrls = item.embedUrl ? [item.embedUrl] : [];
  }

  // Calculate percentage
  const totalVotes = likes + dislikes;
  const likePercent = totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : 92;

  // Local state for related videos so that even after browser tab restore / screen unlock it never disappears
  const [fetchedRelated, setFetchedRelated] = useState([]);

  useEffect(() => {
    // If allVideos from memory has videos, use them
    const validPassed = allVideos.filter(v => (v.$id || v.id || v._id) !== currentId);
    if (validPassed.length > 0) {
      setFetchedRelated(validPassed.slice(0, 10));
    } else {
      // If user refreshed or reopened phone screen, directly fetch related videos from backend
      getVideosPage({ 
        page: 1, 
        limit: 10, 
        search: item.category && item.category !== 'General' ? item.category : '',
        sort: 'popular'
      }).then(res => {
        if (res && res.videos && res.videos.length > 0) {
          setFetchedRelated(res.videos.filter(v => (v.$id || v.id || v._id) !== currentId).slice(0, 10));
        }
      });
    }
  }, [item, allVideos, currentId]);

  const related = fetchedRelated;

  return (
    <div className="tube-player-page">
      <div className="tube-player-layout">
        
        {/* Left Sticky Sidebar (matching home page) */}
        <Sidebar
          activeCategory=""
          onSelectCategory={() => onClose()}
          activeCountry={item?.country || 'ALL'}
          onSelectCountry={(c) => {
            onClose();
          }}
          activeSort="latest"
          onSelectSort={() => onClose()}
          onNavigateSection={(sec) => {
            if (onNavigateSection) {
              onNavigateSection(sec);
            } else {
              onClose();
            }
          }}
          currentSection="player"
        />

        {/* Center / Main Video Area */}
        <div className="tube-player-main-col">

          {/* Video Player + Right Advertisement Banner Row */}
          <div className="tube-player-video-row">
            {/* Left: Video Player Box */}
            <div className="tube-player-container">
              {embedUrls.length > 0 ? (
                embedUrls.map((url, idx) => (
                  <VideoPlayerFrame
                    key={idx}
                    url={url}
                    item={item}
                    idx={idx}
                    extractSrc={extractSrc}
                  />
                ))
              ) : (
                <div className="tube-player-empty">
                  <p>No video player source available for this item.</p>
                </div>
              )}
            </div>

            {/* Right: Advertisement Box */}
            <aside className="tube-player-ad-box">
              <div className="tube-player-ad-label">ADVERTISEMENT</div>
              <div className="tube-player-ad-content">
                <span className="tube-player-ad-icon" style={{ display: 'flex', color: '#777' }}>
                  <svg style={{ width: '22px', height: '22px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </span>
                <span className="tube-player-ad-text">Featured Sponsor Placement</span>
              </div>
            </aside>
          </div>

          {/* Title and stats bar */}
          <div className="tube-player-info-wrap">
            <h1 className="tube-player-title">{item.title}</h1>
            
            <div className="tube-player-stats-row">
              <div className="tube-player-stats-left">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg style={{ width: '13px', height: '13px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {item.duration || '10:24'}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg style={{ width: '13px', height: '13px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {(item.views || 0).toLocaleString()}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg style={{ width: '13px', height: '13px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Action Buttons: Like / Dislike / Share / Report */}
            <div className="tube-player-actions" style={{ marginTop: '12px' }}>
              <div className="tube-vote-group">
                <button 
                  onClick={() => handleVote('like')}
                  className={`tube-btn-vote ${userVote === 'like' ? 'voted' : ''}`}
                >
                  <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  <span>{likes}</span>
                </button>
                <button 
                  onClick={() => handleVote('dislike')}
                  className={`tube-btn-vote ${userVote === 'dislike' ? 'voted' : ''}`}
                >
                  <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
                  </svg>
                  <span>{dislikes}</span>
                </button>
              </div>
              
              <button className="tube-btn-tool" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <svg style={{ width: '13px', height: '13px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>

              <button onClick={onReport} className="tube-btn-tool" style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <svg style={{ width: '13px', height: '13px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                  <line x1="4" y1="22" x2="4" y2="15"/>
                </svg>
                Report
              </button>
            </div>
          </div>

          {/* Related Videos Section Header */}
          <div className="tube-section-divider">
            <div className="tube-section-title-wrap">
              <h3 className="tube-section-title active" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg style={{ width: '17px', height: '17px', color: '#888' }} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                Related Videos
              </h3>
            </div>
          </div>

          {/* Related Videos 5-Column Grid */}
          <div className="tube-video-grid" style={{ marginBottom: '40px' }}>
            {related.map(card => (
              <GalleryCard
                key={card.$id || card.id}
                card={card}
                onAction={() => onSelectVideo ? onSelectVideo(card) : null}
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
