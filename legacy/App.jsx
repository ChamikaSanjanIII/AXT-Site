import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GalleryCard from './components/GalleryCard';
import DMCA from './views/DMCA';
import Terms from './views/Terms';
import Privacy from './views/Privacy';
import Compliance2257 from './views/Compliance2257';
import ParentalControls from './views/ParentalControls';
import ContentRemoval from './views/ContentRemoval';
import CommunityGuidelines from './views/CommunityGuidelines';
import Moderation from './views/Moderation';
import Authorities from './views/Authorities';
import Support from './views/Support';
import Player from './views/Player';
import CategoriesPage from './views/Categories';
import CountriesPage from './views/Countries';
import PornstarsPage from './views/Pornstars';
import PornstarProfilePage from './views/PornstarProfile';
import ReportModal from './components/ReportModal';
import AgeVerificationModal from './components/AgeVerificationModal';
import InitialLoadingScreen from './components/InitialLoadingScreen';
import AdBlockDetector from './components/AdBlockDetector';
import Footer from './components/Footer';
import { getVideosPage, getVideoBySlug, incrementView, getCategoryLatestSections } from './lib/appwrite';

const PAGE_SIZE = 20; // 20 videos per page (e.g. 5 cols x 4 rows or 4 cols x 5 rows)

const HOME_TAGS = [
  'Homemade',
  'Hot',
  'POV',
  'Blonde',
  'Brunette',
  'Anal',
  'Big Tits',
  'Amateur',
  'Blowjob',
  'Hardcore',
  'Deepthroat',
  'Cumshot',
  'Sex',
  'Babe',
  'Teen',
  'Orgasm',
  'College',
  'Creampie',
  'MILF',
  'Big Ass',
  'Squirting',
  'Masturbation',
  'Compilation',
  'Threesome',
  'Lesbian',
  'Rough Sex',
  'Petite'
];

function getUrlState() {
  const params = new URLSearchParams(window.location.search);
  return {
    p: Math.max(1, parseInt(params.get('p')) || 1),
    country: params.get('country') || 'ALL',
    q: params.get('q') || '',
    video: params.get('video') || params.get('player') || '',
    verify: params.get('verify') || '',
    section: params.get('page') || '',
    model: params.get('model') || params.get('star') || '',
    sort: params.get('sort') || 'latest'
  };
}

const LEGAL_SECTIONS = [
  'terms',
  'privacy',
  '2257',
  'dmca',
  'parental-controls',
  'content-removal',
  'community-guidelines',
  'moderation',
  'authorities',
  'support'
];

