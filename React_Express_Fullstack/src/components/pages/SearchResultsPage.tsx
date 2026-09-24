import React, { useState, useMemo } from 'react';
import { Search, Film, Tv, User, Filter, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MovieCard } from '../common/MovieCard';

export const SearchResultsPage: React.FC = () => {
  const { movies, routeParams, searchQuery, setSearchQuery, navigateTo } = useApp();
  const initialQuery = routeParams.q || searchQuery || '';
  
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const queryClean = localQuery.trim().toLowerCase();

  const results = useMemo(() => {
    if (!queryClean) return [];

    return movies.filter(movie => {
      const matchType = typeFilter === 'all' || movie.type === typeFilter;
      const matchTitle = movie.title.toLowerCase().includes(queryClean);
      const matchDesc = movie.description.toLowerCase().includes(queryClean);
      const matchGenre = movie.genres.some(g => g.toLowerCase().includes(queryClean));
      const matchCast = movie.cast.some(c => c.toLowerCase().includes(queryClean));
      const matchDirector = movie.director.toLowerCase().includes(queryClean);

      return matchType && (matchTitle || matchDesc || matchGenre || matchCast || matchDirector);
    });
  }, [movies, queryClean, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Search Header & Input */}
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-3">
          Search AdamFlix
        </h1>
        <p className="text-xs sm:text-sm text-[#A7AFBF] mb-6">
          Find movies, television shows, favorite actors, directors, and genres
        </p>

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search movies and TV shows..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full bg-[#101521] text-white text-sm sm:text-base pl-12 pr-10 py-3.5 rounded-2xl border border-[#1E2638] focus:border-[#7C5CFF] focus:outline-none focus:ring-1 focus:ring-[#7C5CFF] shadow-xl placeholder-[#A7AFBF]/50"
            autoFocus
          />
          <Search className="absolute left-4 top-4 w-5 h-5 text-[#A7AFBF]" />
          {localQuery && (
            <button
              type="button"
              onClick={() => setLocalQuery('')}
              className="absolute right-4 top-4 text-[#A7AFBF] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-[#7C5CFF] text-white'
                : 'bg-[#151B28] text-[#A7AFBF] hover:text-white border border-[#1E2638]'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setTypeFilter('movie')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === 'movie'
                ? 'bg-[#7C5CFF] text-white'
                : 'bg-[#151B28] text-[#A7AFBF] hover:text-white border border-[#1E2638]'
            }`}
          >
            Movies Only
          </button>
          <button
            onClick={() => setTypeFilter('tv')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === 'tv'
                ? 'bg-[#7C5CFF] text-white'
                : 'bg-[#151B28] text-[#A7AFBF] hover:text-white border border-[#1E2638]'
            }`}
          >
            TV Series Only
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="pt-6 border-t border-[#1E2638]">
        {queryClean ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-display">
                Search Results for "{localQuery}"
              </h2>
              <span className="text-xs text-[#A7AFBF]">
                {results.length} {results.length === 1 ? 'match' : 'matches'} found
              </span>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                {results.map((item) => (
                  <MovieCard key={item.id} movie={item} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-[#101521] rounded-2xl border border-[#1E2638] p-8">
                <Search className="w-12 h-12 text-[#A7AFBF]/40 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No results found.</h3>
                <p className="text-xs text-[#A7AFBF] max-w-sm mx-auto mb-6">
                  We could not find anything matching "{localQuery}". Check your spelling or browse popular categories.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => navigateTo('/movies')}
                    className="px-4 py-2 rounded-xl bg-[#7C5CFF] text-white text-xs font-bold"
                  >
                    Browse Movies
                  </button>
                  <button
                    onClick={() => navigateTo('/genres')}
                    className="px-4 py-2 rounded-xl bg-[#151B28] border border-[#1E2638] text-white text-xs font-bold"
                  >
                    Explore Genres
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center text-[#A7AFBF]">
            <p className="text-sm">Type a search query above to find movies, shows, and talent.</p>
          </div>
        )}
      </div>
    </div>
  );
};
