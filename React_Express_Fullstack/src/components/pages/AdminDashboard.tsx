import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  Film, 
  Tv, 
  Users, 
  Eye, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sliders, 
  ArrowUp, 
  ArrowDown, 
  Server,
  Star,
  ExternalLink
} from 'lucide-react';
import { useApp, AUTHORIZED_ADMIN_EMAIL } from '../../context/AppContext';
import { Movie, QualityType, Episode, Season } from '../../types';
import { ALL_GENRES } from '../../data/mockData';
import { parseVideoSource } from '../../utils/videoUtils';
import { VideoPlayer } from '../player/VideoPlayer';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser,
    movies, 
    addMovie, 
    updateMovie, 
    deleteMovie, 
    addTVShow, 
    addSeason, 
    addEpisode, 
    homepageConfig, 
    updateHomepageConfig,
    stats,
    navigateTo,
    showToast,
    openAuthModal
  } = useApp();

  // Strict email check: Only ssouhaimat1999@gmail.com is granted access
  const isAuthorized = Boolean(
    currentUser && 
    currentUser.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );

  // Security notification when unauthorized access is attempted
  useEffect(() => {
    if (!isAuthorized) {
      showToast(`Security Alert: Access denied to Admin Panel. Only ${AUTHORIZED_ADMIN_EMAIL} is authorized.`);
    }
  }, [isAuthorized]);

  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'tv' | 'homepage' | 'sources'>('overview');

  // Modal controls
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isAddTVShowModalOpen, setIsAddTVShowModalOpen] = useState(false);
  const [isAddEpisodeModalOpen, setIsAddEpisodeModalOpen] = useState<{ showId: string; seasonNumber: number } | null>(null);

  // Form State: Add Movie
  const [movieForm, setMovieForm] = useState({
    title: '',
    originalTitle: '',
    description: '',
    poster: '',
    backdrop: '',
    releaseYear: 2026,
    genres: 'Action, Science Fiction',
    rating: 8.5,
    duration: '2h 10m',
    country: 'United States',
    director: '',
    cast: 'Actor One, Actor Two, Actor Three',
    trailerUrl: '',
    videoSource: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    subtitle: 'English',
    quality: '4K' as QualityType
  });

  // Strict security barrier: If not the single authorized admin, block immediately
  if (!isAuthorized) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#080B12]">
        <div className="max-w-md w-full bg-[#0E1424] border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50 text-center relative overflow-hidden">
          {/* Ambient red security glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Security Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-6 shadow-inner">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-rose-600 text-white shadow-lg">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold tracking-wider uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            403 · Access Denied
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
            Administrator Clearance Required
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#A7AFBF] leading-relaxed mb-6">
            The AdamFlix Administration Console is strictly restricted. Only the designated administrator account (<span className="text-white font-mono font-semibold">{AUTHORIZED_ADMIN_EMAIL}</span>) is permitted to access administrative tools and catalog controls. Anyone else attempting to open the Admin panel is blocked and denied access instantly.
          </p>

          {/* Security Audit Box */}
          <div className="bg-[#151B28] border border-[#1F293D] rounded-xl p-3.5 text-left text-xs mb-6 space-y-2">
            <div className="flex items-center justify-between text-[#A7AFBF]">
              <span>Current Session:</span>
              <span className="font-mono text-white truncate max-w-[190px]">
                {currentUser?.email || 'Anonymous Guest (Not Signed In)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#A7AFBF]">
              <span>Required Identity:</span>
              <span className="font-mono text-[#00D4FF] font-semibold">
                {AUTHORIZED_ADMIN_EMAIL}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1F293D]">
              <span>Security Status:</span>
              <span className="text-rose-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                BLOCKED &amp; DENIED
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#7C5CFF]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In with Administrator Account</span>
            </button>

            <button
              onClick={() => navigateTo('/')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#151B28] hover:bg-[#1E2638] text-[#A7AFBF] hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-[#1E2638] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </button>
          </div>
        </div>
      </div>
    );
  }


  // Form State: Add TV Show
  const [tvForm, setTvForm] = useState({
    title: '',
    description: '',
    poster: '',
    backdrop: '',
    releaseYear: 2026,
    genres: 'Drama, Mystery',
    rating: 8.8,
    country: 'United States',
    cast: 'Lead Star, Co-Star, Supporting Actor'
  });

  const [previewMovieStream, setPreviewMovieStream] = useState(false);
  const [previewEpisodeStream, setPreviewEpisodeStream] = useState(false);

  // Form State: Add Episode
  const [episodeForm, setEpisodeForm] = useState({
    episodeNumber: 1,
    title: '',
    description: '',
    thumbnail: '',
    duration: '50m',
    videoSource: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    subtitle: 'English'
  });

  // Handle Save Movie
  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieForm.title) {
      showToast('Please enter a movie title.');
      return;
    }

    addMovie({
      title: movieForm.title,
      originalTitle: movieForm.originalTitle || movieForm.title,
      type: 'movie',
      description: movieForm.description || 'An extraordinary cinematic experience streaming in 4K Ultra HD.',
      poster: movieForm.poster || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      backdrop: movieForm.backdrop || '/src/assets/images/hero_scifi_voyage_1790165629911.jpg',
      releaseYear: Number(movieForm.releaseYear),
      genres: movieForm.genres.split(',').map(s => s.trim()),
      rating: Number(movieForm.rating),
      duration: movieForm.duration,
      country: movieForm.country,
      director: movieForm.director || 'AdamFlix Studios',
      cast: movieForm.cast.split(',').map(s => s.trim()),
      trailerUrl: movieForm.trailerUrl,
      quality: movieForm.quality,
      badges: ['NEW'],
      videoSources: [
        {
          id: 'srv-1',
          name: `Server 1 (${parseVideoSource(movieForm.videoSource).detectedPlatform || 'Alpha CDN'})`,
          quality: movieForm.quality,
          url: parseVideoSource(movieForm.videoSource).resolvedUrl,
          rawInput: movieForm.videoSource,
          type: parseVideoSource(movieForm.videoSource).type
        }
      ],
      subtitles: [
        { id: 'sub-en', label: movieForm.subtitle, lang: 'en', url: '' }
      ]
    });

    setIsAddMovieModalOpen(false);
    // Reset
    setMovieForm({
      title: '',
      originalTitle: '',
      description: '',
      poster: '',
      backdrop: '',
      releaseYear: 2026,
      genres: 'Action, Science Fiction',
      rating: 8.5,
      duration: '2h 10m',
      country: 'United States',
      director: '',
      cast: 'Actor One, Actor Two, Actor Three',
      trailerUrl: '',
      videoSource: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      subtitle: 'English',
      quality: '4K'
    });
  };

  // Handle Save TV Show
  const handleSaveTVShow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tvForm.title) {
      showToast('Please enter a show title.');
      return;
    }

    addTVShow({
      title: tvForm.title,
      originalTitle: tvForm.title,
      type: 'tv',
      description: tvForm.description || 'A gripping television series streaming in 4K Ultra HD on AdamFlix.',
      poster: tvForm.poster || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      backdrop: tvForm.backdrop || '/src/assets/images/backdrop_neon_noir_1790165645799.jpg',
      releaseYear: Number(tvForm.releaseYear),
      genres: tvForm.genres.split(',').map(s => s.trim()),
      rating: Number(tvForm.rating),
      duration: '1 Season',
      country: tvForm.country,
      director: 'AdamFlix Television',
      cast: tvForm.cast.split(',').map(s => s.trim()),
      quality: '4K',
      badges: ['NEW'],
      videoSources: [
        {
          id: 'srv-1',
          name: 'Server 1 (Alpha High-Speed CDN)',
          quality: '4K',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
        }
      ],
      subtitles: [
        { id: 'sub-en', label: 'English', lang: 'en', url: '' }
      ],
      seasons: [
        {
          seasonNumber: 1,
          title: 'Season 1',
          episodes: [
            {
              id: `ep-${Date.now()}`,
              episodeNumber: 1,
              title: 'Pilot Episode',
              description: 'The journey begins in this gripping premiere episode.',
              thumbnail: tvForm.backdrop || '/src/assets/images/backdrop_neon_noir_1790165645799.jpg',
              duration: '52m',
              airDate: 'Today',
              videoSources: [
                {
                  id: 'srv-1',
                  name: 'Server 1 (Alpha High-Speed CDN)',
                  quality: '4K',
                  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
                }
              ],
              subtitles: [{ id: 'sub-en', label: 'English', lang: 'en', url: '' }]
            }
          ]
        }
      ]
    });

    setIsAddTVShowModalOpen(false);
  };

  // Handle Save Episode
  const handleSaveEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddEpisodeModalOpen) return;

    addEpisode(isAddEpisodeModalOpen.showId, isAddEpisodeModalOpen.seasonNumber, {
      episodeNumber: Number(episodeForm.episodeNumber),
      title: episodeForm.title || `Episode ${episodeForm.episodeNumber}`,
      description: episodeForm.description || 'An exciting new chapter in the ongoing series.',
      thumbnail: episodeForm.thumbnail || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      duration: episodeForm.duration,
      airDate: 'March 2026',
      videoSources: [
        {
          id: 'srv-1',
          name: `Server 1 (${parseVideoSource(episodeForm.videoSource).detectedPlatform || 'Alpha CDN'})`,
          quality: '4K',
          url: parseVideoSource(episodeForm.videoSource).resolvedUrl,
          rawInput: episodeForm.videoSource,
          type: parseVideoSource(episodeForm.videoSource).type
        }
      ],
      subtitles: [
        { id: 'sub-en', label: episodeForm.subtitle, lang: 'en', url: '' }
      ]
    });

    setIsAddEpisodeModalOpen(null);
  };

  // Homepage Config Controls
  const handleToggleSection = (sectionId: string) => {
    const updated = homepageConfig.sections.map(s => 
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    updateHomepageConfig({ ...homepageConfig, sections: updated });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...homepageConfig.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    updateHomepageConfig({ ...homepageConfig, sections: newSections });
  };

  const handleHeroSelect = (movieId: string) => {
    updateHomepageConfig({ ...homepageConfig, heroMovieId: movieId });
    showToast('Primary marquee hero updated.');
  };

  // Top Most Watched Content
  const mostWatchedList = [...movies].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Admin Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101521] to-[#151B28] border border-[#1E2638] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 flex items-center justify-center text-[#7C5CFF]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                AdamFlix Studio Manager
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A7AFBF] mt-1">
              Administer catalog, television series, video stream sources, and homepage curation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddMovieModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#7C5CFF]/20 hover:brightness-110 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Movie</span>
          </button>
          <button
            onClick={() => setIsAddTVShowModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#151B28] hover:bg-[#1E2638] border border-[#1E2638] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#00D4FF]" />
            <span>Add TV Show</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E2638] mb-8 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'overview', label: 'Dashboard Statistics', icon: Layers },
          { id: 'movies', label: `Manage Movies (${stats.totalMovies})`, icon: Film },
          { id: 'tv', label: `Manage TV Shows (${stats.totalTVShows})`, icon: Tv },
          { id: 'homepage', label: 'Homepage Management', icon: Sliders },
          { id: 'sources', label: 'Video Sources & Licensing', icon: Server },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#151B28] text-white border-b-2 border-[#7C5CFF]'
                  : 'text-[#A7AFBF] hover:text-white hover:bg-[#101521]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#7C5CFF]' : 'text-[#A7AFBF]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & STATISTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-[#101521] border border-[#1E2638]">
              <div className="flex items-center justify-between text-[#A7AFBF] mb-2">
                <span className="text-xs">Total Movies</span>
                <Film className="w-4 h-4 text-[#7C5CFF]" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {stats.totalMovies}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101521] border border-[#1E2638]">
              <div className="flex items-center justify-between text-[#A7AFBF] mb-2">
                <span className="text-xs">Total TV Shows</span>
                <Tv className="w-4 h-4 text-[#00D4FF]" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {stats.totalTVShows}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101521] border border-[#1E2638]">
              <div className="flex items-center justify-between text-[#A7AFBF] mb-2">
                <span className="text-xs">Total Episodes</span>
                <Layers className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {stats.totalEpisodes}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101521] border border-[#1E2638]">
              <div className="flex items-center justify-between text-[#A7AFBF] mb-2">
                <span className="text-xs">Registered Users</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {stats.totalUsers.toLocaleString()}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101521] border border-[#1E2638] col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-[#A7AFBF] mb-2">
                <span className="text-xs">Global Stream Views</span>
                <Eye className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {stats.totalViews.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Most Watched Content Table */}
          <div className="p-6 rounded-2xl bg-[#101521] border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-4">
              Most Watched Content Across AdamFlix
            </h3>
            <div className="divide-y divide-[#151B28]">
              {mostWatchedList.map((item, index) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#A7AFBF] w-5">
                      0{index + 1}
                    </span>
                    <img src={item.poster} alt={item.title} className="w-10 h-14 object-cover rounded bg-black shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-white">{item.title}</div>
                      <div className="text-xs text-[#A7AFBF]">
                        {item.type === 'movie' ? 'Feature Film' : 'TV Series'} · {item.releaseYear} · {item.genres.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-[#00D4FF] tabular-nums">
                      {item.views.toLocaleString()} views
                    </div>
                    <div className="text-[11px] text-amber-400 font-semibold">
                      ★ {item.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE MOVIES */}
      {activeTab === 'movies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Movie Catalog</h3>
            <button
              onClick={() => setIsAddMovieModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#7C5CFF] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Movie</span>
            </button>
          </div>

          <div className="rounded-2xl bg-[#101521] border border-[#1E2638] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#151B28] text-[#A7AFBF] border-b border-[#1E2638]">
                  <tr>
                    <th className="p-3.5">Poster & Title</th>
                    <th className="p-3.5">Year</th>
                    <th className="p-3.5">Quality</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5">Views</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151B28]">
                  {movies.filter(m => m.type === 'movie').map((movie) => (
                    <tr key={movie.id} className="hover:bg-[#151B28]/50">
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={movie.poster} alt={movie.title} className="w-9 h-13 object-cover rounded bg-black shrink-0" />
                        <div>
                          <div className="font-bold text-white text-sm">{movie.title}</div>
                          <div className="text-[11px] text-[#A7AFBF]">{movie.genres.join(', ')}</div>
                        </div>
                      </td>
                      <td className="p-3.5 text-[#A7AFBF]">{movie.releaseYear}</td>
                      <td className="p-3.5">
                        <span className="px-1.5 py-0.5 rounded bg-black/60 text-[#00D4FF] border border-[#00D4FF]/30 font-bold text-[10px]">
                          {movie.quality}
                        </span>
                      </td>
                      <td className="p-3.5 text-amber-400 font-bold">★ {movie.rating}</td>
                      <td className="p-3.5 font-mono text-[#A7AFBF] tabular-nums">{movie.views.toLocaleString()}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigateTo(`/movie/${movie.slug}`, { id: movie.id, title: movie.title })}
                            className="p-1.5 rounded-lg bg-[#151B28] text-[#00D4FF] hover:bg-[#1E2638]"
                            title="Preview"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMovie(movie.id)}
                            className="p-1.5 rounded-lg bg-[#151B28] text-rose-400 hover:bg-rose-500/20"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE TV SHOWS */}
      {activeTab === 'tv' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">TV Shows & Seasons</h3>
            <button
              onClick={() => setIsAddTVShowModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#7C5CFF] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New TV Show</span>
            </button>
          </div>

          <div className="space-y-4">
            {movies.filter(m => m.type === 'tv').map((show) => (
              <div key={show.id} className="p-5 rounded-2xl bg-[#101521] border border-[#1E2638]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#151B28]">
                  <div className="flex items-center gap-3">
                    <img src={show.poster} alt={show.title} className="w-12 h-16 object-cover rounded bg-black shrink-0" />
                    <div>
                      <h4 className="text-base font-bold text-white">{show.title}</h4>
                      <p className="text-xs text-[#A7AFBF]">
                        {show.seasons?.length || 0} Seasons · {show.releaseYear} · {show.genres.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addSeason(show.id, `Season ${(show.seasons?.length || 0) + 1}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#151B28] hover:bg-[#1E2638] text-xs font-semibold text-[#00D4FF] border border-[#1E2638] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Season</span>
                    </button>
                    <button
                      onClick={() => deleteMovie(show.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      title="Delete Series"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Seasons & Episodes breakdown */}
                <div className="mt-4 space-y-3">
                  {show.seasons?.map((season) => (
                    <div key={season.seasonNumber} className="p-3.5 rounded-xl bg-[#151B28] border border-[#1E2638]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-white">
                          Season {season.seasonNumber} ({season.episodes.length} episodes)
                        </span>
                        <button
                          onClick={() => {
                            setEpisodeForm({
                              episodeNumber: season.episodes.length + 1,
                              title: '',
                              description: '',
                              thumbnail: show.backdrop || show.poster,
                              duration: '50m',
                              videoSource: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                              subtitle: 'English'
                            });
                            setIsAddEpisodeModalOpen({ showId: show.id, seasonNumber: season.seasonNumber });
                          }}
                          className="text-[11px] text-[#7C5CFF] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Episode</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {season.episodes.map((ep) => (
                          <div key={ep.id} className="p-2 rounded-lg bg-[#101521] border border-[#1E2638] flex items-center justify-between text-xs">
                            <span className="truncate text-white font-medium">
                              E{ep.episodeNumber}: {ep.title}
                            </span>
                            <span className="text-[10px] text-[#A7AFBF] shrink-0 font-mono ml-2">
                              {ep.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HOMEPAGE MANAGEMENT (Requirement 20) */}
      {activeTab === 'homepage' && (
        <div className="space-y-8">
          
          {/* Marquee Hero Selector */}
          <div className="p-6 rounded-2xl bg-[#101521] border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-2">Change Hero Movie</h3>
            <p className="text-xs text-[#A7AFBF] mb-4">
              Select which blockbuster is spotlighted prominently in the top marquee of AdamFlix.tv
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {movies.slice(0, 8).map(m => {
                const isSelected = homepageConfig.featuredMovieIds[0] === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      const newFeatured = [m.id, ...homepageConfig.featuredMovieIds.filter(id => id !== m.id)];
                      updateHomepageConfig({ ...homepageConfig, featuredMovieIds: newFeatured, heroMovieId: m.id });
                      showToast(`Primary hero set to: ${m.title}`);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#151B28] border-[#7C5CFF] ring-2 ring-[#7C5CFF]'
                        : 'bg-[#151B28]/50 border-[#1E2638] hover:border-white/20'
                    }`}
                  >
                    <img src={m.poster} alt={m.title} className="w-9 h-13 object-cover rounded bg-black shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{m.title}</div>
                      <div className="text-[10px] text-[#00D4FF]">{m.genres[0]}</div>
                      {isSelected && <span className="text-[9px] font-bold text-emerald-400">ACTIVE HERO</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Reordering & Enable/Disable (Requirement 20) */}
          <div className="p-6 rounded-2xl bg-[#101521] border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-2">Reorder & Configure Homepage Sections</h3>
            <p className="text-xs text-[#A7AFBF] mb-4">
              Toggle visibility or reposition sections on the main AdamFlix homepage.
            </p>
            <div className="space-y-2">
              {homepageConfig.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-3.5 rounded-xl bg-[#151B28] border border-[#1E2638] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleSection(sec.id)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                        sec.enabled ? 'bg-[#7C5CFF] text-white' : 'bg-white/10 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="text-xs font-bold text-white">{sec.title}</div>
                      <div className="text-[10px] text-[#A7AFBF]">
                        Filter: {sec.filterType} · {sec.filterValue}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1 rounded bg-[#101521] text-[#A7AFBF] hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === homepageConfig.sections.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1 rounded bg-[#101521] text-[#A7AFBF] hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SOURCES & LICENSING */}
      {activeTab === 'sources' && (
        <div className="p-6 rounded-2xl bg-[#101521] border border-[#1E2638] space-y-4">
          <h3 className="text-base font-bold text-white">Video Sources & Legal Compliance</h3>
          <p className="text-xs text-[#A7AFBF] leading-relaxed">
            AdamFlix.tv is engineered to stream legally licensed commercial media, high-speed CDN distributions, and user-owned video feeds.
            All active demo streams are compliant with Creative Commons & W3C open standards.
          </p>

          <div className="space-y-3 pt-3">
            <div className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">Server 1 (Alpha High-Speed CDN)</span>
                <span className="text-[11px] text-emerald-400 block">Status: Online · Low Latency</span>
              </div>
              <span className="text-[10px] font-mono text-[#00D4FF]">4K Ultra HD</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">Server 2 (Beta 1080p Direct)</span>
                <span className="text-[11px] text-emerald-400 block">Status: Online · Redundant</span>
              </div>
              <span className="text-[10px] font-mono text-[#00D4FF]">FHD 1080p</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">Server 3 (Gamma Adaptive Stream)</span>
                <span className="text-[11px] text-emerald-400 block">Status: Online · Mobile Optimized</span>
              </div>
              <span className="text-[10px] font-mono text-[#00D4FF]">Adaptive HD</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD MOVIE (Requirement 18) */}
      {isAddMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#101521] border border-[#1E2638] rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setIsAddMovieModalOpen(false)}
              className="absolute top-5 right-5 text-[#A7AFBF] hover:text-white p-1 rounded-xl hover:bg-[#151B28]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Add New Movie</h3>
            <p className="text-xs text-[#A7AFBF] mb-6">Enter movie metadata to publish to AdamFlix</p>

            <form onSubmit={handleSaveMovie} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Movie Title *</label>
                  <input
                    type="text"
                    required
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none"
                    placeholder="e.g. Quantum Rift"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Original Title</label>
                  <input
                    type="text"
                    value={movieForm.originalTitle}
                    onChange={(e) => setMovieForm({ ...movieForm, originalTitle: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none"
                    placeholder="e.g. Quantum Rift: Genesis"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none"
                  placeholder="Movie plot synopsis..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Poster URL</label>
                  <input
                    type="text"
                    value={movieForm.poster}
                    onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Backdrop URL</label>
                  <input
                    type="text"
                    value={movieForm.backdrop}
                    onChange={(e) => setMovieForm({ ...movieForm, backdrop: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Release Year</label>
                  <input
                    type="number"
                    value={movieForm.releaseYear}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseYear: Number(e.target.value) })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Rating (1-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: Number(e.target.value) })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Duration</label>
                  <input
                    type="text"
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Quality</label>
                  <select
                    value={movieForm.quality}
                    onChange={(e) => setMovieForm({ ...movieForm, quality: e.target.value as any })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  >
                    <option value="4K">4K</option>
                    <option value="FHD">FHD</option>
                    <option value="HD">HD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    value={movieForm.genres}
                    onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Country</label>
                  <input
                    type="text"
                    value={movieForm.country}
                    onChange={(e) => setMovieForm({ ...movieForm, country: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Director</label>
                  <input
                    type="text"
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Cast (comma separated)</label>
                  <input
                    type="text"
                    value={movieForm.cast}
                    onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#A7AFBF]">
                    Video Stream Source (Direct .mp4/.m3u8, Streaming Server, or &lt;iframe&gt;)
                  </label>
                  {movieForm.videoSource && (
                    <button
                      type="button"
                      onClick={() => setPreviewMovieStream(!previewMovieStream)}
                      className="text-[11px] font-semibold text-[#00D4FF] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {previewMovieStream ? 'Hide Preview' : 'Test & Preview Stream'}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    value={movieForm.videoSource}
                    onChange={(e) => setMovieForm({ ...movieForm, videoSource: e.target.value })}
                    placeholder='Paste direct video URL (.mp4, .m3u8), streaming embed URL, or full iframe code (e.g. <iframe src="https://..."></iframe>)'
                    className="w-full bg-[#151B28] text-xs font-mono text-white p-2.5 rounded-xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none"
                  />
                </div>

                {/* Intelligent Detected Format Badge */}
                {movieForm.videoSource && (
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#A7AFBF]">Detected Format:</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#7C5CFF]/20 border border-[#7C5CFF]/30 text-[#7C5CFF] font-semibold">
                        {parseVideoSource(movieForm.videoSource).detectedPlatform || 'Custom Video Source'}
                      </span>
                      {parseVideoSource(movieForm.videoSource).isIframe && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Cinema Iframe Embed
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Inline Live Stream Test Preview */}
                {previewMovieStream && movieForm.videoSource && (
                  <div className="mt-3 p-3 rounded-2xl bg-black border border-[#1E2638] animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live Stream Test Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewMovieStream(false)}
                        className="text-xs text-[#A7AFBF] hover:text-white"
                      >
                        ✕ Close Preview
                      </button>
                    </div>
                    <VideoPlayer
                      sourceUrl={movieForm.videoSource}
                      poster={movieForm.backdrop || movieForm.poster}
                      title={movieForm.title || 'Stream Preview'}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2638]">
                <button
                  type="button"
                  onClick={() => setIsAddMovieModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#151B28] hover:bg-[#1E2638] text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] text-white text-xs font-bold shadow-lg"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TV SHOW (Requirement 19) */}
      {isAddTVShowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#101521] border border-[#1E2638] rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setIsAddTVShowModalOpen(false)}
              className="absolute top-5 right-5 text-[#A7AFBF] hover:text-white p-1 rounded-xl hover:bg-[#151B28]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Add New TV Show</h3>
            <p className="text-xs text-[#A7AFBF] mb-6">Create a new television series with pilot episode</p>

            <form onSubmit={handleSaveTVShow} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Show Title *</label>
                <input
                  type="text"
                  required
                  value={tvForm.title}
                  onChange={(e) => setTvForm({ ...tvForm, title: e.target.value })}
                  className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  placeholder="e.g. Apex Paradox"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={tvForm.description}
                  onChange={(e) => setTvForm({ ...tvForm, description: e.target.value })}
                  className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Genres</label>
                  <input
                    type="text"
                    value={tvForm.genres}
                    onChange={(e) => setTvForm({ ...tvForm, genres: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7AFBF] mb-1">Country</label>
                  <input
                    type="text"
                    value={tvForm.country}
                    onChange={(e) => setTvForm({ ...tvForm, country: e.target.value })}
                    className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2638]">
                <button
                  type="button"
                  onClick={() => setIsAddTVShowModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#151B28] text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] text-white text-xs font-bold shadow-lg"
                >
                  Save TV Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EPISODE (Requirement 19) */}
      {isAddEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#101521] border border-[#1E2638] rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsAddEpisodeModalOpen(null)}
              className="absolute top-5 right-5 text-[#A7AFBF] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              Add Episode to Season {isAddEpisodeModalOpen.seasonNumber}
            </h3>

            <form onSubmit={handleSaveEpisode} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#A7AFBF] mb-1">Episode Number</label>
                <input
                  type="number"
                  required
                  value={episodeForm.episodeNumber}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, episodeNumber: Number(e.target.value) })}
                  className="w-full bg-[#151B28] text-white p-2 rounded-lg border border-[#1E2638]"
                />
              </div>
              <div>
                <label className="block text-[#A7AFBF] mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  value={episodeForm.title}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                  className="w-full bg-[#151B28] text-white p-2 rounded-lg border border-[#1E2638]"
                  placeholder="e.g. Return to the Signal"
                />
              </div>
              <div>
                <label className="block text-[#A7AFBF] mb-1">Duration</label>
                <input
                  type="text"
                  value={episodeForm.duration}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, duration: e.target.value })}
                  className="w-full bg-[#151B28] text-white p-2 rounded-lg border border-[#1E2638]"
                  placeholder="54m"
                />
              </div>
              <div>
                <label className="block text-[#A7AFBF] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={episodeForm.description}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                  className="w-full bg-[#151B28] text-white p-2 rounded-lg border border-[#1E2638]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#A7AFBF]">Episode Video Source (Direct, .m3u8, or &lt;iframe&gt;)</label>
                  {episodeForm.videoSource && (
                    <button
                      type="button"
                      onClick={() => setPreviewEpisodeStream(!previewEpisodeStream)}
                      className="text-[11px] text-[#00D4FF] hover:underline"
                    >
                      {previewEpisodeStream ? 'Hide Preview' : 'Test Stream'}
                    </button>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={episodeForm.videoSource}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, videoSource: e.target.value })}
                  placeholder='Paste direct video URL (.mp4, .m3u8) or iframe embed code'
                  className="w-full bg-[#151B28] text-white font-mono p-2 rounded-lg border border-[#1E2638] text-xs"
                />

                {episodeForm.videoSource && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-[#A7AFBF]">Detected:</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7C5CFF]/20 text-[#7C5CFF]">
                      {parseVideoSource(episodeForm.videoSource).detectedPlatform || 'Custom Source'}
                    </span>
                  </div>
                )}

                {previewEpisodeStream && episodeForm.videoSource && (
                  <div className="mt-2 p-2 rounded-xl bg-black border border-[#1E2638]">
                    <VideoPlayer sourceUrl={episodeForm.videoSource} title={episodeForm.title || 'Episode Preview'} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E2638]">
                <button
                  type="button"
                  onClick={() => setIsAddEpisodeModalOpen(null)}
                  className="px-4 py-2 rounded-lg bg-[#151B28] text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#7C5CFF] text-white font-bold"
                >
                  Add Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
