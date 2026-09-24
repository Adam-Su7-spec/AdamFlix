import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  Bookmark, 
  PlayCircle, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useApp, AUTHORIZED_ADMIN_EMAIL } from '../../context/AppContext';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const { 
    currentRoute, 
    navigateTo, 
    currentUser, 
    logout, 
    openAuthModal, 
    movies,
    searchQuery,
    setSearchQuery,
    switchUserRole
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter live search suggestions
  const liveSuggestions = searchQuery.trim()
    ? movies
        .filter(m => 
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
          m.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setMobileSearchVisible(false);
      navigateTo('/search', { q: searchQuery.trim() });
    }
  };

  // Strictly check if current user is the authorized administrator
  const isAuthorizedAdmin = Boolean(
    currentUser && 
    currentUser.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );

  interface NavLinkItem {
    label: string;
    path: string;
    params?: Record<string, string>;
    isAdminBadge?: boolean;
  }

  const baseNavLinks: NavLinkItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'TV Shows', path: '/tv-shows' },
    { label: 'New Releases', path: '/movies', params: { filter: 'new' } },
    { label: 'Trending', path: '/movies', params: { filter: 'trending' } },
    { label: 'Genres', path: '/genres' },
  ];

  // The 'Admin' navbar link ONLY appears when logged in with ssouhaimat1999@gmail.com
  const navLinks: NavLinkItem[] = isAuthorizedAdmin
    ? [...baseNavLinks, { label: 'Admin', path: '/admin', isAdminBadge: true }]
    : baseNavLinks;

  const isActive = (path: string, params?: Record<string, string>) => {
    if (params?.filter) {
      return currentRoute === path && window.location.search.includes(params.filter);
    }
    return currentRoute === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080B12]/92 backdrop-blur-md border-b border-[#151B28] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark & Simple Play Icon */}
        <div className="flex items-center gap-8 shrink-0">
          <button 
            onClick={() => navigateTo('/')} 
            className="cursor-pointer text-left focus:outline-none"
            aria-label="AdamFlix Home"
          >
            <Logo showDomain={true} size="md" />
          </button>

          {/* Zone 2: Desktop 4-6 Clean Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.path, link.params);
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    navigateTo(link.path, link.params);
                  }}
                  className={`text-sm font-medium transition-colors relative py-1 focus:outline-none whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    active 
                      ? 'text-white font-semibold' 
                      : 'text-[#A7AFBF] hover:text-white'
                  } ${link.isAdminBadge ? 'text-[#7C5CFF] font-semibold hover:text-[#9b80ff]' : ''}`}
                >
                  {link.isAdminBadge && <ShieldCheck className="w-4 h-4 text-[#7C5CFF]" />}
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Search & Desktop Action Controls */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end max-w-xl">
          
          {/* Desktop Search Bar with Live Suggestions Dropdown */}
          <div ref={searchContainerRef} className="relative hidden md:block w-full max-w-xs xl:max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies and TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-[#101521] text-white text-xs sm:text-sm pl-9 pr-4 py-2 rounded-full border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] placeholder-[#A7AFBF]/60 transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#A7AFBF]" />
            </form>

            {/* Live Search Suggestion Popup */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#101521] border border-[#1E2638] rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-[#1E2638] flex items-center justify-between text-xs text-[#A7AFBF]">
                  <span>Suggestions for "{searchQuery}"</span>
                  <button 
                    onClick={handleSearchSubmit}
                    className="text-[#00D4FF] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                {liveSuggestions.length > 0 ? (
                  <div className="divide-y divide-[#151B28]">
                    {liveSuggestions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigateTo(item.type === 'movie' ? `/movie/${item.slug}` : `/tv-show/${item.slug}`, {
                            id: item.id,
                            title: item.title
                          });
                        }}
                        className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#151B28] transition-colors text-left cursor-pointer"
                      >
                        <img 
                          src={item.poster} 
                          alt={item.title} 
                          className="w-9 h-13 object-cover rounded bg-[#151B28] shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{item.title}</div>
                          <div className="text-xs text-[#A7AFBF] flex items-center gap-1.5 mt-0.5">
                            <span className="capitalize">{item.type === 'movie' ? 'Movie' : 'TV Series'}</span>
                            <span>·</span>
                            <span>{item.releaseYear}</span>
                            <span>·</span>
                            <span className="text-[#00D4FF] font-medium">★ {item.rating}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#A7AFBF]">
                    No matching titles found. Press Enter to view full search.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
            className="md:hidden p-2 text-[#A7AFBF] hover:text-white rounded-lg hover:bg-[#101521] focus:outline-none"
            aria-label="Toggle Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dedicated 'Admin Mode' Button: ONLY rendered if logged in with ssouhaimat1999@gmail.com */}
          {isAuthorizedAdmin && (
            <button
              onClick={() => navigateTo('/admin')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                currentRoute === '/admin'
                  ? 'bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/30 border border-[#9b80ff]'
                  : 'bg-[#7C5CFF]/15 hover:bg-[#7C5CFF]/25 text-[#7C5CFF] hover:text-white border border-[#7C5CFF]/40'
              }`}
              title="Administrator Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Mode</span>
            </button>
          )}

          {/* User Account / Sign In / Admin Portal */}
          {currentUser ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#101521] border border-transparent hover:border-[#1E2638] transition-all cursor-pointer focus:outline-none"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border border-[#7C5CFF]/60" 
                />
                <span className="hidden sm:block text-xs font-semibold text-white max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A7AFBF]" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#101521] border border-[#1E2638] rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-[#1E2638]">
                    <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-xs text-[#A7AFBF] truncate">{currentUser.email}</div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isAuthorizedAdmin && currentUser.role === 'admin' 
                          ? 'bg-[#7C5CFF]/20 text-[#7C5CFF] border border-[#7C5CFF]/40' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isAuthorizedAdmin && currentUser.role === 'admin' ? 'Administrator' : 'Standard Member'}
                      </span>
                      {isAuthorizedAdmin && (
                        <button
                          onClick={() => switchUserRole(currentUser.role === 'admin' ? 'user' : 'admin')}
                          className="text-[10px] text-[#00D4FF] hover:underline cursor-pointer"
                        >
                          Switch Role
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="py-1 text-xs text-[#A7AFBF]">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('/account', { tab: 'profile' });
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-[#151B28] hover:text-white transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#A7AFBF]" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('/account', { tab: 'watchlist' });
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-[#151B28] hover:text-white transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-[#A7AFBF]" />
                      My List
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('/account', { tab: 'continue' });
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-[#151B28] hover:text-white transition-colors cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4 text-[#A7AFBF]" />
                      Continue Watching
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('/account', { tab: 'settings' });
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-[#151B28] hover:text-white transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[#A7AFBF]" />
                      Settings
                    </button>

                    {/* Admin Dashboard Option: Strictly restricted to ssouhaimat1999@gmail.com */}
                    {isAuthorizedAdmin && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('/admin');
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2.5 hover:bg-[#151B28] text-[#7C5CFF] font-semibold transition-colors cursor-pointer border-t border-[#1E2638] mt-1 pt-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#7C5CFF]" />
                        Admin Dashboard
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#1E2638]">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('signin')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white hover:text-[#00D4FF] transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] hover:brightness-110 rounded-full shadow-md shadow-[#7C5CFF]/20 transition-all cursor-pointer whitespace-nowrap"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#A7AFBF] hover:text-white rounded-lg hover:bg-[#101521] focus:outline-none"
            aria-label="Toggle navigation drawer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {mobileSearchVisible && (
        <div className="md:hidden px-4 pb-3 pt-1 border-b border-[#1E2638] bg-[#080B12]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101521] text-white text-sm pl-9 pr-4 py-2 rounded-full border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#A7AFBF]" />
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 bottom-0 bg-[#080B12]/98 backdrop-blur-xl border-t border-[#151B28] z-40 flex flex-col p-6 overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path, link.params);
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo(link.path, link.params);
                  }}
                  className={`text-left text-lg font-medium px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    active 
                      ? 'bg-[#151B28] text-white font-bold border-l-4 border-[#7C5CFF]' 
                      : 'text-[#A7AFBF] hover:bg-[#101521] hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-[#1E2638] flex flex-col gap-3">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('/account', { tab: 'watchlist' });
                  }}
                  className="flex items-center gap-3 text-sm text-[#A7AFBF] hover:text-white px-4 py-2.5 rounded-lg hover:bg-[#101521]"
                >
                  <Bookmark className="w-5 h-5 text-[#7C5CFF]" />
                  My List
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('/account', { tab: 'continue' });
                  }}
                  className="flex items-center gap-3 text-sm text-[#A7AFBF] hover:text-white px-4 py-2.5 rounded-lg hover:bg-[#101521]"
                >
                  <PlayCircle className="w-5 h-5 text-[#00D4FF]" />
                  Continue Watching
                </button>
                {isAuthorizedAdmin && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('/admin');
                    }}
                    className="flex items-center gap-3 text-sm text-[#7C5CFF] font-semibold px-4 py-2.5 rounded-lg bg-[#7C5CFF]/10"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 text-sm text-rose-400 px-4 py-2.5 rounded-lg hover:bg-rose-500/10 mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="w-full py-3 text-center text-sm font-semibold rounded-xl border border-[#1E2638] text-white hover:bg-[#151B28]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('signup');
                  }}
                  className="w-full py-3 text-center text-sm font-bold rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white shadow-lg shadow-[#7C5CFF]/20"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
