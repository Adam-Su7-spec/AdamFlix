import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Info, 
  Plus, 
  Check, 
  Star, 
  Clock, 
  Calendar, 
  Search, 
  X, 
  Film, 
  Tv, 
  Sparkles, 
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import { Movie } from '../../types';
import { useApp } from '../../context/AppContext';

interface HeroSectionProps {
  featuredMovies: Movie[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ featuredMovies }) => {
  const { navigateTo, isInWatchlist, addToWatchlist, movies, searchQuery, setSearchQuery } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Search state in Hero
  const [heroSearch, setHeroSearch] = useState(searchQuery || '');
  const [searchFilter, setSearchFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync with global searchQuery if updated elsewhere
  useEffect(() => {
    if (searchQuery && searchQuery !== heroSearch) {
      setHeroSearch(searchQuery);
    }
  }, [searchQuery]);

  // Popular search quick tags
  const quickTags = [
    { label: 'Sci-Fi', query: 'Sci-Fi' },
    { label: 'Action', query: 'Action' },
    { label: 'Cyberpunk', query: 'Cyberpunk' },
    { label: 'Drama', query: 'Drama' },
    { label: 'Mystery', query: 'Mystery' },
    { label: 'Animation', query: 'Animation' },
  ];

  // Auto-rotate hero every 9 seconds if user doesn't interact with search
  useEffect(() => {
    if (featuredMovies.length <= 1 || isSearchOpen || heroSearch.trim().length > 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [featuredMovies.length, isSearchOpen, heroSearch]);

  // Close search suggestions dropdown on click outside or Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  if (!currentMovie) return null;

  const inWatchlist = isInWatchlist(currentMovie.id);

  const handleWatchNow = () => {
    navigateTo(`/watch/${currentMovie.slug}`, { id: currentMovie.id, title: currentMovie.title });
  };

  const handleMoreInfo = () => {
    if (currentMovie.type === 'movie') {
      navigateTo(`/movie/${currentMovie.slug}`, { id: currentMovie.id, title: currentMovie.title });
    } else {
      navigateTo(`/tv-show/${currentMovie.slug}`, { id: currentMovie.id, title: currentMovie.title });
    }
  };

  // Live matching results for the hero search bar
  const queryClean = (heroSearch || searchQuery).trim().toLowerCase();
  const searchResults = queryClean
    ? movies
        .filter((item) => {
          const matchType = searchFilter === 'all' || item.type === searchFilter;
          const matchTitle = item.title.toLowerCase().includes(queryClean);
          const matchGenre = item.genres.some((g) => g.toLowerCase().includes(queryClean));
          const matchCast = item.cast.some((c) => c.toLowerCase().includes(queryClean));
          const matchDirector = item.director?.toLowerCase().includes(queryClean);
          return matchType && (matchTitle || matchGenre || matchCast || matchDirector);
        })
        .slice(0, 5)
    : [];

  // Global search trigger: updates global search state and navigates to search page
  const handleHeroSearchSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const term = (heroSearch || searchQuery).trim();
    if (term) {
      setIsSearchOpen(false);
      setSearchQuery(term);
      navigateTo('/search', { q: term });
    }
  };

  const handleSelectQuickTag = (tagQuery: string) => {
    setHeroSearch(tagQuery);
    setSearchQuery(tagQuery);
    setIsSearchOpen(true);
  };

  const handleSelectResult = (item: Movie) => {
    setIsSearchOpen(false);
    if (item.type === 'movie') {
      navigateTo(`/movie/${item.slug}`, { id: item.id, title: item.title });
    } else {
      navigateTo(`/tv-show/${item.slug}`, { id: item.id, title: item.title });
    }
  };

  return (
    <div className="relative w-full min-h-[640px] md:min-h-[700px] lg:h-[88vh] max-h-[960px] overflow-hidden bg-[#080B12] flex flex-col justify-end">
      {/* Background Cinematic Artwork with Dynamic Transitions */}
      {featuredMovies.map((movie, idx) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 8s ease-out' }}
        >
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}

      {/* Multi-layered Cinematic Dark Gradients for 100% Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/75 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/85 to-transparent z-10 max-w-4xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,transparent_30%,rgba(8,11,18,0.75)_100%)] z-10" />

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pb-16 flex flex-col justify-end">
        <div className="max-w-3xl">
          
          {/* Metadata Bar (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#A7AFBF] mb-3">
            <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-black/60 text-[#00D4FF] border border-[#00D4FF]/40 tracking-wider">
              {currentMovie.quality} ULTRA HD
            </span>

            {currentMovie.badges?.[0] && (
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-[#7C5CFF]/30 text-[#7C5CFF] border border-[#7C5CFF]/40 tracking-wider">
                {currentMovie.badges[0]}
              </span>
            )}

            <div className="flex items-center gap-1.5 font-medium text-white">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-mono tabular-nums font-bold text-amber-300">{currentMovie.rating.toFixed(1)}</span>
            </div>

            <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#A7AFBF]" />
              <span>{currentMovie.releaseYear}</span>
            </div>

            <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#A7AFBF]" />
              <span>{currentMovie.duration}</span>
            </div>

            <span aria-hidden="true" className="text-[#A7AFBF]/50">·</span>
            <span className="text-white font-medium">{currentMovie.genres.join(', ')}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-display text-balance mb-3 drop-shadow-lg">
            {currentMovie.title}
          </h1>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm md:text-base text-[#A7AFBF] line-clamp-2 sm:line-clamp-3 leading-relaxed mb-6 max-w-2xl text-balance">
            {currentMovie.description}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-7">
            <button
              onClick={handleWatchNow}
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-[#7C5CFF]/30 transition-all active:scale-95 cursor-pointer glow-primary"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
              </div>
              <span>Watch Now</span>
            </button>

            <button
              onClick={handleMoreInfo}
              className="px-5 sm:px-6 py-3.5 rounded-xl bg-[#151B28]/90 hover:bg-[#151B28] border border-[#1E2638] hover:border-white/30 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
            >
              <Info className="w-4 h-4 text-[#00D4FF]" />
              <span>More Info</span>
            </button>

            <button
              onClick={() => addToWatchlist(currentMovie)}
              title={inWatchlist ? "Remove from My List" : "Add to My List"}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                inWatchlist
                  ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white'
                  : 'bg-[#151B28]/80 border-[#1E2638] text-[#A7AFBF] hover:text-white hover:border-white/30'
              }`}
              aria-label="Add to Watchlist"
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {/* ======================================================== */}
          {/* PROMINENT HERO SEARCH BAR (Requirement) */}
          {/* ======================================================== */}
          <div ref={searchContainerRef} className="relative w-full max-w-2xl">
            {/* Header / Sub-caption for search bar */}
            <div className="flex items-center justify-between text-xs mb-2 px-1">
              <span className="text-[#A7AFBF] font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>Search AdamFlix Catalog</span>
              </span>

              {/* Type Filter Pills inside hero */}
              <div className="flex items-center bg-[#0D121F]/90 backdrop-blur-md rounded-lg p-0.5 border border-[#1E2638]">
                <button
                  type="button"
                  onClick={() => setSearchFilter('all')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    searchFilter === 'all'
                      ? 'bg-[#7C5CFF] text-white shadow-sm'
                      : 'text-[#A7AFBF] hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSearchFilter('movie')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    searchFilter === 'movie'
                      ? 'bg-[#7C5CFF] text-white shadow-sm'
                      : 'text-[#A7AFBF] hover:text-white'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>Movies</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchFilter('tv')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    searchFilter === 'tv'
                      ? 'bg-[#7C5CFF] text-white shadow-sm'
                      : 'text-[#A7AFBF] hover:text-white'
                  }`}
                >
                  <Tv className="w-3 h-3" />
                  <span>TV Shows</span>
                </button>
              </div>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleHeroSearchSubmit} className="relative w-full">
              <div className="relative flex items-center w-full">
                
                {/* Magnifying Glass Icon */}
                <div className="absolute left-4 sm:left-4.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10 flex items-center justify-center">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>

                {/* Input with Dark Semi-Transparent Background */}
                <input
                  type="text"
                  name="search"
                  aria-label="Search movies and TV shows"
                  value={heroSearch}
                  onChange={(e) => {
                    setHeroSearch(e.target.value);
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleHeroSearchSubmit(e);
                    }
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search movies, TV shows, actors, or genres... (Press Enter)"
                  className="w-full bg-black/60 hover:bg-black/70 focus:bg-black/85 text-white placeholder-gray-400 pl-12 sm:pl-12.5 pr-28 py-3.5 sm:py-4 rounded-2xl border border-white/20 focus:border-[#7C5CFF] focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/40 text-sm sm:text-base backdrop-blur-md shadow-2xl transition-all"
                />

                {/* Clear Input Button */}
                {heroSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeroSearch('');
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-24 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Submit Action Button */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button
                    type="submit"
                    className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs hover:brightness-110 active:scale-95 shadow-lg shadow-[#7C5CFF]/20 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Trending Suggestions Bar */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 px-1">
              <span className="text-[11px] text-[#A7AFBF] font-medium mr-1">Quick:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleSelectQuickTag(tag.query)}
                  className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-[#7C5CFF]/20 border border-white/10 hover:border-[#7C5CFF]/40 text-[#A7AFBF] hover:text-white text-[11px] transition-all cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Instant Suggestions Dropdown */}
            {isSearchOpen && heroSearch.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#0E1424]/98 backdrop-blur-2xl border border-[#1E2638] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-[11px] font-semibold text-[#A7AFBF] flex items-center justify-between border-b border-[#1E2638]">
                  <span>Instant Results</span>
                  <span>{searchResults.length} match{searchResults.length === 1 ? '' : 'es'} found</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-[#151B28]/60 max-h-72 overflow-y-auto no-scrollbar py-1">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        className="p-2 sm:p-2.5 rounded-xl hover:bg-[#151B28] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-9 h-13 object-cover rounded bg-black shrink-0 border border-[#1E2638] group-hover:border-[#7C5CFF]/50 transition-colors"
                          />
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#A7AFBF] flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-white/80">
                                {item.type === 'movie' ? 'Movie' : 'TV Series'}
                              </span>
                              <span>·</span>
                              <span>{item.releaseYear}</span>
                              <span>·</span>
                              <span className="truncate max-w-[140px] sm:max-w-[200px]">{item.genres.slice(0, 2).join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{item.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-[#00D4FF] border border-[#00D4FF]/30">
                            {item.quality}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* View All Matches Footer */}
                    <button
                      onClick={handleHeroSearchSubmit}
                      className="w-full text-center py-2.5 text-xs font-semibold text-[#00D4FF] hover:text-white hover:bg-[#151B28] rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer mt-1"
                    >
                      <span>Explore all results for "{heroSearch}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[#A7AFBF]">
                    No titles found matching <span className="text-white font-medium">"{heroSearch}"</span>
                    <div className="mt-2">
                      <button
                        onClick={handleHeroSearchSubmit}
                        className="text-[#00D4FF] hover:underline"
                      >
                        Try full catalog search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        {featuredMovies.length > 1 && (
          <div className="absolute bottom-6 right-4 sm:right-8 flex items-center gap-2 z-20">
            {featuredMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex 
                    ? 'w-8 bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]' 
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

