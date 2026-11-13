import React, { useState, useEffect, useRef } from 'react';
import { getSearchSuggestions } from '../lib/appwrite';

export default function Navbar({ 
  onSearch, 
  activeCountry, 
  setActiveCountry, 
  onPageChange, 
  currentSort, 
  onSortChange, 
  onOpenMobileMenu,
  currentSection,
  searchQuery,
  theme = 'dark',
  onToggleTheme
}) {
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchBoxRef = useRef(null);
  const inputRef = useRef(null);
  const isSearchSubmittedRef = useRef(false);
  const activeFetchIdRef = useRef(0);

  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll position to apply background color only when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep search input in sync if search query changes externally
  useEffect(() => {
    setSearchInput(searchQuery || '');
  }, [searchQuery]);

  // Fetch live autocomplete suggestions while typing
  useEffect(() => {
    if (isSearchSubmittedRef.current) {
      return;
    }

    const trimmed = searchInput.trim();
    if (!trimmed || trimmed.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchId = ++activeFetchIdRef.current;

    const timer = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(trimmed);
        if (fetchId !== activeFetchIdRef.current || isSearchSubmittedRef.current) {
          return;
        }
        if (Array.isArray(results) && results.length > 0) {
          setSuggestions(results);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        if (fetchId === activeFetchIdRef.current && !isSearchSubmittedRef.current) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive active tab dynamically from current page section, search query, and sort
  let activeTab = 'videos';
  if (currentSection === 'categories') {
    activeTab = 'categories';
  } else if (currentSection === 'pornstars' || currentSection === 'pornstar-profile') {
    activeTab = 'pornstars';
  } else if (currentSort === 'random') {
    activeTab = 'random';
  } else if (searchQuery && searchQuery.toLowerCase() === 'shorts') {
    activeTab = 'shorts';
  } else if (searchQuery && searchQuery.toLowerCase() === 'gif') {
    activeTab = 'gifs';
  } else if (currentSection === 'home' && (!searchQuery || searchQuery.toLowerCase() === 'general')) {
    activeTab = 'videos';
  }

  const COUNTRIES = [
    { code: 'ALL', label: 'All Countries' },
    { code: 'LK', label: 'Sri Lanka' },
    { code: 'IN', label: 'India' },
    { code: 'BD', label: 'Bangladesh' },
    { code: 'PK', label: 'Pakistan' },
    { code: 'CN', label: 'China' },
    { code: 'JP', label: 'Japan' },
    { code: 'KR', label: 'Korea' },
    { code: 'TW', label: 'Taiwan' }
  ];

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    isSearchSubmittedRef.current = true;
    activeFetchIdRef.current++;
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    onSearch(searchInput.trim());
  };

  const handleCloseSearch = () => {
    isSearchSubmittedRef.current = true;
    activeFetchIdRef.current++;
    setSearchInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    if (searchQuery) {
      onSearch('');
    }
    setShowMobileSearch(false);
  };

  const selectSuggestion = (title) => {
    isSearchSubmittedRef.current = true;
    activeFetchIdRef.current++;
    setSearchInput(title);
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    onSearch(title);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        selectSuggestion(suggestions[activeSuggestionIndex].title);
      } else {
        handleSearchSubmit(e);
      }
      return;
    }

    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    try {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="tube-search-match">{part}</span>
        ) : (
          part
        )
      );
    } catch (err) {
      return text;
    }
  };

  return (
    <header className={`tube-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Sticky Main Bar: Logo & Search */}
      <div className="tube-main-nav-sticky-wrap">
        <div className="tube-main-nav">
          {/* Mobile Hamburger Menu Toggle Button */}
          {!showMobileSearch && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="tube-mobile-hamburger-btn"
              title="Menu"
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Left: Brand Logo (Hidden on mobile only when search is actively open) */}
          <div 
            onClick={() => {
              onPageChange('home');
              onSortChange('latest');
            }}
            className={`tube-logo tube-header-logo-text ${showMobileSearch ? 'tube-logo-hidden-mobile' : ''}`}
          >
            <span className="tube-logo-adult">AdulT</span><span className="tube-logo-x">X</span><span className="tube-logo-tube">Tube</span>
          </div>

          {/* Center: Search Box (Desktop full, Mobile toggleable) */}
          <div 
            ref={searchBoxRef}
            className={`tube-search-box ${showMobileSearch ? 'mobile-active' : ''}`}
          >
            <form action="" onSubmit={handleSearchSubmit} style={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                ref={inputRef}
                type="search"
                enterKeyHint="search"
                value={searchInput}
                onChange={(e) => {
                  isSearchSubmittedRef.current = false;
                  setSearchInput(e.target.value);
                }}
                onFocus={() => {
                  if (suggestions.length > 0 && !isSearchSubmittedRef.current) setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search videos, models, categories..."
                className="tube-search-input"
                autoComplete="off"
              />
              {/* Search Submit Button inside the bar */}
              <button type="submit" className="tube-search-btn" title="Search" aria-label="Search">
                <svg style={{ width: '17px', height: '17px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="tube-search-dropdown">
                <ul className="tube-search-suggestions">
                  {suggestions.map((item, index) => (
                    <li
                      key={item.id || item.slug || index}
                      className={`tube-search-suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(item.title);
                      }}
                    >
                      <svg className="tube-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="tube-suggestion-title">
                        {highlightMatch(item.title, searchInput.trim())}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile Close Search Icon */}
            {showMobileSearch && (
              <button 
                type="button" 
                onClick={handleCloseSearch}
                className="tube-search-close-mobile"
                title="Close and clear search"
                aria-label="Close and clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action Area: Theme Toggle & Search Trigger */}
          <div 
            className={`tube-nav-right-actions ${showMobileSearch ? 'tube-hide-mobile' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {/* Theme Toggle Button (Dark / Light) */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="tube-theme-toggle-btn"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" strokeWidth="1.25" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Right Mobile Search Trigger Button */}
            {!showMobileSearch && (
              <button
                type="button"
                onClick={() => setShowMobileSearch(true)}
                className="tube-mobile-search-toggle"
                title="Search"
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nav Sub-Menu: Videos, Random, Shorts, Categories */}
      <div className="tube-nav-tabs">
        <div className="tube-tabs-left">
          <button
            onClick={() => {
              onSortChange('latest');
              onPageChange('home');
            }}
            className={`tube-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
          >
            {/* Clean Video Camera / Camcorder icon */}
            <svg style={{ width: '14px', height: '14px', color: '#888' }} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            Videos
          </button>

          <button
            onClick={() => {
              onSortChange('random');
              onPageChange('home');
            }}
            className={`tube-tab-btn ${activeTab === 'random' ? 'active' : ''}`}
          >
            {/* Random icon: shuffle */}
            <svg style={{ width: '13px', height: '13px', color: '#888' }} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="16 3 21 3 21 8"/>
              <line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/>
              <line x1="15" y1="15" x2="21" y2="21"/>
              <line x1="4" y1="4" x2="9" y2="9"/>
            </svg>
            Random
          </button>

          <button
            onClick={() => {
              onPageChange('categories');
            }}
            className={`tube-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          >
            {/* Categories icon: grid */}
            <svg style={{ width: '13px', height: '13px', color: '#888' }} fill="none" stroke="currentColor" strokeWidth="1.25" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Categories
          </button>

          <button
            onClick={() => {
              onPageChange('pornstars');
            }}
            className={`tube-tab-btn ${activeTab === 'pornstars' ? 'active' : ''}`}
          >
            {/* Pornstars icon: user */}
            <svg style={{ width: '13px', height: '13px', color: '#888' }} fill="none" stroke="currentColor" strokeWidth="1.25" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Pornstars
          </button>
        </div>
      </div>
    </header>
  );
}
