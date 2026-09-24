import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Movie, 
  User, 
  WatchlistItem, 
  ContinueWatchingItem, 
  WatchHistoryItem, 
  HomepageConfig,
  UserSettings,
  QualityType,
  Episode,
  Season,
  OtpVerificationState
} from '../types';
import { 
  INITIAL_MOVIES, 
  INITIAL_USER, 
  DEFAULT_HOMEPAGE_CONFIG 
} from '../data/mockData';
import { authenticateWithGoogle, isStrictGmail } from '../services/authService';

export const AUTHORIZED_ADMIN_EMAIL = 'ssouhaimat1999@gmail.com';

export const isUserAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  return user.email.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
};

interface AppContextType {
  // Catalog
  movies: Movie[];
  addMovie: (movieData: Omit<Movie, 'id' | 'slug' | 'views' | 'addedAt'>) => void;
  updateMovie: (id: string, updates: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  addTVShow: (showData: Omit<Movie, 'id' | 'slug' | 'views' | 'addedAt'>) => void;
  addSeason: (showId: string, seasonTitle: string) => void;
  addEpisode: (showId: string, seasonNumber: number, episodeData: Omit<Episode, 'id'>) => void;

  // Homepage Config
  homepageConfig: HomepageConfig;
  updateHomepageConfig: (config: HomepageConfig) => void;

  // Authentication & User
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  initiateGoogleLogin: (email: string, name?: string, avatar?: string) => Promise<{ success: boolean; requiresOtp?: boolean; error?: string }>;
  logout: () => void;
  switchUserRole: (role: 'admin' | 'user') => void;

  // OTP Verification for New Accounts
  otpVerificationState: OtpVerificationState;
  completeOtpVerification: (user: User) => void;
  cancelOtpVerification: () => void;

  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (contentId: string) => void;
  isInWatchlist: (contentId: string) => boolean;

  // Continue Watching
  continueWatching: ContinueWatchingItem[];
  updateContinueWatching: (item: {
    contentId: string;
    type: 'movie' | 'tv';
    title: string;
    poster: string;
    backdrop: string;
    seasonNumber?: number;
    episodeNumber?: number;
    episodeTitle?: string;
    progressSeconds: number;
    durationSeconds: number;
  }) => void;
  removeFromContinueWatching: (contentId: string) => void;

  // Watch History
  watchHistory: WatchHistoryItem[];
  recordWatchHistory: (movie: Movie, seasonNumber?: number, episodeNumber?: number) => void;
  clearWatchHistory: () => void;

  // User Settings
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;

  // Routing / Navigation
  currentRoute: string;
  routeParams: Record<string, string>;
  navigateTo: (path: string, params?: Record<string, string>) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth Modal
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'signin' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (message: string) => void;

  // Statistics
  stats: {
    totalMovies: number;
    totalTVShows: number;
    totalUsers: number;
    totalViews: number;
    totalEpisodes: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Movies & TV Catalog
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('adamflix_movies');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MOVIES;
  });

  useEffect(() => {
    localStorage.setItem('adamflix_movies', JSON.stringify(movies));
  }, [movies]);