export default function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    try {
      if (typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|bingbot|yandex|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|telegrambot|whatsapp|applebot/i.test(navigator.userAgent)) {
        return true;
      }
      const saved = localStorage.getItem('pinkhorse_age_verified');
      if (!saved) return false;
      const parsed = JSON.parse(saved);
      if (parsed.verified && parsed.expiresAt > Date.now()) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  });

  // Theme state: 'dark' (default) or 'light'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('adultxtube_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('adultxtube_theme', theme);
      if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.documentElement.classList.add('light-theme');
        document.documentElement.setAttribute('data-theme', 'light');
        const meta = document.getElementById('theme-color-meta');
        if (meta) meta.setAttribute('content', '#ffffff');
      } else {
        document.body.classList.remove('light-theme');
        document.documentElement.classList.remove('light-theme');
        document.documentElement.setAttribute('data-theme', 'dark');
        const meta = document.getElementById('theme-color-meta');
        if (meta) meta.setAttribute('content', '#0b0b0b');
      }
    } catch (e) { }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [currentSection, setCurrentSection] = useState(() => {
    const s = getUrlState();
    if (s.video) return 'player';
    if (s.model) return 'pornstar-profile';
    if (s.section === 'categories') return 'categories';
    if (s.section === 'countries') return 'countries';
    if (s.section === 'pornstars') return 'pornstars';
    if (s.section === 'pornstar-profile') return 'pornstar-profile';
    if (s.section === 'terms') return 'terms';
    if (s.section === 'privacy') return 'privacy';
    if (s.section === '2257') return '2257';
    if (s.section === 'dmca') return 'dmca';
    if (s.section === 'parental-controls') return 'parental-controls';
    if (s.section === 'content-removal') return 'content-removal';
    if (s.section === 'community-guidelines') return 'community-guidelines';
    if (s.section === 'moderation') return 'moderation';
    if (s.section === 'authorities') return 'authorities';
    if (s.section === 'support') return 'support';
    return 'home';
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPornstarSlug, setSelectedPornstarSlug] = useState(() => getUrlState().model || '');

  // Filters
  const [activeCountry, setActiveCountry] = useState(() => getUrlState().country);
  const [searchQuery, setSearchQuery] = useState(() => getUrlState().q);
  const [activeSort, setActiveSort] = useState(() => getUrlState().sort);
  const [viewMode, setViewMode] = useState('comfort');

  // Mobile drawer sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // PC Collapsed Sidebar Rail state (remembered in localStorage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('adultxtube_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('adultxtube_sidebar_collapsed', String(next));
      } catch (e) { }
      return next;
    });
  };

  // Pagination & data
  const [currentPageNum, setCurrentPageNum] = useState(() => getUrlState().p);
  const [totalPages, setTotalPages] = useState(1);
  const [videos, setVideos] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [categorySections, setCategorySections] = useState([]);
  const catSectionsSentinelRef = useRef(null);
  const catSectionsRequestedRef = useRef(false);

  useEffect(() => {
    if (currentSection !== 'home' || currentPageNum !== 1 || searchQuery || categorySections.length > 0 || catSectionsRequestedRef.current) {
      return;
    }
    const el = catSectionsSentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !catSectionsRequestedRef.current) {
          catSectionsRequestedRef.current = true;
          observer.disconnect();
          getCategoryLatestSections().then(data => {
            if (data && data.length > 0) {
              setCategorySections(data);
            }
          });
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [currentSection, currentPageNum, searchQuery, categorySections.length, isInitialLoadDone]);

  // Report Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportedItem, setReportedItem] = useState(null);

  const fetchPage = useCallback(async ({ page, country, search, sort = 'latest' }) => {
    setIsFetching(true);
    try {
      const result = await getVideosPage({
        page,
        limit: PAGE_SIZE,
        country: country !== 'ALL' ? country : '',
        search: search || '',
        sort: sort || 'latest'
      });
      setVideos(result.videos || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } finally {
      setIsFetching(false);
      setIsInitialLoadDone(true);
    }
  }, []);

  const pushHomeUrl = useCallback((pageNum, country, q, sort = 'latest') => {
    const url = new URL(window.location);
    if (pageNum > 1) url.searchParams.set('p', pageNum);
    else url.searchParams.delete('p');

    if (country && country !== 'ALL') url.searchParams.set('country', country);
    else url.searchParams.delete('country');

    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');

    if (sort && sort !== 'latest') url.searchParams.set('sort', sort);
    else url.searchParams.delete('sort');

    url.searchParams.delete('verify');
    url.searchParams.delete('player');
    url.searchParams.delete('video');
    url.searchParams.delete('page');

    window.history.pushState({}, '', url);
  }, []);

  // Always jump instantly to top on page or view changes (no smooth scrolling)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection, currentPageNum]);

  useEffect(() => {
    const onPopState = async () => {
      const s = getUrlState();
      setCurrentPageNum(s.p);
      setActiveCountry(s.country);
      setSearchQuery(s.q);
      setActiveSort(s.sort);

      if (s.video) {
        setCurrentSection('player');
        if (!selectedItem || (selectedItem.slug !== s.video && selectedItem.$id !== s.video && selectedItem.id !== s.video)) {
          const fetched = await getVideoBySlug(s.video);
          if (fetched) setSelectedItem(fetched);
        }
      } else if (s.model) {
        setSelectedPornstarSlug(s.model);
        setCurrentSection('pornstar-profile');
      } else if (s.section === 'categories') {
        setCurrentSection('categories');
      } else if (s.section === 'countries') {
        setCurrentSection('countries');
      } else if (s.section === 'pornstars') {
        setCurrentSection('pornstars');
      } else if (s.section === 'pornstar-profile') {
        setCurrentSection('pornstar-profile');
      } else if (s.section === 'terms') {
        setCurrentSection('terms');
      } else if (s.section === 'privacy') {
        setCurrentSection('privacy');
      } else if (s.section === '2257') {
        setCurrentSection('2257');
      } else if (s.section === 'dmca') {
        setCurrentSection('dmca');
      } else {
        setCurrentSection('home');
        fetchPage({ page: s.p, country: s.country, search: s.q, sort: s.sort });
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [fetchPage, selectedItem]);

  // Initial load / page reload: check URL params and retain page/video state
  useEffect(() => {
    const s = getUrlState();
    if (s.video) {
      setCurrentSection('player');
      getVideoBySlug(s.video).then(item => {
        if (item) {
          setSelectedItem(item);
          setIsInitialLoadDone(true);
        } else {
          // fallback home if not found
          setCurrentSection('home');
          fetchPage({ page: s.p, country: s.country, search: s.q, sort: s.sort });
        }
      });
    } else if (s.model) {
      setSelectedPornstarSlug(s.model);
      setCurrentSection('pornstar-profile');
      setIsInitialLoadDone(true);
    } else if (s.section === 'categories') {
      setCurrentSection('categories');
      setIsInitialLoadDone(true);
    } else if (s.section === 'countries') {
      setCurrentSection('countries');
      setIsInitialLoadDone(true);
    } else if (s.section === 'pornstars') {
      setCurrentSection('pornstars');
      setIsInitialLoadDone(true);
    } else if (s.section === 'pornstar-profile') {
      setCurrentSection('pornstar-profile');
      setIsInitialLoadDone(true);
    } else if (s.section === 'terms') {
      setCurrentSection('terms');
      setIsInitialLoadDone(true);
    } else if (s.section === 'privacy') {
      setCurrentSection('privacy');
      setIsInitialLoadDone(true);
    } else if (s.section === '2257') {
      setCurrentSection('2257');
      setIsInitialLoadDone(true);
    } else if (s.section === 'dmca') {
      setCurrentSection('dmca');
      setIsInitialLoadDone(true);
    } else {
      fetchPage({ page: s.p, country: s.country, search: s.q, sort: s.sort });
    }
  }, [fetchPage]);

  const handleCountryChange = (country) => {
    setActiveCountry(country);
    setCurrentPageNum(1);
    pushHomeUrl(1, country, searchQuery, activeSort);
    fetchPage({ page: 1, country, search: searchQuery });
    window.scrollTo(0, 0);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setCurrentPageNum(1);
    pushHomeUrl(1, activeCountry, q, activeSort);
    fetchPage({ page: 1, country: activeCountry, search: q });
    window.scrollTo(0, 0);
  };

  const handleSortChange = (sort) => {
    setActiveSort(sort);
    setCurrentPageNum(1);
    setSearchQuery(''); // Clear previous category search filter
    pushHomeUrl(1, activeCountry, '', sort);
    if (sort === 'random') {
      setVideos(prev => [...prev].sort(() => Math.random() - 0.5));
    } else {
      fetchPage({ page: 1, country: activeCountry, search: '', sort });
    }
    window.scrollTo(0, 0);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPageNum(page);
    pushHomeUrl(page, activeCountry, searchQuery, activeSort);
    fetchPage({ page, country: activeCountry, search: searchQuery, sort: activeSort });
    window.scrollTo(0, 0);
  };

  const handleAction = useCallback((item) => {
    const id = item.$id || item.id;
    if (id) incrementView(id);
    const slugOrId = item.slug || id;
    const url = new URL(window.location);
    url.searchParams.set('video', slugOrId);
    window.history.pushState({}, '', url);
    setSelectedItem(item);
    setCurrentSection('player');
    window.scrollTo(0, 0);
  }, []);

  const navigateToSection = useCallback((sec) => {
    const url = new URL(window.location);
    if (sec === 'home') {
      url.searchParams.delete('page');
      url.searchParams.delete('video');
      url.searchParams.delete('model');
    } else {
      url.searchParams.set('page', sec);
      url.searchParams.delete('video');
      url.searchParams.delete('model');
    }
    window.history.pushState({}, '', url);
    setCurrentSection(sec);
    window.scrollTo(0, 0);
  }, []);

  const closePlayer = useCallback(() => {
    const url = new URL(window.location);
    url.searchParams.delete('video');
    window.history.pushState({}, '', url);
    setCurrentSection('home');
    setSelectedItem(null);
  }, []);

  return (
    <div className="tube-app">
      {/* <AdBlockDetector /> */}

      <Navbar
        onSearch={handleSearch}
        activeCountry={activeCountry}
        setActiveCountry={handleCountryChange}
        onPageChange={(sec) => {
          const url = new URL(window.location);
          if (sec === 'home') {
            url.searchParams.delete('page');
            url.searchParams.delete('video');
            url.searchParams.delete('model');
          } else {
            url.searchParams.set('page', sec);
            url.searchParams.delete('video');
            url.searchParams.delete('model');
          }
          window.history.pushState({}, '', url);
          setCurrentSection(sec);
        }}
        currentSort={activeSort}
        onSortChange={handleSortChange}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        currentSection={currentSection}
        searchQuery={searchQuery}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="tube-sidebar-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="tube-sidebar-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              isMobile={true}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
              activeCategory={searchQuery}
              onSelectCategory={(cat) => {
                handleSearch(cat);
                setCurrentSection('home');
              }}
              activeCountry={activeCountry}
              onSelectCountry={(countryCode) => {
                handleCountryChange(countryCode);
                setCurrentSection('home');
              }}
              activeSort={activeSort}
              onSelectSort={handleSortChange}
              onNavigateSection={(sec) => {
                navigateToSection(sec);
                setIsMobileMenuOpen(false);
              }}
              currentSection={currentSection}
            />
          </div>
        </div>
      )}

      {currentSection === 'home' && (
        <div className="tube-body-container">
          {/* Left Sidebar (Always Visible on PC) */}
          <Sidebar
            activeCategory={searchQuery}
            onSelectCategory={handleSearch}
            activeCountry={activeCountry}
            onSelectCountry={handleCountryChange}
            activeSort={activeSort}
            onSelectSort={handleSortChange}
            onNavigateSection={navigateToSection}
            currentSection={currentSection}
          />

          {/* Main Video List */}
          <main className="tube-main-content">
            {/* Horizontal Tag Pills Row at the top of Home */}
            <div className="tube-tag-bar tube-tag-bar-home">
              {HOME_TAGS.map(tag => {
                const isActive = searchQuery.toLowerCase() === tag.toLowerCase();

                return (
                  <button
                    key={tag}
                    onClick={() => handleSearch(tag)}
                    className={`tube-tag-pill ${isActive ? 'active' : ''}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Video List */}
            {isFetching ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#666', fontSize: '12px' }}>
                Loading videos...
              </div>
            ) : videos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#777', fontSize: '13px' }}>
                No videos found. Try searching something else.
              </div>
            ) : (
              <div className={`tube-video-grid ${viewMode === 'compact' ? 'tube-grid-compact' : 'tube-grid-comfort'}`}>
                {videos.map(card => (
                  <GalleryCard
                    key={card.$id || card.id || card._id}
                    card={card}
                    onAction={() => handleAction(card)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isFetching && totalPages > 1 && (
              <div className="tube-pagination">
                <button
                  onClick={() => goToPage(currentPageNum - 1)}
                  disabled={currentPageNum === 1}
                  className="tube-page-arrow"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span className="tube-page-arrow-text">Prev</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => {
                    const delta = typeof window !== 'undefined' && window.innerWidth <= 640 ? 1 : 2;
                    return p === 1 || p === totalPages || Math.abs(p - currentPageNum) <= delta;
                  })
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === '...' ? (
                      <span key={`e-${idx}`} style={{ padding: '0 4px', color: '#555' }}>...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`tube-page-btn ${p === currentPageNum ? 'active' : ''}`}
                      >
                        {p}
                      </button>
                    )
                  )
                }

                <button
                  onClick={() => goToPage(currentPageNum + 1)}
                  disabled={currentPageNum === totalPages}
                  className="tube-page-arrow"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span className="tube-page-arrow-text">Next</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}

            {/* Sentinel for lazy-loading Category Rows when user scrolls down */}
            {currentPageNum === 1 && !searchQuery && categorySections.length === 0 && (
              <div ref={catSectionsSentinelRef} style={{ height: '1px', width: '100%' }} />
            )}

            {/* Category Rows Under Pagination (Home Page Only) */}
            {categorySections && categorySections.length > 0 && !searchQuery && (
              <div className="tube-cat-sections-wrap">
                {categorySections.map((sec) => (
                  <section key={sec.category} className="tube-cat-section-block">
                    <div className="tube-cat-section-header">
                      <div
                        className="tube-cat-section-title"
                        onClick={() => handleSearch(sec.category)}
                      >
                        <span>{sec.category}</span>
                        <span style={{ fontSize: '13px', color: '#888', fontWeight: 'normal' }}>
                          Latest Videos
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSearch(sec.category)}
                        className="tube-cat-viewmore-btn"
                      >
                        <span>View More</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>

                    <div className="tube-cat-video-grid">
                      {sec.videos.map((vid) => (
                        <GalleryCard
                          key={`cat-${sec.category}-${vid.$id || vid.id || vid._id}`}
                          card={vid}
                          onAction={() => handleAction(vid)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>
        </div>
      )}

      {currentSection === 'player' && selectedItem && (
        <Player
          item={selectedItem}
          allVideos={videos}
          onSelectVideo={handleAction}
          onClose={closePlayer}
          onNavigateSection={(sec) => {
            closePlayer();
            const url = new URL(window.location);
            url.searchParams.set('page', sec);
            url.searchParams.delete('video');
            url.searchParams.delete('model');
            window.history.pushState({}, '', url);
            setCurrentSection(sec);
            window.scrollTo(0, 0);
          }}
          onReport={() => {
            setReportedItem(selectedItem);
            setIsReportModalOpen(true);
          }}
        />
      )}

      {currentSection === 'categories' && (
        <CategoriesPage
          onSelectCategory={(catName) => {
            handleSearch(catName);
            setCurrentSection('home');
          }}
          activeCountry={activeCountry}
          onSelectCountry={(countryCode) => {
            handleCountryChange(countryCode);
            setCurrentSection('home');
          }}
          onPageChange={navigateToSection}
          onLoadingChange={setIsPageLoading}
        />
      )}

      {currentSection === 'countries' && (
        <CountriesPage
          onSelectCountry={(countryCode) => {
            handleCountryChange(countryCode);
            setCurrentSection('home');
          }}
          activeCountry={activeCountry}
          onSelectCategory={(catName) => {
            handleSearch(catName);
            setCurrentSection('home');
          }}
          onPageChange={navigateToSection}
          onLoadingChange={setIsPageLoading}
        />
      )}

      {currentSection === 'pornstars' && (
        <PornstarsPage
          onSelectPornstar={(slug) => {
            const url = new URL(window.location);
            url.searchParams.set('model', slug);
            url.searchParams.delete('page');
            url.searchParams.delete('video');
            window.history.pushState({}, '', url);
            setSelectedPornstarSlug(slug);
            setCurrentSection('pornstar-profile');
            window.scrollTo(0, 0);
          }}
          onSelectCategory={(catName) => {
            handleSearch(catName);
            setCurrentSection('home');
          }}
          onPageChange={(sec) => {
            const url = new URL(window.location);
            url.searchParams.set('page', sec);
            url.searchParams.delete('model');
            url.searchParams.delete('video');
            window.history.pushState({}, '', url);
            setCurrentSection(sec);
          }}
          onLoadingChange={setIsPageLoading}
        />
      )}

      {currentSection === 'pornstar-profile' && (
        <PornstarProfilePage
          pornstarSlug={selectedPornstarSlug}
          onSelectVideo={handleAction}
          onSelectCategory={(catName) => {
            handleSearch(catName);
            setCurrentSection('home');
          }}
          onPageChange={(sec) => {
            const url = new URL(window.location);
            if (sec === 'home') {
              url.searchParams.delete('page');
              url.searchParams.delete('model');
              url.searchParams.delete('video');
            } else {
              url.searchParams.set('page', sec);
              url.searchParams.delete('model');
              url.searchParams.delete('video');
            }
            window.history.pushState({}, '', url);
            setCurrentSection(sec);
          }}
          onLoadingChange={setIsPageLoading}
        />
      )}

      {currentSection === 'terms' && <Terms onBack={() => setCurrentSection('home')} />}
      {currentSection === 'privacy' && <Privacy onBack={() => setCurrentSection('home')} />}
      {currentSection === '2257' && <Compliance2257 onBack={() => setCurrentSection('home')} />}
      {currentSection === 'dmca' && <DMCA onBack={() => setCurrentSection('home')} />}
      {currentSection === 'parental-controls' && <ParentalControls onBack={() => setCurrentSection('home')} />}
      {currentSection === 'content-removal' && <ContentRemoval onBack={() => setCurrentSection('home')} />}
      {currentSection === 'community-guidelines' && <CommunityGuidelines onBack={() => setCurrentSection('home')} />}
      {currentSection === 'moderation' && <Moderation onBack={() => setCurrentSection('home')} />}
      {currentSection === 'authorities' && <Authorities onBack={() => setCurrentSection('home')} />}
      {currentSection === 'support' && <Support onBack={() => setCurrentSection('home')} />}

      <Footer 
        onPageChange={(sec) => {
          const url = new URL(window.location);
          if (sec === 'home') {
            url.searchParams.delete('page');
            url.searchParams.delete('video');
            url.searchParams.delete('model');
          } else {
            url.searchParams.set('page', sec);
            url.searchParams.delete('video');
            url.searchParams.delete('model');
          }
          window.history.pushState({}, '', url);
          setCurrentSection(sec);
        }}
        onSortChange={(sort) => {
          handleSortChange(sort);
          window.scrollTo(0, 0);
        }}
        onSearch={(query) => {
          handleSearch(query);
          window.scrollTo(0, 0);
        }}
      />

      {isReportModalOpen && reportedItem && (
        <ReportModal
          videoItem={reportedItem}
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setReportedItem(null);
          }}
        />
      )}
      {/* Age Verification Modal - Hidden while viewing legal pages (terms, privacy, dmca, etc.) */}
      {!isAgeVerified && !LEGAL_SECTIONS.includes(currentSection) && (
        <AgeVerificationModal
          onConfirm={() => setIsAgeVerified(true)}
          onNavigateLegal={(sec) => {
            const url = new URL(window.location);
            url.searchParams.set('page', sec);
            url.searchParams.delete('video');
            url.searchParams.delete('model');
            window.history.pushState({}, '', url);
            setCurrentSection(sec);
            window.scrollTo(0, 0);
          }}
        />
      )}

      {/* Global Site Loading Screen (Beeg Logo Animation) */}
      <InitialLoadingScreen
        isVisible={!isInitialLoadDone || isPageLoading || isFetching}
        isFirstLoad={!isInitialLoadDone}
      />
    </div>
  );
}
