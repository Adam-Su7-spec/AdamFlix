import React, { useState } from 'react';
import { Tv, Sparkles, TrendingUp, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MovieCard } from '../common/MovieCard';
import { CategorySection } from '../common/CategorySection';

export const TVShowsPage: React.FC = () => {
  const { movies, navigateTo } = useApp();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const tvShows = movies.filter(m => m.type === 'tv');

  const latestShows = [...tvShows].sort((a, b) => b.releaseYear - a.releaseYear);
  const trendingShows = tvShows.filter(t => t.badges?.includes('TRENDING') || t.rating >= 8.8);
  const mostWatchedShows = [...tvShows].sort((a, b) => b.views - a.views);

  const filteredShows = selectedGenre === 'all'
    ? tvShows
    : tvShows.filter(t => t.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-[#1E2638]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7C5CFF] uppercase tracking-wider mb-1">
          <Tv className="w-4 h-4" />
          <span>Serialized Storytelling</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          TV Shows & Series
        </h1>
        <p className="text-sm text-[#A7AFBF] mt-1">
          Binge acclaimed drama series, sci-fi sagas, and mystery thrillers in Ultra HD
        </p>
      </div>

      {/* Featured TV Carousels */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-12">
        <CategorySection
          title="Trending TV Shows"
          movies={trendingShows}
          aspectRatio="landscape"
        />

        <CategorySection
          title="Latest TV Releases"
          movies={latestShows}
          aspectRatio="poster"
        />

        <CategorySection
          title="Most Watched Series"
          movies={mostWatchedShows}
          aspectRatio="poster"
        />
      </div>

      {/* All TV Shows Complete Grid */}
      <div className="pt-6 border-t border-[#1E2638]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white font-display">
            All Television Shows ({filteredShows.length})
          </h2>

          {/* Quick Filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {['all', 'Science Fiction', 'Action', 'Drama', 'Mystery', 'Crime'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedGenre(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedGenre === cat
                    ? 'bg-[#7C5CFF] text-white shadow-md shadow-[#7C5CFF]/30'
                    : 'bg-[#151B28] text-[#A7AFBF] hover:text-white border border-[#1E2638]'
                }`}
              >
                {cat === 'all' ? 'All Genres' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Series Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {filteredShows.map((show) => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      </div>
    </div>
  );
};