  // 2. Homepage Config
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    const saved = localStorage.getItem('adamflix_home_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_HOMEPAGE_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('adamflix_home_config', JSON.stringify(homepageConfig));
  }, [homepageConfig]);

  // 3. User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('adamflix_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Strictly verify if stored user is the single authorized admin
          const isAllowedAdmin = parsed.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
          return {
            ...parsed,
            role: isAllowedAdmin ? 'admin' : 'user'
          };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER;
  });

  // Strict OTP Verification State for New Account Activation
  const [otpVerificationState, setOtpVerificationState] = useState<OtpVerificationState>({
    isPending: false,
    email: '',
    maskedEmail: ''
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('adamflix_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('adamflix_user');
    }
  }, [currentUser]);

  // 4. Watchlist
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('adamflix_watchlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'wl-1',
        contentId: 'm1',
        type: 'movie',
        title: 'Chronicles of the Void',
        poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        backdrop: '/src/assets/images/hero_scifi_voyage_1790165629911.jpg',
        rating: 9.3,
        releaseYear: 2026,
        quality: '4K',
        genres: ['Science Fiction', 'Adventure'],
        addedAt: '2026-03-15'
      },
      {
        id: 'wl-2',
        contentId: 'tv1',
        type: 'tv',
        title: 'Chronosphere: Syndicate',
        poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        backdrop: '/src/assets/images/backdrop_neon_noir_1790165645799.jpg',
        rating: 9.4,
        releaseYear: 2026,
        quality: '4K',
        genres: ['Science Fiction', 'Action'],
        addedAt: '2026-03-18'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('adamflix_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // 5. Continue Watching
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>(() => {
    const saved = localStorage.getItem('adamflix_continue_watching');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'cw-1',
        contentId: 'm2',
        type: 'movie',
        title: 'Neon Syndicate: Tokyo 2088',
        poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
        backdrop: '/src/assets/images/backdrop_neon_noir_1790165645799.jpg',
        progressSeconds: 4320,
        durationSeconds: 8040,
        percentage: 54,
        updatedAt: '2026-03-21'
      },
      {
        id: 'cw-2',
        contentId: 'tv1',
        type: 'tv',
        title: 'Chronosphere: Syndicate',
        poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        backdrop: '/src/assets/images/backdrop_neon_noir_1790165645799.jpg',
        seasonNumber: 1,
        episodeNumber: 1,
        episodeTitle: 'Fractured Timeline',
        progressSeconds: 2160,
        durationSeconds: 3240,
        percentage: 67,
        updatedAt: '2026-03-22'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('adamflix_continue_watching', JSON.stringify(continueWatching));
  }, [continueWatching]);

  // 6. Watch History
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() => {
    const saved = localStorage.getItem('adamflix_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'wh-1',
        contentId: 'm4',
        type: 'movie',
        title: 'Velocity: Overdrive',
        poster: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80',
        watchedAt: 'March 20, 2026',
        percentage: 100
      },
      {
        id: 'wh-2',
        contentId: 'tv1',
        type: 'tv',
        title: 'Chronosphere: Syndicate',
        poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        seasonNumber: 1,
        episodeNumber: 1,
        watchedAt: 'March 21, 2026',
        percentage: 67
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('adamflix_history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  // 7. User Settings
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('adamflix_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      preferredQuality: '4K',
      autoPlayNext: true,
      defaultSubtitles: 'English',
      audioLanguage: 'English'
    };
  });

  useEffect(() => {
    localStorage.setItem('adamflix_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  // 8. Navigation State (Supports Clean URLs and history sync)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    return path && path !== '/' ? path : '/';
  });

  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  const navigateTo = (path: string, params: Record<string, string> = {}) => {
    // If account verification is pending, block browsing/streaming until OTP is confirmed
    if (otpVerificationState.isPending) {
      showToast('Account Activation Required: Enter the 6-digit code sent to your Gmail to unlock AdamFlix.');
      return;
    }

    setCurrentRoute(path);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update document title dynamically for SEO
    if (path === '/') {
      document.title = 'AdamFlix – Stream Movies & TV Shows Online in 4K UHD';
    } else if (path === '/movies') {
      document.title = 'Movies – Explore Blockbusters & Cinematic Hits | AdamFlix';
    } else if (path === '/tv-shows') {
      document.title = 'TV Shows – Binge Trending Series & Originals | AdamFlix';
    } else if (path === '/genres') {
      document.title = 'Browse Genres – Action, Sci-Fi, Drama & More | AdamFlix';
    } else if (path.startsWith('/genre/')) {
      document.title = `${params.genre || 'Genre'} Movies & Series | AdamFlix`;
    } else if (path.startsWith('/movie/')) {
      document.title = `${params.title || 'Movie Details'} | AdamFlix`;
    } else if (path.startsWith('/tv-show/')) {
      document.title = `${params.title || 'TV Series'} | AdamFlix`;
    } else if (path.startsWith('/watch/')) {
      document.title = `Watching ${params.title || 'Content'} | AdamFlix Player`;
    } else if (path === '/account') {
      document.title = 'My Account & Watchlist | AdamFlix';
    } else if (path === '/admin') {
      document.title = 'Admin Studio & Content Manager | AdamFlix';
    } else if (path === '/search') {
      document.title = `Search Results | AdamFlix`;
    }
  };

  // 9. Search & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 10. Catalog Operations
  const addMovie = (movieData: Omit<Movie, 'id' | 'slug' | 'views' | 'addedAt'>) => {
    const slug = movieData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newMovie: Movie = {
      ...movieData,
      id: `m-${Date.now()}`,
      slug,
      views: 0,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setMovies(prev => [newMovie, ...prev]);
    showToast(`Movie "${newMovie.title}" published successfully!`);
  };

  const updateMovie = (id: string, updates: Partial<Movie>) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    showToast('Content updated successfully.');
  };

  const deleteMovie = (id: string) => {
    const target = movies.find(m => m.id === id);
    setMovies(prev => prev.filter(m => m.id !== id));
    showToast(`"${target?.title || 'Item'}" was removed.`);
  };

  const addTVShow = (showData: Omit<Movie, 'id' | 'slug' | 'views' | 'addedAt'>) => {
    const slug = showData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newShow: Movie = {
      ...showData,
      id: `tv-${Date.now()}`,
      slug,
      type: 'tv',
      views: 0,
      addedAt: new Date().toISOString().split('T')[0],
      seasons: showData.seasons || [
        {
          seasonNumber: 1,
          title: 'Season 1',
          episodes: []
        }
      ]
    };
    setMovies(prev => [newShow, ...prev]);
    showToast(`TV Show "${newShow.title}" published successfully!`);
  };

  const addSeason = (showId: string, seasonTitle: string) => {
    setMovies(prev => prev.map(m => {
      if (m.id !== showId) return m;
      const currentSeasons = m.seasons || [];
      const newSeasonNumber = currentSeasons.length + 1;
      const newSeason: Season = {
        seasonNumber: newSeasonNumber,
        title: seasonTitle || `Season ${newSeasonNumber}`,
        episodes: []
      };
      return {
        ...m,
        seasons: [...currentSeasons, newSeason]
      };
    }));
    showToast('New season added successfully.');
  };

  const addEpisode = (showId: string, seasonNumber: number, episodeData: Omit<Episode, 'id'>) => {
    setMovies(prev => prev.map(m => {
      if (m.id !== showId) return m;
      const seasons = (m.seasons || []).map(s => {
        if (s.seasonNumber !== seasonNumber) return s;
        const newEp: Episode = {
          ...episodeData,
          id: `ep-${Date.now()}`
        };
        return {
          ...s,
          episodes: [...s.episodes, newEp]
        };
      });
      return { ...m, seasons };
    }));
    showToast(`Episode "${episodeData.title}" added successfully.`);
  };

  // 11. Homepage Config
  const updateHomepageConfig = (config: HomepageConfig) => {
    setHomepageConfig(config);
    showToast('Homepage layout updated successfully!');
  };

  // 12. Authentication & Strict Google OAuth 2.0 (Gmail-Only)
  const initiateGoogleLogin = async (email: string, name?: string, avatar?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Strict Domain Validation: Reject anything not ending in @gmail.com
    if (!isStrictGmail(cleanEmail)) {
      showToast('Access Denied: Only official @gmail.com accounts are permitted on AdamFlix.');
      return { 
        success: false, 
        error: 'Only @gmail.com accounts are permitted.' 
      };
    }

    const authRes = await authenticateWithGoogle({ email: cleanEmail, name, avatar });

    if (!authRes.success) {
      showToast(authRes.message || 'Authentication error.');
      return { success: false, error: authRes.error };
    }

    // 2. New User / Unverified Account -> Trigger 6-Digit OTP Activation Flow
    if (authRes.requiresOtp) {
      setOtpVerificationState({
        isPending: true,
        email: cleanEmail,
        name: authRes.name,
        maskedEmail: authRes.maskedEmail || cleanEmail,
        tempSessionId: authRes.tempSessionId,
        expiresAt: authRes.expiresAt,
        devOtpCode: authRes.devOtpCode
      });
      setIsAuthModalOpen(false);
      showToast(`Verification code dispatched to ${cleanEmail}`);
      return { success: true, requiresOtp: true };
    }

    // 3. Verified Returning User
    if (authRes.user) {
      setCurrentUser(authRes.user);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${authRes.user.name}!`);
      return { success: true, requiresOtp: false };
    }

    return { success: false, error: 'Unknown response' };
  };

  const login = async (email: string) => {
    const res = await initiateGoogleLogin(email);
    return res.success;
  };

  const signup = async (name: string, email: string) => {
    const res = await initiateGoogleLogin(email, name);
    return res.success;
  };

  const completeOtpVerification = (verifiedUser: User) => {
    setCurrentUser(verifiedUser);
    setOtpVerificationState({
      isPending: false,
      email: '',
      maskedEmail: ''
    });
    showToast(`Account successfully activated! Welcome to AdamFlix.`);
  };

  const cancelOtpVerification = () => {
    setOtpVerificationState({
      isPending: false,
      email: '',
      maskedEmail: ''
    });
    showToast('Account activation paused.');
  };

  const logout = () => {
    setCurrentUser(null);
    setOtpVerificationState({
      isPending: false,
      email: '',
      maskedEmail: ''
    });
    showToast('You have been signed out.');
  };

  const switchUserRole = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      const isAllowedAdmin = currentUser?.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
      if (!isAllowedAdmin) {
        showToast(`Access Denied: Only ${AUTHORIZED_ADMIN_EMAIL} is authorized for Administrator access.`);
        return;
      }
    }
    if (!currentUser) {
      setCurrentUser({
        ...INITIAL_USER,
        role
      });
    } else {
      setCurrentUser({ ...currentUser, role });
    }
    showToast(`Switched account role to: ${role.toUpperCase()}`);
  };

  // 13. Watchlist
  const addToWatchlist = (movie: Movie) => {
    if (watchlist.some(item => item.contentId === movie.id)) {
      removeFromWatchlist(movie.id);
      return;
    }
    const newItem: WatchlistItem = {
      id: `wl-${Date.now()}`,
      contentId: movie.id,
      type: movie.type,
      title: movie.title,
      poster: movie.poster,
      backdrop: movie.backdrop,
      rating: movie.rating,
      releaseYear: movie.releaseYear,
      quality: movie.quality,
      genres: movie.genres,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setWatchlist(prev => [newItem, ...prev]);
    showToast(`Added "${movie.title}" to My List.`);
  };

  const removeFromWatchlist = (contentId: string) => {
    setWatchlist(prev => prev.filter(item => item.contentId !== contentId));
    showToast('Removed from My List.');
  };

  const isInWatchlist = (contentId: string) => {
    return watchlist.some(item => item.contentId === contentId);
  };

  // 14. Continue Watching
  const updateContinueWatching = (item: {
    contentId: string;
    type: 'movie' | 'tv';
    title: string;
    poster: string;
    backdrop: string;
    seasonNumber?: number;
    episodeNumber?: number;
    episodeTitle?: string;
    progressSeconds: number;
    durationSeconds: number;
  }) => {
    const percentage = Math.min(100, Math.round((item.progressSeconds / (item.durationSeconds || 1)) * 100));
    setContinueWatching(prev => {
      const filtered = prev.filter(i => i.contentId !== item.contentId);
      const updated: ContinueWatchingItem = {
        id: `cw-${Date.now()}`,
        ...item,
        percentage,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return [updated, ...filtered];
    });
  };

  const removeFromContinueWatching = (contentId: string) => {
    setContinueWatching(prev => prev.filter(item => item.contentId !== contentId));
    showToast('Removed from Continue Watching.');
  };

  // 15. Watch History
  const recordWatchHistory = (movie: Movie, seasonNumber?: number, episodeNumber?: number) => {
    // Increase view count in movies list
    setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, views: m.views + 1 } : m));

    setWatchHistory(prev => {
      const filtered = prev.filter(h => h.contentId !== movie.id);
      const newEntry: WatchHistoryItem = {
        id: `wh-${Date.now()}`,
        contentId: movie.id,
        type: movie.type,
        title: movie.title,
        poster: movie.poster,
        seasonNumber,
        episodeNumber,
        watchedAt: 'Just now',
        percentage: 10
      };
      return [newEntry, ...filtered];
    });
  };

  const clearWatchHistory = () => {
    setWatchHistory([]);
    showToast('Watch history cleared.');
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
    showToast('Playback preferences updated.');
  };

  const openAuthModal = (mode: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Calculate statistics for the Admin Dashboard
  const stats = {
    totalMovies: movies.filter(m => m.type === 'movie').length,
    totalTVShows: movies.filter(m => m.type === 'tv').length,
    totalUsers: 14820,
    totalViews: movies.reduce((acc, curr) => acc + (curr.views || 0), 0),
    totalEpisodes: movies.reduce((acc, curr) => {
      if (curr.type === 'tv' && curr.seasons) {
        return acc + curr.seasons.reduce((sAcc, s) => sAcc + (s.episodes?.length || 0), 0);
      }
      return acc;
    }, 0)
  };

  return (
    <AppContext.Provider
      value={{
        movies,
        addMovie,
        updateMovie,
        deleteMovie,
        addTVShow,
        addSeason,
        addEpisode,
        homepageConfig,
        updateHomepageConfig,
        currentUser,
        login,
        signup,
        initiateGoogleLogin,
        logout,
        switchUserRole,
        otpVerificationState,
        completeOtpVerification,
        cancelOtpVerification,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        continueWatching,
        updateContinueWatching,
        removeFromContinueWatching,
        watchHistory,
        recordWatchHistory,
        clearWatchHistory,
        userSettings,
        updateUserSettings,
        currentRoute,
        routeParams,
        navigateTo,
        searchQuery,
        setSearchQuery,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        toastMessage,
        showToast,
        stats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
