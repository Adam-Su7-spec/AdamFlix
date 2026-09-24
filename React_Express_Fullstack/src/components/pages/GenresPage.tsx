import React from 'react';
import { Layers, ArrowRight, Film } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_GENRES, GENRE_METADATA } from '../../data/mockData';
import { MovieCard } from '../common/MovieCard';

export const GenresPage: React.FC = () => {
  const { movies, routeParams, navigateTo } = useApp();
  const currentGenre = routeParams.genre;

  // If a specific genre is selected (e.g. /genre/Action)
  if (currentGenre) {
    const genreMovies = movies.filter(m => 
      m.genres.some(g => g.toLowerCase() === currentGenre.toLowerCase())
    );
    const meta = GENRE_METADATA[currentGenre] || {
      description: `Explore the premier collection of ${currentGenre} cinematic features and series.`,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80'
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Genre Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#101521] border border-[#1E2638] mb-10 h-56 sm:h-72 flex items-end p-6 sm:p-10">
          <img
            src={meta.image}
            alt={currentGenre}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/50 to-transparent" />
          
          <div className="relative z-10 max-w-xl">
            <button
              onClick={() => navigateTo('/genres')}
              className="text-xs font-semibold text-[#00D4FF] hover:underline mb-2 flex items-center gap-1 cursor-pointer"
            >
              ← Back to All Genres
            </button>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display mb-2">
              {currentGenre}
            </h1>
            <p className="text-sm text-[#A7AFBF] line-clamp-2">
              {meta.description}
            </p>
          </div>
        </div>

        {/* Content Count & Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Available Titles ({genreMovies.length})
          </h2>
        </div>

        {genreMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {genreMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#101521] rounded-2xl border border-[#1E2638] p-8">
            <Film className="w-12 h-12 text-[#A7AFBF]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No titles found for {currentGenre}</h3>
            <p className="text-xs text-[#A7AFBF] mb-4">Check back soon as new additions are made daily.</p>
            <button
              onClick={() => navigateTo('/genres')}
              className="px-4 py-2 rounded-xl bg-[#7C5CFF] text-white text-xs font-semibold"
            >
              Browse Other Genres
            </button>
          </div>
        )}
      </div>
    );
  }

  // All Genres Overview Grid
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#1E2638]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00D4FF] uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Curated Categories</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Movie & TV Genres
        </h1>
        <p className="text-sm text-[#A7AFBF] mt-1">
          Explore specialized thematic collections from high-octane action to mind-bending sci-fi
        </p>
      </div>

      {/* Large Genre Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {ALL_GENRES.map((genre) => {
          const meta = GENRE_METADATA[genre] || {
            description: 'Explore breathtaking stories and compelling character arcs.',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
          };
          const count = movies.filter(m => m.genres.some(g => g.toLowerCase() === genre.toLowerCase())).length;

          return (
            <div
              key={genre}
              onClick={() => navigateTo(`/genre/${genre}`, { genre })}
              className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#151B28] border border-[#1E2638] hover:border-[#7C5CFF] hover:shadow-2xl hover:shadow-[#7C5CFF]/20 transition-all duration-300 cursor-pointer flex flex-col justify-end p-6"
            >
              {/* Background Art */}
              <img
                src={meta.image}
                alt={genre}
                className="absolute inset-0 w-full h-full object-cover object-center brightness-40 transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/70 to-transparent" />

              {/* Card Text & Indicator */}
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display group-hover:text-[#00D4FF] transition-colors">
                    {genre}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-[#151B28]/80 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#7C5CFF] group-hover:border-[#7C5CFF] transition-all">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <p className="text-xs text-[#A7AFBF] line-clamp-2 leading-relaxed mb-2.5">
                  {meta.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#00D4FF]">
                  <span>{count} {count === 1 ? 'Title' : 'Titles'} Available</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
