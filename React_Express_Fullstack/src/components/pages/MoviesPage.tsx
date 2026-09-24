import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Film, RefreshCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MovieCard } from '../common/MovieCard';
import { ALL_GENRES } from '../../data/mockData';

export const MoviesPage: React.FC = () => {
  const { movies, routeParams } = useApp();

  // Filters State
  const [selectedGenre, setSelectedGenre] = useState<string>(routeParams.genre || 'all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Available Filter Options
  const years = [2026, 2025, 2024, 2023];
  const ratings = [
    { label: 'All Ratings', value: 'all' },
    { label: '9.0+ ★ Top Rated', value: '9' },
    { label: '8.0+ ★ High Quality', value: '8' },
    { label: '7.0+ ★ Recommended', value: '7' }
  ];
  const qualities = ['all', '4K', 'FHD', 'HD'];
  const languages = ['all', 'English', 'Japanese', 'French', 'Italian', 'German'];

  // Filter & Sort Logic
  const filteredMovies = useMemo(() => {
    let result = movies.filter(m => m.type === 'movie');

    // Quick filter from route params (e.g. ?filter=new or ?filter=trending)
    if (routeParams.filter === 'new') {
      result = result.filter(m => m.badges?.includes('NEW') || m.releaseYear === 2026);
    } else if (routeParams.filter === 'trending') {
      result = result.filter(m => m.badges?.includes('TRENDING') || m.views > 200000);
    }

    if (selectedGenre !== 'all') {
      result = result.filter(m => m.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase()));
    }

    if (selectedYear !== 'all') {
      result = result.filter(m => m.releaseYear === parseInt(selectedYear, 10));
    }

    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter(m => m.rating >= minRating);
    }

    if (selectedQuality !== 'all') {
      result = result.filter(m => m.quality === selectedQuality);
    }

    if (selectedLanguage !== 'all') {
      result = result.filter(m => m.country.toLowerCase().includes(selectedLanguage.toLowerCase()));
    }

    // Sorting
    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => b.releaseYear - a.releaseYear || b.views - a.views);
        break;
      case 'most_watched':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'highest_rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'title_az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [movies, selectedGenre, selectedYear, selectedRating, selectedQuality, selectedLanguage, sortBy, routeParams]);

  const resetFilters = () => {
    setSelectedGenre('all');
    setSelectedYear('all');
    setSelectedRating('all');
    setSelectedQuality('all');
    setSelectedLanguage('all');
    setSortBy('latest');
  };

  const paginatedMovies = filteredMovies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMovies.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00D4FF] uppercase tracking-wider mb-1">
            <Film className="w-4 h-4" />
            <span>Cinematic Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Movies
          </h1>
          <p className="text-sm text-[#A7AFBF] mt-1">
            Explore {filteredMovies.length} curated feature films streaming in 4K Ultra HD
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-[#A7AFBF] flex items-center gap-1.5 whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7C5CFF]" />
            <span>Sort by:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#101521] text-xs font-semibold text-white px-3 py-2 rounded-xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none cursor-pointer"
          >
            <option value="latest">Latest Releases</option>
            <option value="most_watched">Most Watched</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="title_az">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#101521] p-4 sm:p-5 rounded-2xl border border-[#1E2638] mb-8">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#151B28]">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Filter Catalog</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-[#A7AFBF] hover:text-[#00D4FF] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Genre */}
          <div>
            <label className="block text-[11px] font-medium text-[#A7AFBF] mb-1.5">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-[#151B28] text-xs text-white px-3 py-2 rounded-lg border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none cursor-pointer"
            >
              <option value="all">All Genres</option>
              {ALL_GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-medium text-[#A7AFBF] mb-1.5">Release Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#151B28] text-xs text-white px-3 py-2 rounded-lg border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none cursor-pointer"
            >
              <option value="all">All Years</option>
              {years.map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[11px] font-medium text-[#A7AFBF] mb-1.5">Rating</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full bg-[#151B28] text-xs text-white px-3 py-2 rounded-lg border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none cursor-pointer"
            >
              {ratings.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-[11px] font-medium text-[#A7AFBF] mb-1.5">Quality</label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full bg-[#151B28] text-xs text-white px-3 py-2 rounded-lg border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none cursor-pointer"
            >
              <option value="all">All Qualities</option>
              {qualities.filter(q => q !== 'all').map(q => (
                <option key={q} value={q}>{q} UHD</option>
              ))}
            </select>
          </div>

          {/* Country / Language */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-medium text-[#A7AFBF] mb-1.5">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-[#151B28] text-xs text-white px-3 py-2 rounded-lg border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none cursor-pointer"
            >
              <option value="all">All Languages</option>
              {languages.filter(l => l !== 'all').map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Movie Grid (Desktop: 5-6, Tablet: 3-4, Mobile: 2) */}
      {paginatedMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {paginatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-8 py-3 rounded-xl bg-[#151B28] hover:bg-[#1E2638] border border-[#1E2638] hover:border-[#7C5CFF] text-white text-sm font-bold shadow-lg transition-all cursor-pointer"
              >
                Load More Movies ({filteredMovies.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-[#101521] rounded-2xl border border-[#1E2638] p-8">
          <Film className="w-12 h-12 text-[#A7AFBF]/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No movies matched your filters</h3>
          <p className="text-xs text-[#A7AFBF] max-w-md mx-auto mb-5">
            Try adjusting your genre, year, or rating filters to discover more cinematic titles.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#7C5CFF] text-white text-xs font-semibold hover:brightness-110 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
